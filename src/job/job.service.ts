// src/jobs/jobs.service.ts
import { Injectable } from '@nestjs/common';
import { writeFileSync, readFileSync, existsSync, mkdirSync } from 'fs';
import { join } from 'path';
import { EventsGateway } from 'src/events/event.gateway';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class JobService {
  private readonly dataFilePath = join(__dirname, '..', 'data', 'jobs.json');

  constructor(private readonly eventsGateway: EventsGateway) {
    this.ensureDataFileExists();
  }

  private ensureDataFileExists() {
    const directory = join(__dirname, '..', 'data');
    if (!existsSync(directory)) {
      mkdirSync(directory, { recursive: true });
    }
    if (!existsSync(this.dataFilePath)) {
      writeFileSync(this.dataFilePath, JSON.stringify([])); // Initialize with an empty array
    }
  }

  async createJob(): Promise<string> {
    const jobId = uuidv4();
    const delay = Math.floor(Math.random() * 30000) + 5000; // Random delay between 5s and 35s

    setTimeout(async () => {
      try {
        const jobResult = { jobId };
        this.saveJobResult(jobResult);
        this.eventsGateway.handleJobStatusUpdate(null, jobResult); // Emit the update
      } catch (error) {
        console.error('Error in job execution:', error);
        // Handle the error appropriately (e.g., mark job as failed)
      }
    }, delay);

    return jobId;
  }

  private saveJobResult(result: any): void {
    const jobs = this.getAllJobsResults();
    const updatedJobs = jobs.filter((job) => job.jobId !== result.jobId); // Remove any existing job with the same ID
    updatedJobs.push(result); // Add the new or updated job result
    console.log('updatedJobs', updatedJobs);
    writeFileSync(this.dataFilePath, JSON.stringify(updatedJobs, null, 2)); // Save to file
  }

  private getAllJobsResults(): any[] {
    try {
      const data = readFileSync(this.dataFilePath, 'utf-8');
      console.log('data', data);
      const parsedData = JSON.parse(data);
      console.log('parsedData', parsedData);
      return parsedData;
    } catch {
      return [];
    }
  }

  getAllJobs() {
    return this.getAllJobsResults();
  }

  getJobById(id: string) {
    const jobs = this.getAllJobsResults();
    return jobs.find((job) => job.jobId === id) || null;
  }
}
