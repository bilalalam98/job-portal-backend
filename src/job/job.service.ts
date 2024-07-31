// src/jobs/jobs.service.ts
import { Injectable } from '@nestjs/common';
import axios from 'axios';
import { writeFileSync, readFileSync, existsSync, mkdirSync } from 'fs';
import { join } from 'path';
import { EventsGateway } from 'src/events/event.gateway';
import { v4 as uuidv4 } from 'uuid';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class JobService {
  private readonly dataFilePath = join(__dirname, '..', 'data', 'jobs.json');

  constructor(
    private readonly eventsGateway: EventsGateway,
    private readonly configService: ConfigService,
  ) {
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

  // async createJob(): Promise<string> {
  //   const jobId = uuidv4();
  //   const delay = Math.floor(Math.random() * 30000) + 5000; // Random delay between 5s and 35s

  //   setTimeout(async () => {
  //     try {
  //       const jobResult = { jobId };
  //       this.saveJobResult(jobResult);
  //       this.eventsGateway.handleJobStatusUpdate(null, jobResult); // Emit the update
  //     } catch (error) {
  //       console.error('Error in job execution:', error);
  //       // Handle the error appropriately (e.g., mark job as failed)
  //     }
  //   }, delay);

  //   return jobId;
  // }
  // async createJob(clientId: string): Promise<string> {
  //   const jobId = uuidv4();
  //   const delay = Math.floor(Math.random() * 30000) + 5000;

  //   // Notify job creation with pending status
  //   this.eventsGateway.handleJobStatusUpdate(clientId, 'pending', {
  //     jobId,
  //   });

  //   return new Promise((resolve, reject) => {
  //     setTimeout(async () => {
  //       try {
  //         // Simulate job execution with Unsplash image retrieval
  //         const imageUrl = 'https://source.unsplash.com/random/food';
  //         const jobResult = { jobId, imageUrl };

  //         // Save the job result
  //         await this.saveJobResult(jobResult);

  //         // Notify job completion with success status
  //         this.eventsGateway.handleJobStatusUpdate(clientId, 'success', {
  //           jobId,
  //           imageUrl,
  //         });
  //         resolve(jobId);
  //       } catch (error) {
  //         console.error('Error in job execution:', error);

  //         // Notify job failure with error status
  //         this.eventsGateway.handleJobStatusUpdate(clientId, 'failed', {
  //           jobId,
  //           error: error.message,
  //         });
  //         reject(error);
  //       }
  //     }, delay);
  //   });
  // }

  async createJob(clientId: string): Promise<string> {
    const jobId = uuidv4();
    const delay = Math.floor(Math.random() * 30000) + 5000;

    const fetchRandomImage = async (): Promise<string> => {
      try {
        const response = await axios.get(
          `https://api.unsplash.com/photos/random?query=food&client_id=${this.configService.get<string>('UNSPLASH_ACCESS_KEY')}`,
        );
        const imageUrl = response.data.urls.small;
        return imageUrl;
      } catch (error) {
        console.error('Error fetching random image for loader:', error);
        throw new Error('Failed to fetch image');
      }
    };

    // Fetch the random image URL from Unsplash
    const imageUrl = await fetchRandomImage();

    // Notify job creation with pending status including the image URL
    this.eventsGateway.handleJobStatusUpdate(clientId, 'pending', {
      jobId,
      imageUrl,
    });

    return new Promise((resolve, reject) => {
      setTimeout(async () => {
        try {
          const jobResult = { jobId, imageUrl };

          // Save the job result
          await this.saveJobResult(jobResult);

          // Notify job completion with success status
          this.eventsGateway.handleJobStatusUpdate(clientId, 'success', {
            jobId,
            imageUrl,
          });

          resolve(jobId);
        } catch (error) {
          console.error('Error in job execution:', error);

          // Notify job failure with error status
          this.eventsGateway.handleJobStatusUpdate(clientId, 'failed', {
            jobId,
            error: error.message,
          });

          reject(error);
        }
      }, delay);
    });
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
