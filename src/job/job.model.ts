export interface Job {
  jobId: string;
  imageUrl: string;
  status: 'pending' | 'resolved' | 'failed';
}
