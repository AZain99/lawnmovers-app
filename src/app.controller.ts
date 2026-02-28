import { Controller, Post, Get, Patch, Body, UseGuards, Req, Param } from '@nestjs/common';
import { FirebaseAuthGuard } from './auth/firebase-auth.guard';
import { JobsService } from './jobs/jobs.service';
import * as admin from 'firebase-admin';

@Controller('api')
export class AppController {
  constructor(private readonly jobsService: JobsService) {}

  // 1. SIGNUP & PROFILE (Syncs with SignUpActivity.kt)
  @Post('auth/signup')
  async signup(@Body() body: { uid: string; email: string; role: string }) {
    await admin.firestore().collection('users').doc(body.uid).set({
      email: body.email,
      role: body.role,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
    });
    return { message: 'Profile created' };
  }

  // 2. BOOKING (For ServiceBookingActivity.kt)
  @UseGuards(FirebaseAuthGuard)
  @Post('jobs/book')
  async book(@Req() req, @Body() body: any) {
    return this.jobsService.createJob(req.user.uid, body);
  }

  // 3. TRACKING (For CustomerJobTrackingActivity & ProviderDashboard)
  @UseGuards(FirebaseAuthGuard)
  @Get('jobs/:role')
  async getJobs(@Req() req, @Param('role') role: string) {
    return this.jobsService.getJobsByRole(req.user.uid, role);
  }

  // 4. STATUS UPDATES (For ScheduleActivity/Provider actions)
  @UseGuards(FirebaseAuthGuard)
  @Patch('jobs/:id/status')
  async updateStatus(@Req() req, @Param('id') id: string, @Body('status') status: string) {
    const providerId = status === 'Accepted' ? req.user.uid : undefined;
    return this.jobsService.updateJobStatus(id, status, providerId);
  }

  // 5. PAYMENTS (For CheckoutActivity.kt)
  @UseGuards(FirebaseAuthGuard)
  @Post('payments/confirm')
  async pay(@Req() req, @Body() body: any) {
    const batch = admin.firestore().batch();
    const payRef = admin.firestore().collection('payments').doc();
    
    batch.set(payRef, {
      userId: req.user.uid,
      jobId: body.jobId,
      amount: body.amount,
      method: body.methodTitle,
      status: 'Paid',
      timestamp: admin.firestore.FieldValue.serverTimestamp(),
    });

    batch.update(admin.firestore().collection('jobs').doc(body.jobId), { paymentStatus: 'Paid' });
    await batch.commit();
    return { success: true };
  }
}