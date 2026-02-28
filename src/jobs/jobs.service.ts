import { Injectable } from '@nestjs/common';
import * as admin from 'firebase-admin';

@Injectable()
export class JobsService {
  private db = admin.firestore();

  async createJob(customerId: string, data: any) {
    return await this.db.collection('jobs').add({
      customerId,
      serviceName: data.serviceName,
      propertySize: data.propertySize,
      price: data.price,
      location: data.location,
      status: 'Requested',
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
    });
  }

  async updateJobStatus(jobId: string, status: string, providerId?: string) {
    const updateData: any = { status };
    if (providerId) updateData.providerId = providerId;
    return await this.db.collection('jobs').doc(jobId).update(updateData);
  }

  async getJobsByRole(userId: string, role: string) {
    const field = role === 'Provider' ? 'providerId' : 'customerId';
    const snapshot = await this.db.collection('jobs').where(field, '==', userId).get();
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  }
}