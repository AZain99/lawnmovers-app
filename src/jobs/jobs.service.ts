import { Injectable } from '@nestjs/common';
import * as admin from 'firebase-admin';

@Injectable()
export class JobsService {
  private db = admin.firestore();

  // For Customer: Create a new booking
  async createJob(customerId: string, jobDto: any) {
    const newJob = {
      customerId,
      title: jobDto.serviceName,
      status: 'Requested',
      price: jobDto.price,
      location: jobDto.location,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
    };
    return await this.db.collection('jobs').add(newJob);
  }

  // For Provider/Customer: Get jobs by status (Used in ProviderDashboardActivity)
  async getJobsByRole(userId: string, role: string) {
    const field = role === 'Customer' ? 'customerId' : 'providerId';
    const snapshot = await this.db.collection('jobs')
      .where(field, '==', userId)
      .get();
      
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  }
}