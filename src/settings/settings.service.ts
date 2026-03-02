import { Injectable } from '@nestjs/common';
import * as admin from 'firebase-admin';

@Injectable()
export class SettingsService {
  private get db() { return admin.firestore(); }

  async getSettings() {
    const doc = await this.db.collection('settings').doc('platform_config').get();
    return doc.data();
  }

  async updateSettings(data: any) {
    return await this.db.collection('settings').doc('platform_config').set({
      ...data,
      updatedAt: admin.firestore.FieldValue.serverTimestamp(),
    }, { merge: true });
  }
}