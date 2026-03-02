import { Injectable } from '@nestjs/common';
import * as admin from 'firebase-admin';

@Injectable()
export class SupportService {
  private get db() { return admin.firestore(); }

  async createTicket(data: any) {
    return await this.db.collection('support_tickets').add({
      ...data,
      status: 'open',
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
    });
  }
}