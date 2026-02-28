import { Module, Global } from '@nestjs/common';
import * as admin from 'firebase-admin';
import * as path from 'path';
import * as fs from 'fs';

@Global()
@Module({
  providers: [
    {
      provide: 'FIREBASE_ADMIN',
      useFactory: () => {
        // This creates an absolute path to the root folder
        const filePath = path.resolve(process.cwd(), 'serviceAccountKey.json');

        // Check if file exists before trying to initialize
        if (!fs.existsSync(filePath)) {
          throw new Error(`CRITICAL: Firebase key missing at ${filePath}. Place your JSON file in the project root.`);
        }

        if (admin.apps.length === 0) {
          admin.initializeApp({
            credential: admin.credential.cert(filePath),
          });
          console.log('Firebase Initialized Successfully! ✅');
        }
        return admin.app();
      },
    },
  ],
  exports: ['FIREBASE_ADMIN'],
})
export class FirebaseModule {}