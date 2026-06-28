'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Calendar as CalendarIcon, Clock, MapPin, User, Video, ChevronLeft, ChevronRight } from 'lucide-react';
import { Interview } from '@/types';
import { getInterviews } from '@/lib/api';

export default function CalendarPage() {
  const [upcomingInterviews, setUpcomingInterviews] = useState<Interview[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      const data = await getInterviews();
      setUpcomingInterviews(data);
      setIsLoading(false);
    }
    loadData();
  }, []);
  
  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Calendar</h1>
          <p className="text-text-secondary mt-1">Manage your upcoming interviews and deadlines.</p>
        </div>
        <div className="flex items-center gap-2 bg-surface p-1 rounded-xl border border-surface-secondary shadow-sm">
          <button className="p-2 bg-primary/10 text-primary rounded-lg font-medium text-sm transition-colors">List View</button>
          <button className="p-2 text-text-secondary hover:text-text-primary rounded-lg font-medium text-sm transition-colors">Month View</button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left column: Calendar Widget (Mock) */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-surface p-6 rounded-2xl border border-surface-secondary shadow-sm">
            <div className="flex justify-between items-center mb-6">
              <h2 className="font-bold text-lg">June 2026</h2>
              <div className="flex items-center gap-1">
                <button className="p-1 hover:bg-surface-secondary rounded-lg transition-colors"><ChevronLeft className="w-5 h-5" /></button>
                <button className="p-1 hover:bg-surface-secondary rounded-lg transition-colors"><ChevronRight className="w-5 h-5" /></button>
              </div>
            </div>
            
            <div className="grid grid-cols-7 gap-1 text-center mb-2">
              {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map(day => (
                <div key={day} className="text-xs font-bold text-text-tertiary">{day}</div>
              ))}
            </div>
            <div className="grid grid-cols-7 gap-1 text-center">
              {Array.from({ length: 30 }).map((_, i) => {
                const day = i + 1;
                // Just a mock display for the widget
                const hasInterview = upcomingInterviews.some(interview => {
                  if (!interview.interview_date) return false;
                  return parseInt(interview.interview_date.split('-')[2]) === day;
                });
                const isToday = day === 28;
                return (
                  <button 
                    key={i} 
                    className={`
                      aspect-square rounded-full flex items-center justify-center text-sm font-medium transition-colors
                      ${isToday ? 'bg-primary text-white shadow-sm shadow-primary/20' : 'hover:bg-surface-secondary text-text-secondary'}
                      ${hasInterview && !isToday ? 'text-primary font-bold bg-primary/5' : ''}
                    `}
                  >
                    {day}
                    {hasInterview && !isToday && <span className="absolute bottom-1 w-1 h-1 rounded-full bg-primary" />}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right column: Upcoming Interviews List */}
        <div className="lg:col-span-2">
          <div className="space-y-4">
            {isLoading ? (
               <div className="p-12 text-center text-text-tertiary">Loading interviews...</div>
            ) : upcomingInterviews.length > 0 ? (
              upcomingInterviews.map((interview, index) => (
                <motion.div 
                  key={interview.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.2, delay: index * 0.1 }}
                  className="bg-surface p-6 rounded-2xl border border-surface-secondary shadow-sm hover:shadow-md hover:border-status-interview-text/30 transition-all group"
                >
                  <div className="flex flex-col md:flex-row gap-6">
                    
                    {/* Date Block */}
                    <div className="md:w-32 shrink-0 flex flex-col justify-center items-center p-4 bg-surface-secondary/30 rounded-xl border border-surface-secondary">
                      <span className="text-xs font-bold text-status-interview-text uppercase tracking-wider mb-1">Upcoming</span>
                      <span className="text-2xl font-bold text-text-primary text-center leading-tight">
                        {interview.interview_date ? interview.interview_date.split('-')[2] : 'TBD'}
                      </span>
                      <span className="text-sm font-medium text-text-secondary">
                         {interview.interview_date ? new Date(interview.interview_date).toLocaleString('default', { month: 'long' }) : ''}
                      </span>
                    </div>
                    
                    {/* Details Block */}
                    <div className="flex-1">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <h3 className="text-xl font-bold text-text-primary">{interview.company}</h3>
                          <p className="text-text-secondary font-medium">{interview.role}</p>
                        </div>
                        <span className="px-3 py-1 bg-status-interview-bg text-status-interview-text text-xs font-bold rounded-full">
                          {interview.type || 'Interview'}
                        </span>
                      </div>
                      
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6">
                        <div className="flex items-center gap-3 text-sm">
                          <div className="w-8 h-8 rounded-lg bg-surface-secondary flex items-center justify-center text-text-tertiary">
                            <Clock className="w-4 h-4" />
                          </div>
                          <div>
                            <p className="text-[10px] font-bold text-text-tertiary uppercase">Time</p>
                            <p className="font-medium text-text-primary">{interview.interview_time || 'TBD'}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-3 text-sm">
                          <div className="w-8 h-8 rounded-lg bg-surface-secondary flex items-center justify-center text-text-tertiary">
                            <Video className="w-4 h-4" />
                          </div>
                          <div>
                            <p className="text-[10px] font-bold text-text-tertiary uppercase">Platform</p>
                            <p className="font-medium text-text-primary">{interview.platform || 'TBD'}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-3 text-sm">
                          <div className="w-8 h-8 rounded-lg bg-surface-secondary flex items-center justify-center text-text-tertiary">
                            <User className="w-4 h-4" />
                          </div>
                          <div>
                            <p className="text-[10px] font-bold text-text-tertiary uppercase">Interviewer</p>
                            <p className="font-medium text-text-primary">{interview.interviewer_name || 'TBD'}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))
            ) : (
               <div className="p-12 text-center text-text-tertiary bg-surface rounded-2xl border border-surface-secondary shadow-sm">
                 No upcoming interviews scheduled.
               </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

