import {
  Controller,
  Get,
  Post,
  Param,
  NotFoundException,
  Req,
} from '@nestjs/common';
import { JobService } from './job.service';
import { Job } from './job.model';

@Controller('jobs')
export class JobController {
  constructor(private readonly jobService: JobService) {}

  @Post()
  async createJob(@Req() req: any): Promise<{ jobId: string }> {
    const clientId = req.headers['x-client-id'];
    const jobId = await this.jobService.createJob(clientId);
    return { jobId };
  }

  @Get()
  getAllJobs(): Job[] {
    return this.jobService.getJobs();
  }

  @Get(':jobId')
  getJobById(@Param('jobId') jobId: string): Job {
    const job = this.jobService.getJobById(jobId);
    if (!job) {
      throw new NotFoundException(`Job with ID ${jobId} not found`);
    }
    return job;
  }
}
