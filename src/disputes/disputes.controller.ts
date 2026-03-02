import { Controller, Post, Get, Body, UseGuards, Req, Param, Patch } from '@nestjs/common';
import { DisputesService } from './disputes.service';
import { FirebaseAuthGuard } from '../auth/firebase-auth.guard';

@Controller('disputes')
export class DisputesController {
  constructor(private readonly disputesService: DisputesService) {}

  // Customer or Provider raises a dispute
  @UseGuards(FirebaseAuthGuard)
  @Post('raise')
  async raise(@Req() req, @Body() body: { jobId: string; reason: string; description: string }) {
    return this.disputesService.raiseDispute({
      ...body,
      raisedBy: req.user.uid
    });
  }

  // Admin gets a specific dispute
  @UseGuards(FirebaseAuthGuard)
  @Get(':id')
  async getDispute(@Param('id') id: string) {
    return this.disputesService.getDisputeById(id);
  }

  // Admin resolves the dispute
  @UseGuards(FirebaseAuthGuard)
  @Patch(':id/resolve')
  async resolve(@Param('id') id: string, @Body('resolution') resolution: string) {
    return this.disputesService.resolveDispute(id, resolution);
  }
}