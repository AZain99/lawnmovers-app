import { Injectable } from '@nestjs/common';
import * as admin from 'firebase-admin';

@Injectable()
export class WithdrawalsService {
  private get db() {
    return admin.firestore();
  }

  async requestWithdrawal(providerId: string, amount: number, method: string) {
    return await this.db.collection('withdrawals').add({
      providerId,
      amount,
      method,
      status: 'pending',
      requestedAt: admin.firestore.FieldValue.serverTimestamp(),
    });
  }

  async getPendingWithdrawals() {
    const snapshot = await this.db.collection('withdrawals')
      .where('status', '==', 'pending')
      .get();
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  }

  async updateWithdrawalStatus(id: string, status: 'approved' | 'rejected') {
    return await this.db.collection('withdrawals').doc(id).update({
      status,
      processedAt: admin.firestore.FieldValue.serverTimestamp(),
    });
  }
}