import { Controller, Post, Get, Body, UseGuards, Req, Patch, Param } from '@nestjs/common';
import { WithdrawalsService } from './withdrawals.service';
import { FirebaseAuthGuard } from '../auth/firebase-auth.guard';

@Controller('withdrawals')
export class WithdrawalsController {
  constructor(private readonly withdrawalsService: WithdrawalsService) {}

  // Provider requests a payout
  @UseGuards(FirebaseAuthGuard)
  @Post('request')
  async request(@Req() req, @Body() body: { amount: number; method: string }) {
    return this.withdrawalsService.requestWithdrawal(req.user.uid, body.amount, body.method);
  }

  // Admin views all pending requests
  @UseGuards(FirebaseAuthGuard)
  @Get('admin/all')
  async getAll() {
    return this.withdrawalsService.getPendingWithdrawals();
  }

  // Admin approves or rejects
  @UseGuards(FirebaseAuthGuard)
  @Patch(':id/status')
  async updateStatus(@Param('id') id: string, @Body('status') status: 'approved' | 'rejected') {
    return this.withdrawalsService.updateWithdrawalStatus(id, status);
  }
}