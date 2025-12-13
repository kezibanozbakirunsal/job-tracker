export type ApplicationStatus = 'Applied' | 'Interview' | 'Offer' | 'Rejected';

export interface JobApplication {
  id: string;
  company: string;
  role: string;
  location: string;
  status: ApplicationStatus;
  appliedDate: string; // ISO (YYYY-MM-DD)
  notes: string;
  createdAt: number;
  updatedAt: number;
}
