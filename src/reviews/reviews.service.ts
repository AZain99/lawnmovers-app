import { Injectable } from '@nestjs/common';
import * as admin from 'firebase-admin';

@Injectable()
export class ReviewsService {
  private get db() { return admin.firestore(); }

  async addReview(data: any) {
    return await this.db.collection('reviews').add({
      ...data,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
    });
  }
}