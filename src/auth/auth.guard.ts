import { Injectable, CanActivate, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import * as admin from 'firebase-admin';

@Injectable()
export class FirebaseAuthGuard implements CanActivate {
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const token = request.headers.authorization?.split('Bearer ')[1];

    if (!token) throw new UnauthorizedException();

    try {
      const decodedToken = await admin.auth().verifyIdToken(token);
      request.user = decodedToken; // Attach user (uid, email) to request
      return true;
    } catch (error) {
      throw new UnauthorizedException();
    }
  }
}