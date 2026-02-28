import { Controller, Post, Body, Get, UseGuards, Req } from '@nestjs/common';
import { UsersService } from './users.service';
import { FirebaseAuthGuard } from '../auth/firebase-auth.guard';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post('signup')
  async signUp(@Body() body: { uid: string; email: string; role: string }) {
    return this.usersService.createProfile(body.uid, body.email, body.role);
  }

  @UseGuards(FirebaseAuthGuard)
  @Get('profile')
  async getProfile(@Req() req) {
    return this.usersService.getProfile(req.user.uid);
  }
}