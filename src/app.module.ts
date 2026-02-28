import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { FirebaseModule } from './firebase/firebase.module';
import { JobsService } from './jobs/jobs.service';

@Module({
  imports: [FirebaseModule],
  controllers: [AppController],
  providers: [AppService, JobsService],
})
export class AppModule {}