import { Injectable } from '@nestjs/common';
import * as admin from 'firebase-admin';

@Injectable()
export class NotificationsService {
  private get db() { return admin.firestore(); }

  async sendAndSave(userId: string, title: string, body: string) {
    // 1. Save to Firestore
    await this.db.collection('notifications').add({
      userId,
      title,
      body,
      isRead: false,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
    });
    // 2. Logic for FCM Push can be added here
  }
}