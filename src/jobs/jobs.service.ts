import { Injectable } from '@nestjs/common';
import * as admin from 'firebase-admin';

@Injectable()
export class JobsService {
  private get db() { return admin.firestore(); }

  async createJob(jobData: any) {
    return await this.db.collection('jobs').add({
      ...jobData,
      status: 'pending_approval',
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
    });
  }

  async updateStatus(jobId: string, status: string) {
    return await this.db.collection('jobs').doc(jobId).update({
      status,
      updatedAt: admin.firestore.FieldValue.serverTimestamp(),
    });
  }
}