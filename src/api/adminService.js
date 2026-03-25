import { db } from '../firebase'; // Import the db instance from the config above
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
  serverTimestamp 
} from 'firebase/firestore';

/**
 * Helper to parse endpoint URLs into collection names and IDs
 * Example: '/jobs/JOB-123/status' -> collection: 'jobs', id: 'JOB-123'
 */
const parsePath = (url) => {
  const parts = url.split('/').filter(p => p && p !== 'admin');
  return {
    collectionName: parts[0],
    docId: parts[1]
  };
};

export const adminApi = {
  get: async (url) => {
    const { collectionName } = parsePath(url);

    // 1. Handle Dashboard Statistics
    if (url.includes('/stats')) {
      const usersSnap = await getDocs(collection(db, 'users'));
      const jobsSnap = await getDocs(collection(db, 'jobs'));
      const disputeSnap = await getDocs(query(collection(db, 'disputes'), where('status', '==', 'open')));
      
      // Get 5 most recent jobs for the dashboard table
      const recentJobsQuery = query(collection(db, 'jobs'), orderBy('createdAt', 'desc'), limit(5));
      const recentSnap = await getDocs(recentJobsQuery);

      return {
        data: {
          overview: {
            totalRevenue: 12450.00, // Recommendation: Use a Cloud Function for real-time aggregate
            activeJobs: jobsSnap.docs.filter(d => d.data().status === 'in_progress').length,
            totalUsers: usersSnap.size,
            pendingWithdrawals: 0,
            openDisputes: disputeSnap.size
          },
          recentJobs: recentSnap.docs.map(d => ({ id: d.id, ...d.data() }))
        }
      };
    }

    // 2. Handle Global Settings
    if (collectionName === 'settings') {
      const docRef = doc(db, 'config', 'platformSettings');
      const snap = await getDoc(docRef);
      return { data: snap.exists() ? snap.data() : {} };
    }

    // 3. Default: Fetch full collections (Users, Jobs, Disputes, etc.)
    try {
      const querySnapshot = await getDocs(collection(db, collectionName));
      const data = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      return { data };
    } catch (error) {
      console.error(`Error fetching ${collectionName}:`, error);
      return { data: [] };
    }
  },

  patch: async (url, updateData) => {
    const { collectionName, docId } = parsePath(url);
    if (!docId) throw new Error("Document ID required for update");

    try {
      const docRef = doc(db, collectionName, docId);
      await updateDoc(docRef, {
        ...updateData,
        updatedAt: serverTimestamp()
      });
      return { data: { success: true } };
    } catch (error) {
      console.error("Update failed:", error);
      throw error;
    }
  },

  post: async (url, postData) => {
    const { collectionName, docId } = parsePath(url);

    // Special Logic: Support Ticket Replies
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

    // Special Logic: Update Settings
    if (collectionName === 'settings') {
      const docRef = doc(db, 'config', 'platformSettings');
      await updateDoc(docRef, postData);
      return { data: { success: true } };
    }

    // Default: Add new document to a collection
    try {
      const docRef = await addDoc(collection(db, collectionName), {
        ...postData,
        createdAt: serverTimestamp()
      });
      return { data: { id: docRef.id, success: true } };
    } catch (error) {
      console.error("Creation failed:", error);
      throw error;
    }
  }
};

export default adminApi;