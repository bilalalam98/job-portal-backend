import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { JobService } from './job.service';
import { JobController } from './job.controller';
import { EventsGateway } from 'src/events/event.gateway';

@Module({
  imports: [ConfigModule.forRoot()],
  providers: [JobService, EventsGateway],
  controllers: [JobController],
})
export class JobModule {}
