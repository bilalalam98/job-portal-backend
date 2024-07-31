import { Controller, Get, Param, Post, Req } from '@nestjs/common';
import { JobService } from './job.service';

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
  getAllJobs() {
    return this.jobService.getAllJobs();
  }

  @Get(':id')
  getJobById(@Param('id') id: string) {
    return this.jobService.getJobById(id);
  }
}
