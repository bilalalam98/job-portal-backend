import { Module } from '@nestjs/common';
import { JobService } from './job.service';
import { JobController } from './job.controller';
import { EventsGateway } from 'src/events/event.gateway';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [ConfigModule.forRoot(), EventsGateway],
  providers: [JobService, EventsGateway],
  controllers: [JobController],
})
export class JobModule {}
