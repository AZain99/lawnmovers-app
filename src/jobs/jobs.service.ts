import { Injectable } from '@nestjs/common';
import * as admin from 'firebase-admin';

@Injectable()
export class JobsService {
  private get db() {
    return admin.firestore();
  }

  async createJob(customerId: string, data: any) {
    return await this.db.collection('jobs').add({
      customerId,
      serviceName: data.serviceName,
      price: data.price,
      location: data.location,
      status: 'Requested',
      timestamp: admin.firestore.FieldValue.serverTimestamp(),
    });
  }

  async getJobsByRole(userId: string, role: string) {
    const field = role === 'Provider' ? 'providerId' : 'customerId';
    const snapshot = await this.db.collection('jobs')
      .where(field, '==', userId)
      .get();
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  }

  // FIXED: Changed name to updateJobStatus and added providerId parameter
  async updateJobStatus(jobId: string, status: string, providerId?: string) {
    const updateData: any = { status };
    if (providerId) updateData.providerId = providerId;
    
    return await this.db.collection('jobs').doc(jobId).update(updateData);
  }
}