import { Injectable, InternalServerErrorException } from '@nestjs/common';
import * as admin from 'firebase-admin';

@Injectable()
export class PaymentsService {
  /**
   * Use a getter to ensure Firebase Admin is fully initialized 
   * before attempting to access Firestore.
   */
  private get db() {
    return admin.firestore();
  }

  /**
   * Process a payment and update the job status.
   * Based on Collection #5 (payments) in your document.
   */
  async processPayment(jobId: string, paymentData: {
    customerId: string;
    providerId: string;
    amount: number;
    method: string;
    transactionId: string;
  }) {
    try {
      // 1. Fetch Platform Settings for Commission/Tax (Collection #11)
      const settingsDoc = await this.db.collection('settings').doc('platform_config').get();
      const settings = settingsDoc.data() || { commissionPercentage: 15, taxPercentage: 5 };

      const amount = paymentData.amount;
      const tax = amount * (settings.taxPercentage / 100);
      const commission = amount * (settings.commissionPercentage / 100);
      const providerPayout = amount - (commission + tax);

      const batch = this.db.batch();

      // 2. Create Payment Record (Collection #5)
      const paymentRef = this.db.collection('payments').doc();
      batch.set(paymentRef, {
        jobId,
        customerId: paymentData.customerId,
        providerId: paymentData.providerId,
        amount,
        tax,
        commission,
        providerPayout,
        paymentMethod: paymentData.method,
        transactionId: paymentData.transactionId,
        status: 'completed',
        createdAt: admin.firestore.FieldValue.serverTimestamp(),
      });

      // 3. Update Job Status to 'completed' (Collection #4)
      const jobRef = this.db.collection('jobs').doc(jobId);
      batch.update(jobRef, {
        status: 'completed',
        paymentStatus: 'paid',
        updatedAt: admin.firestore.FieldValue.serverTimestamp(),
      });

      // 4. Update Provider's total earnings (Collection #3)
      const providerRef = this.db.collection('providers').doc(paymentData.providerId);
      batch.update(providerRef, {
        totalEarnings: admin.firestore.FieldValue.increment(providerPayout),
      });

      // Commit all changes at once
      await batch.commit();

      return {
        success: true,
        paymentId: paymentRef.id,
        payout: providerPayout,
      };
    } catch (error) {
      console.error('Payment Processing Error:', error);
      throw new InternalServerErrorException('Failed to process payment record in Firestore');
    }
  }

  /**
   * Get payment history for a specific user
   */
  async getPaymentHistory(userId: string, role: 'customer' | 'provider') {
    const field = role === 'customer' ? 'customerId' : 'providerId';
    const snapshot = await this.db
      .collection('payments')
      .where(field, '==', userId)
      .orderBy('createdAt', 'desc')
      .get();

    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    }));
  }
}