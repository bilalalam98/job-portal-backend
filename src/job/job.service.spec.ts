// import { Injectable } from '@nestjs/common';
// import { v4 as uuidv4 } from 'uuid';
// import axios from 'axios';
// import * as fs from 'fs';
// import { join } from 'path';
// import { SchedulerRegistry } from '@nestjs/schedule';

// @Injectable()
// export class JobService {
//   private readonly jobFile = join(__dirname, 'jobs.json');

//   constructor(private schedulerRegistry: SchedulerRegistry) {}

//   async createJob() {
//     const jobId = uuidv4();
//     const delay = Math.floor(Math.random() * (60 - 1 + 1)) * 5000; // random delay between 5 sec (5000 ms) and 5 min (300000 ms)

//     const job = { id: jobId, status: 'pending', result: null };
//     const jobs = this.readJobsFromFile();
//     jobs.push(job);
//     this.writeJobsToFile(jobs);

//     const timeout = setTimeout(async () => {
//       const result = await this.fetchRandomImage();
//       job.status = 'resolved';
//       job.result = result;
//       this.writeJobsToFile(jobs);
//     }, delay);

//     this.schedulerRegistry.addTimeout(jobId, timeout);

//     return { id: jobId };
//   }

//   getAllJobs() {
//     return this.readJobsFromFile();
//   }

//   getJobById(id: string) {
//     const jobs = this.readJobsFromFile();
//     return jobs.find(job => job.id === id);
//   }

//   private readJobsFromFile() {
//     if (fs.existsSync(this.jobFile)) {
//       return JSON.parse(fs.readFileSync(this.jobFile, 'utf-8'));
//     }
//     return [];
//   }

//   private writeJobsToFile(jobs) {
//     fs.writeFileSync(this.jobFile, JSON.stringify(jobs, null, 2), 'utf-8');
//   }

//   private async fetchRandomImage() {
//     const response = await axios.get('https://source.unsplash.com/random/800x600?food');
//     return response.request.res.responseUrl;
//   }
// }
