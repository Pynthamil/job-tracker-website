export type ApplicationStatus = 'Wishlist' | 'Applied' | 'OA' | 'Interview' | 'Offer' | 'Rejected';

export interface Application {
  id: string;
  user_id: string;
  company: string;
  role: string;
  status: ApplicationStatus;
  date_applied: string | null;
  location: string | null;
  salary: string | null;
  recruiter: string | null;
  notes: string | null;
  job_type: string | null;
  logo_color: string | null;
  logo_initials: string | null;
}

export interface Interview {
  id: string;
  user_id: string;
  application_id: string;
  company: string;
  role: string;
  type: string | null;
  interview_date: string | null;
  interview_time: string | null;
  platform: string | null;
  interviewer_name: string | null;
  logo_color: string | null;
  logo_initials: string | null;
}
