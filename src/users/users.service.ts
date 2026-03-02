import { Injectable } from '@nestjs/common';
import * as admin from 'firebase-admin';

@Injectable()
export class UsersService {
  private get db() { return admin.firestore(); }

  async createProfile(uid: string, data: any) {
    const batch = this.db.batch();
    const userRef = this.db.collection('users').doc(uid);
    
    batch.set(userRef, {
      uid,
      name: data.name,
      email: data.email,
      role: data.role, // 'customer' | 'provider' | 'admin'
      status: 'active',
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
    });

    const roleCollection = data.role === 'customer' ? 'customers' : 'providers';
    batch.set(this.db.collection(roleCollection).doc(uid), {
      userId: uid,
      ...(data.role === 'provider' ? { isApproved: false, totalEarnings: 0 } : { savedAddresses: [] })
    });

    return await batch.commit();
  }

  async findOne(uid: string) {
    const doc = await this.db.collection('users').doc(uid).get();
    return doc.data();
  }
}