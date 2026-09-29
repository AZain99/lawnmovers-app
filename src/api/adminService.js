import { db } from '../firebase';
import {
  collection,
  getDocs,
  getDoc,
  doc,
  updateDoc,
  addDoc,
  query,
  where,
  orderBy,
  limit,
  serverTimestamp,
  getCountFromServer,
  startAfter,
  endBefore,
  limitToLast
} from 'firebase/firestore';

const DEFAULT_LIST_LIMIT = 20;

const parsePath = (url) => {
  const trimmed = url.replace(/^\/+|\/+$/g, '');
  const parts = trimmed.split('/').filter(Boolean);

  if (parts.length === 1 && parts[0] === 'admin') {
    return { collectionName: 'admin', docId: undefined };
  }

  if (parts[0] === 'admin') parts.shift();

  return {
    collectionName: parts[0],
    docId: parts[1]
  };
};

const getLimitedCollectionQuery = (collectionName, options = {}) => {
  const {
    filters = [],
    orderField = 'createdAt',
    orderDirection = 'desc',
    pageSize = DEFAULT_LIST_LIMIT,
    lastVisible = null,
    direction = 'next'
  } = options;

  let baseQuery = collection(db, collectionName);

  if (filters.length) {
    baseQuery = query(baseQuery, ...filters);
  }

  let orderedQuery = query(baseQuery, orderBy(orderField, orderDirection));

  if (lastVisible) {
    if (direction === 'next') {
      orderedQuery = query(orderedQuery, startAfter(lastVisible), limit(pageSize));
    } else {
      orderedQuery = query(orderedQuery, endBefore(lastVisible), limitToLast(pageSize));
    }
  } else {
    orderedQuery = query(orderedQuery, limit(pageSize));
  }

  return orderedQuery;
};

const normalizeStatus = (value) => String(value ?? '').trim().toLowerCase().replace(/[_\s-]+/g, '');

const isSuccessfulPayment = (status) => {
  const normalized = normalizeStatus(status);
  return ['succeeded', 'success', 'paid', 'completed', 'complete', 'approved'].includes(normalized) || normalized === '';
};

const isActiveJob = (status) => {
  const normalized = normalizeStatus(status);
  return ['active', 'assigned', 'inprogress', 'in_progress', 'inprogress', 'pendingapproval', 'pending_approval', 'accepted', 'scheduled'].includes(normalized);
};

const isPendingPayout = (status) => {
  const normalized = normalizeStatus(status);
  return ['pending', 'pendingapproval', 'awaitingapproval', 'requested', 'inreview', 'processing'].includes(normalized);
};

const isOpenDispute = (status) => {
  const normalized = normalizeStatus(status);
  return ['open', 'new', 'pending', 'unresolved', 'inreview'].includes(normalized);
};

