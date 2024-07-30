import { Body, Controller, Get, Param, Post, Put } from '@nestjs/common';
import { JobService } from './job.service';

@Controller('jobs')
export class JobController {
  constructor(private readonly jobService: JobService) {}

  @Post()
  createJob(@Body() createJobDto: { title: string; description: string }) {
    const { title, description } = createJobDto;
    return this.jobService.createJob(title, description);
  }

  @Get()
  getAllJobs() {
    return this.jobService.getAllJobs();
  }

  @Get(':id')
  getJobById(@Param('id') id: string) {
    return this.jobService.getJobById(id);
  }

  @Put(':id')
  updateJob(@Param('id') id: string, @Body() updateJobDto: { title: string; description: string }) {
    const { title, description } = updateJobDto;
    return this.jobService.updateJob(id, title, description);
  }
}
