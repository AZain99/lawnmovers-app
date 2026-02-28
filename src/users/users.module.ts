async createProfile(uid: string, email: string, role: string) {
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
  return await admin.firestore().collection('users').doc(uid).set({
    email,
    role, // 'Customer' or 'Provider'
    createdAt: admin.firestore.FieldValue.serverTimestamp(),
    displayName: email.split('@')[0]
  });
}