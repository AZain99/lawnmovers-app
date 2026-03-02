import { Injectable } from '@nestjs/common';
import * as admin from 'firebase-admin';

@Injectable()
export class DisputesService {
  private get db() {
    return admin.firestore();
  }

  async raiseDispute(data: { jobId: string; reason: string; description: string; raisedBy: string }) {
    return await this.db.collection('disputes').add({
      ...data,
      status: 'open',
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
    });
  }

  async getDisputeById(id: string) {
    const doc = await this.db.collection('disputes').doc(id).get();
    return { id: doc.id, ...doc.data() };
  }

  async resolveDispute(id: string, resolution: string) {
    return await this.db.collection('disputes').doc(id).update({
      status: 'resolved',
      resolution,
      resolvedAt: admin.firestore.FieldValue.serverTimestamp(),
    });
  }
}