export const adminApi = {
  list: async (collectionName, options = {}) => {
    const {
      pageSize = DEFAULT_LIST_LIMIT,
      orderField = 'createdAt',
      orderDirection = 'desc',
      lastVisible = null,
      filters = [],
      direction = 'next'
    } = options;

    try {
      const queryRef = getLimitedCollectionQuery(collectionName, {
        filters,
        orderField,
        orderDirection,
        pageSize,
        lastVisible,
        direction
      });

      const querySnapshot = await getDocs(queryRef);
      const data = querySnapshot.docs.map(docSnap => ({
        id: docSnap.id,
        ...docSnap.data()
      }));

      const hasMore = querySnapshot.docs.length >= pageSize;
      const nextLastVisible = querySnapshot.docs[querySnapshot.docs.length - 1] || null;

      return { data, hasMore, lastVisible: nextLastVisible };
    } catch (error) {
      console.error(`Paginated fetch failed for ${collectionName}:`, error);
      return { data: [], hasMore: false, lastVisible: null };
    }
  },

  get: async (url, options = {}) => {
    const { collectionName } = parsePath(url);

    if (url.includes('/stats')) {
      const [usersSnap, jobsSnap, disputesSnap, recentJobsSnap, paymentsSnap, withdrawalsSnap] = await Promise.all([
        getDocs(collection(db, 'users')),
        getDocs(collection(db, 'jobs')),
        getDocs(collection(db, 'disputes')),
        getDocs(query(collection(db, 'jobs'), orderBy('createdAt', 'desc'), limit(5))),
        getDocs(collection(db, 'payments')),
        getDocs(collection(db, 'withdrawals'))
      ]);

      const totalRevenue = paymentsSnap.docs.reduce((sum, paymentDoc) => {
        const payment = paymentDoc.data() || {};
        const status = String(payment.status || '').toLowerCase();

        if (!isSuccessfulPayment(status)) return sum;

        const revenueValue = Number(payment.commission ?? payment.amount ?? 0);
        return sum + (Number.isFinite(revenueValue) ? revenueValue : 0);
      }, 0);

      const activeJobs = jobsSnap.docs.filter(doc => {
        const job = doc.data() || {};
        return isActiveJob(job.status);
      }).length;

      const pendingWithdrawals = withdrawalsSnap.docs.filter(doc => {
        const withdrawal = doc.data() || {};
        return isPendingPayout(withdrawal.status);
      }).length;

      const openDisputes = disputesSnap.docs.filter(doc => {
        const dispute = doc.data() || {};
        return isOpenDispute(dispute.status);
      }).length;

      return {
        data: {
          overview: {
            totalRevenue: Number(totalRevenue.toFixed(2)),
            activeJobs,
            totalUsers: usersSnap.size,
            pendingWithdrawals,
            openDisputes
          },
          recentJobs: recentJobsSnap.docs.map(d => ({ id: d.id, ...d.data() }))
        }
      };
    }

    if (collectionName === 'settings') {
      const docRef = doc(db, 'config', 'platformSettings');
      const snap = await getDoc(docRef);
      return { data: snap.exists() ? snap.data() : {} };
    }

    const isCollectionListRequest = url.endsWith('/all') || url === `/${collectionName}` || url.includes('/all');

    if (isCollectionListRequest) {
      const page = await adminApi.list(collectionName, {
        pageSize: options.pageSize || DEFAULT_LIST_LIMIT,
        orderField: options.orderField || 'createdAt',
        orderDirection: options.orderDirection || 'desc',
        lastVisible: options.lastVisible || null,
        filters: options.filters || []
      });
      return page;
    }

    try {
      const querySnapshot = await getDocs(collection(db, collectionName));
      const data = querySnapshot.docs.map(docSnap => ({ id: docSnap.id, ...docSnap.data() }));
      return { data };
    } catch (error) {
      console.error(`Error fetching ${collectionName}:`, error);
      return { data: [] };
    }
  },

  patch: async (url, updateData) => {
    const { collectionName, docId } = parsePath(url);
    if (!docId) throw new Error('Document ID required for update');

    try {
      const docRef = doc(db, collectionName, docId);
      await updateDoc(docRef, {
        ...updateData,
        updatedAt: serverTimestamp()
      });
      return { data: { success: true } };
    } catch (error) {
      console.error('Update failed:', error);
      throw error;
    }
  },

  post: async (url, postData) => {
    const { collectionName, docId } = parsePath(url);

    if (collectionName === 'support' && url.includes('/reply')) {
      const docRef = doc(db, 'support', docId);
      const ticket = await getDoc(docRef);
      const existingMessages = ticket.data().messages || [];

      await updateDoc(docRef, {
        messages: [...existingMessages, { ...postData, sender: 'admin', timestamp: Date.now() }],
        status: 'responded'
      });
      return { data: { success: true } };
    }

    if (collectionName === 'settings') {
      const docRef = doc(db, 'config', 'platformSettings');
      await updateDoc(docRef, postData);
      return { data: { success: true } };
    }

    try {
      const docRef = await addDoc(collection(db, collectionName), {
        ...postData,
        createdAt: serverTimestamp()
      });
      return { data: { id: docRef.id, success: true } };
    } catch (error) {
      console.error('Creation failed:', error);
      throw error;
    }
  }
};

export default adminApi;