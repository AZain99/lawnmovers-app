import { Module } from '@nestjs/common';
import { FirebaseModule } from './firebase/firebase.module';
import { UsersModule } from './users/users.module';
import { JobsModule } from './jobs/jobs.module';
import { PaymentsModule } from './payments/payments.module';
import { ReviewsModule } from './reviews/reviews.module';
import { WithdrawalsModule } from './withdrawals/withdrawals.module'; // Added
import { DisputesModule } from './disputes/disputes.module';       // Added
import { NotificationsModule } from './notifications/notifications.module';
import { SupportModule } from './support/support.module';
import { SettingsModule } from './settings/settings.module';

@Module({
  imports: [
    FirebaseModule,
    UsersModule,
    JobsModule,
    PaymentsModule,
    ReviewsModule,
    WithdrawalsModule,
    DisputesModule,
    NotificationsModule,
    SupportModule,
    SettingsModule,
  ],
})
export class AppModule {}