import { Injectable } from '@nestjs/common';
import { writeFileSync, readFileSync, existsSync, mkdirSync } from 'fs';
import { resolve } from 'path';
import { Job } from './job.model';
import { v4 as uuidv4 } from 'uuid';
import axios from 'axios';
import { ConfigService } from '@nestjs/config';
import { EventsGateway } from 'src/events/event.gateway';

@Injectable()
export class JobService {
  private readonly filePath: string;

  constructor(
    private readonly configService: ConfigService,
    private readonly eventsGateway: EventsGateway,
  ) {
    this.filePath = resolve(__dirname, '../../jobs.json');
    this.ensureFileExists();
  }

  private ensureFileExists(): void {
    const dirPath = resolve(__dirname, '../../');
    if (!existsSync(dirPath)) {
      mkdirSync(dirPath, { recursive: true });
    }

    if (!existsSync(this.filePath)) {
      writeFileSync(this.filePath, JSON.stringify([]));
    }
  }

  private readJobs(): Job[] {
    try {
      const fileContent = readFileSync(this.filePath, 'utf-8');
      return JSON.parse(fileContent);
    } catch (error) {
      console.error('Error reading jobs file:', error);
      return [];
    }
  }

  private writeJobs(jobs: Job[]): void {
    try {
      writeFileSync(this.filePath, JSON.stringify(jobs, null, 2));
    } catch (error) {
      console.error('Error writing jobs file:', error);
    }
  }

  async createJob(clientId: string): Promise<string> {
    const jobId = uuidv4();
    const delay = Math.floor(Math.random() * 30000) + 5000;

    const fetchRandomImage = async (): Promise<string> => {
      try {
        const response = await axios.get(
          `https://api.unsplash.com/photos/random?query=food&client_id=${this.configService.get<string>('UNSPLASH_ACCESS_KEY')}`,
        );
        return response.data.urls.small;
      } catch (error) {
        console.error('Error fetching random image for loader:', error);
        throw new Error('Failed to fetch image');
      }
    };

    const imageUrl = await fetchRandomImage();
    const newJob: Job = { jobId, imageUrl, status: 'pending' };
    this.writeJobs([...this.readJobs(), newJob]);
    this.eventsGateway.handleJobStatusUpdate(clientId, 'pending', newJob);

    return new Promise((resolve, reject) => {
      setTimeout(async () => {
        try {
          const jobs = this.readJobs();
          const jobIndex = jobs.findIndex((job) => job.jobId === jobId);
          if (jobIndex > -1) {
            jobs[jobIndex].status = 'resolved';
            this.writeJobs(jobs);
            this.eventsGateway.handleJobStatusUpdate(
              clientId,
              'resolved',
              jobs[jobIndex],
            );
            console.log(`Job ${jobId} resolved`);
          } else {
            console.error('Job not found for resolution:', jobId);
          }
          resolve(jobId);
        } catch (error) {
          console.error('Error in job execution:', error);
          this.eventsGateway.handleJobStatusUpdate(clientId, 'failed', {
            jobId,
            error: error.message,
          });
          reject(error);
        }
      }, delay);
    });
  }

  getJobs(): Job[] {
    return this.readJobs();
  }

  getJobById(jobId: string): Job | undefined {
    return this.readJobs().find((job) => job.jobId === jobId);
  }
}
