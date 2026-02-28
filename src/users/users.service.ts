import { Injectable } from '@nestjs/common';
import * as admin from 'firebase-admin';

@Injectable()
export class UsersService {
  private db = admin.firestore();

  async createProfile(uid: string, email: string, role: string) {
    return await this.db.collection('users').doc(uid).set({
      email,
      role, // 'Customer' or 'Provider'
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
      displayName: email.split('@')[0],
    });
  }

  async getProfile(uid: string) {
    const user = await this.db.collection('users').doc(uid).get();
    return user.data();
  }
}