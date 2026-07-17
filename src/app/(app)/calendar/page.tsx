'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { Clock, User, Video, ChevronLeft, ChevronRight } from 'lucide-react';
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
        <div className="flex items-center gap-2 bg-surface p-1 rounded-md border border-surface-secondary">
          <button className="px-3 py-1.5 bg-surface-secondary text-text-primary rounded text-sm font-medium transition-colors">List View</button>
          <button className="px-3 py-1.5 text-text-secondary hover:text-text-primary rounded text-sm font-medium transition-colors">Month View</button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left column: Calendar Widget (Mock) */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-surface p-5 rounded-lg border border-surface-secondary">
            <div className="flex justify-between items-center mb-5">
              <h2 className="font-semibold text-base">June 2026</h2>
              <div className="flex items-center gap-1">
                <button className="p-1 hover:bg-surface-secondary rounded transition-colors"><ChevronLeft className="w-4 h-4" /></button>
                <button className="p-1 hover:bg-surface-secondary rounded transition-colors"><ChevronRight className="w-4 h-4" /></button>
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
                      aspect-square rounded flex items-center justify-center text-sm transition-colors
                      ${isToday ? 'bg-text-primary text-white font-medium' : 'hover:bg-surface-secondary text-text-secondary'}
                      ${hasInterview && !isToday ? 'font-semibold text-text-primary bg-surface-secondary/50' : ''}
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
                  transition={{ duration: 0.15, delay: index * 0.1 }}
                  className="bg-surface p-5 rounded-lg border border-surface-secondary transition-colors group"
                >
                  <div className="flex flex-col md:flex-row gap-6">
                    
                    {/* Date Block */}
                    <div className="md:w-24 shrink-0 flex flex-col justify-center items-center p-3 bg-surface rounded-md border border-surface-secondary">
                      <span className="text-[10px] font-semibold text-text-tertiary uppercase tracking-wider mb-1">Upcoming</span>
                      <span className="text-xl font-bold text-text-primary text-center leading-tight">
                        {interview.interview_date ? interview.interview_date.split('-')[2] : 'TBD'}
                      </span>
                      <span className="text-xs text-text-secondary">
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
                      
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-5 pt-5 border-t border-surface-secondary">
                        <div className="flex items-center gap-3 text-sm">
                          <div className="w-8 h-8 rounded border border-surface-secondary bg-surface flex items-center justify-center text-text-secondary">
                            <Clock className="w-4 h-4" />
                          </div>
                          <div>
                            <p className="text-[10px] font-semibold text-text-tertiary uppercase">Time</p>
                            <p className="font-medium text-text-primary">{interview.interview_time || 'TBD'}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-3 text-sm">
                          <div className="w-8 h-8 rounded border border-surface-secondary bg-surface flex items-center justify-center text-text-secondary">
                            <Video className="w-4 h-4" />
                          </div>
                          <div>
                            <p className="text-[10px] font-semibold text-text-tertiary uppercase">Platform</p>
                            <p className="font-medium text-text-primary">{interview.platform || 'TBD'}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-3 text-sm">
                          <div className="w-8 h-8 rounded border border-surface-secondary bg-surface flex items-center justify-center text-text-secondary">
                            <User className="w-4 h-4" />
                          </div>
                          <div>
                            <p className="text-[10px] font-semibold text-text-tertiary uppercase">Interviewer</p>
                            <p className="font-medium text-text-primary">{interview.interviewer_name || 'TBD'}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))
            ) : (
               <div className="p-12 text-center text-text-tertiary bg-surface rounded-lg border border-surface-secondary flex flex-col items-center justify-center">
                 <Image src="/empty-state.jpg" alt="Empty calendar" width={160} height={160} className="mb-4 opacity-80" />
                 <span className="font-medium text-sm text-text-secondary">No upcoming interviews scheduled.</span>
               </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

