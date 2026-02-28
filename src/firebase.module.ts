import { Module, Global } from '@nestjs/common';
import * as admin from 'firebase-admin';
import * as path from 'path';

@Global()
@Module({
  providers: [{
    provide: 'FIREBASE_ADMIN',
    useFactory: () => {
      // Download this JSON from Firebase Console -> Project Settings -> Service Accounts
    const serviceAccount = require(path.join(process.cwd(), 'serviceAccountKey.json'));
      if (!admin.apps.length) {
        admin.initializeApp({
            credential: admin.credential.cert(serviceAccount),
        });
        }
        return admin.app()
    },
  }],
  exports: ['FIREBASE_ADMIN'],
})
export class FirebaseModule {}