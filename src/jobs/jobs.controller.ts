import { Controller, Post, Get, Body, UseGuards, Req } from '@nestjs/common';
import { JobsService } from './jobs.service';
import { FirebaseAuthGuard } from '../auth/auth.guard';

@Controller('jobs')
export class JobsController {
  constructor(private readonly jobsService: JobsService) {}

  @UseGuards(FirebaseAuthGuard)
  @Post('book')
  async book(@Req() req, @Body() body: any) {
    // Matches the 'Book Now' button in ServiceBookingActivity
    return this.jobsService.createJob(req.user.uid, body);
  }

  @UseGuards(FirebaseAuthGuard)
  @Get('my-list')
  async list(@Req() req) {
    // Matches the recycler view in CustomerJobTrackingActivity
    // You'd pass role from a database check or custom claim
    return this.jobsService.getJobsByRole(req.user.uid, 'Customer');
  }
}


// val user = FirebaseAuth.getInstance().currentUser
// user?.getIdToken(true)?.addOnSuccessListener { result ->
//     val token = result.token
//     // Send this token in your 'Authorization: Bearer <token>' header
// }