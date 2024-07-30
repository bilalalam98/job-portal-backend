import { Module } from '@nestjs/common';
import { JobService } from './job.service';
import { JobController } from './job.controller';
import { ScheduleModule } from '@nestjs/schedule';
import { EventsGateway } from 'src/events/event.gateway';

@Module({
  imports: [ScheduleModule.forRoot(), EventsGateway],
  providers: [JobService, EventsGateway],
  controllers: [JobController],
})
export class JobModule {}
