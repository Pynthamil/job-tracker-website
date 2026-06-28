import { supabase } from './supabase';
import { Application, Interview } from '@/types';

// Mock user_id for RLS bypassing since auth was removed, 
// if RLS is fully strict, this might still fail without a valid token.
// Assuming the backend has been configured to allow this or a specific ID is used.
const MOCK_USER_ID = '00000000-0000-0000-0000-000000000000';

export async function getApplications(): Promise<Application[]> {
  const { data, error } = await supabase
    .from('applications')
    .select('*')
    .order('date_applied', { ascending: false });

  if (error) {
    console.error('Error fetching applications:', error);
    return [];
  }
  return data as Application[];
}

export async function getInterviews(): Promise<Interview[]> {
  const { data, error } = await supabase
    .from('interviews')
    .select('*')
    .order('interview_date', { ascending: true });

  if (error) {
    console.error('Error fetching interviews:', error);
    return [];
  }
  return data as Interview[];
}

export async function addApplication(application: Partial<Application>) {
  // Using uuid v4 would be better but we can rely on supabase if default is set
  const id = crypto.randomUUID();
  
  const { data, error } = await supabase
    .from('applications')
    .insert([
      { 
        id, 
        user_id: MOCK_USER_ID, 
        ...application 
      }
    ])
    .select();

  if (error) {
    console.error('Error adding application:', error);
    throw error;
  }
  return data[0] as Application;
}
