'use client';

import { useState, useEffect, useMemo } from 'react';
import Image from 'next/image';
import { motion, Variants } from 'framer-motion';
import { Briefcase, Calendar, CheckCircle, Clock, MapPin, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { Application, Interview } from '@/types';
import { getApplications, getInterviews } from '@/lib/api';
import CompanyLogo from '@/components/CompanyLogo';

const getStatusColor = (status: string) => {
  switch (status) {
    case 'Wishlist': return 'text-text-secondary bg-surface border border-surface-secondary';
    case 'Applied': return 'text-status-applied-text bg-status-applied-bg border border-status-applied-text/20';
    case 'OA': return 'text-status-oa-text bg-status-oa-bg border border-status-oa-text/20';
    case 'Interview': return 'text-status-interview-text bg-status-interview-bg border border-status-interview-text/20';
    case 'Offer': return 'text-status-offer-text bg-status-offer-bg border border-status-offer-text/20';
    case 'Rejected': return 'text-status-rejected-text bg-status-rejected-bg border border-status-rejected-text/20';
    default: return 'text-text-secondary bg-surface-secondary border border-surface-secondary';
  }
};

const container: Variants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.1 }
  }
};

const item: Variants = {
  hidden: { opacity: 0, y: 10 },
  show: { opacity: 1, y: 0, transition: { duration: 0.15 } }
};

export default function Dashboard() {
  const [applications, setApplications] = useState<Application[]>([]);
  const [interviews, setInterviews] = useState<Interview[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      const [appsData, interviewsData] = await Promise.all([
        getApplications(),
        getInterviews()
      ]);
      setApplications(appsData);
      setInterviews(interviewsData);
      setIsLoading(false);
    }
    loadData();
  }, []);

  const stats = useMemo(() => {
    return [
      { label: 'Total Applications', value: applications.length, icon: Briefcase, color: 'text-primary', bg: 'bg-primary/10' },
      { label: 'Interviews', value: applications.filter(a => ['Interview', 'Offer', 'Rejected'].includes(a.status) && a.status !== 'OA').length, icon: Calendar, color: 'text-status-interview-text', bg: 'bg-status-interview-bg' },
      { label: 'Offers', value: applications.filter(a => a.status === 'Offer').length, icon: CheckCircle, color: 'text-status-offer-text', bg: 'bg-status-offer-bg' },
      { label: 'Pending', value: applications.filter(a => ['Wishlist', 'Applied', 'OA'].includes(a.status)).length, icon: Clock, color: 'text-status-applied-text', bg: 'bg-status-applied-bg' },
    ];
  }, [applications]);

  const recentUpdates = useMemo(() => {
    return [...applications].slice(0, 3);
  }, [applications]);

  const upcomingInterviews = useMemo(() => {
    return [...interviews].slice(0, 3);
  }, [interviews]);

  const roleFocus = useMemo(() => {
    const roles: Record<string, number> = {};
    applications.forEach(app => {
      let category = 'Other';
      const title = app.role.toLowerCase();
      if (title.includes('frontend') || title.includes('ui') || title.includes('web')) category = 'Frontend Engineer';
      else if (title.includes('backend') || title.includes('server') || title.includes('infrastructure')) category = 'Backend Engineer';
      else if (title.includes('full') || title.includes('fullstack')) category = 'Fullstack Engineer';
      else if (title.includes('mobile') || title.includes('ios') || title.includes('android')) category = 'Mobile Engineer';
      else if (title.includes('design') || title.includes('ux')) category = 'Design Engineer';
      else if (title.includes('data') || title.includes('machine learning') || title.includes('ml') || title.includes('ai')) category = 'Data / AI Engineer';
      else if (title.includes('product') || title.includes('manager') || title.includes('pm')) category = 'Product Manager';
      
      roles[category] = (roles[category] || 0) + 1;
    });

    const total = applications.length || 1;
    const colors = ['#FF5F28', '#007AFF', '#AF52DE', '#34C759'];
    
    return Object.entries(roles).map(([role, count], index) => ({
      role,
      percentage: Math.round((count / total) * 100),
      color: colors[index % colors.length]
    })).sort((a, b) => b.percentage - a.percentage).slice(0, 3);
  }, [applications]);

  if (isLoading) {
    return <div className="p-12 text-center text-text-tertiary">Loading dashboard...</div>;
  }

  return (
    <motion.div 
      className="space-y-8"
      variants={container}
      initial="hidden"
      animate="show"
    >
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <motion.h1 variants={item} className="text-3xl font-bold tracking-tight">Welcome back, Pyni</motion.h1>
          <motion.p variants={item} className="text-text-secondary mt-1">Here is what is happening with your job search today.</motion.p>
        </div>
        <motion.div variants={item}>
          <Link href="/applications" className="bg-primary hover:bg-black/90 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors flex items-center gap-2">
            <Briefcase className="w-4 h-4" />
            New Application
          </Link>
        </motion.div>
      </div>

      {/* Stats Grid */}
      <motion.div variants={item} className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {stats.map((stat, i) => {
          return (
            <div key={i} className="bg-surface p-5 rounded-lg border border-surface-secondary flex flex-col justify-between">
              <div className="flex justify-between items-start mb-4">
                <div className={`p-2 rounded-md bg-surface border border-surface-secondary text-text-primary`}>
                  <stat.icon className="w-5 h-5" />
                </div>
              </div>
              <div>
                <p className="text-3xl font-bold">{stat.value}</p>
                <p className="text-sm font-medium text-text-secondary mt-1">{stat.label}</p>
              </div>
            </div>
          );
        })}
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column (Recent Updates & Role Focus) */}
        <div className="lg:col-span-2 space-y-6">
          
          <motion.div variants={item} className="bg-surface rounded-lg border border-surface-secondary overflow-hidden">
            <div className="p-4 border-b border-surface-secondary flex justify-between items-center bg-surface">
              <h2 className="text-base font-semibold">Recent Updates</h2>
              <Link href="/applications" className="text-sm font-medium text-text-secondary hover:text-text-primary flex items-center gap-1 transition-colors">
                View All <ArrowRight className="w-3 h-3" />
              </Link>
            </div>
            <div className="divide-y divide-surface-secondary">
              {recentUpdates.length > 0 ? recentUpdates.map((update) => (
                <div key={update.id} className="p-4 hover:bg-surface-secondary/30 transition-colors flex items-center justify-between group cursor-pointer">
                  <div className="flex items-center gap-4">
                    <CompanyLogo company={update.company} className="w-10 h-10" />
                    <div>
                      <h3 className="font-bold text-text-primary">{update.company}</h3>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-sm font-medium text-text-secondary">{update.role}</span>
                        <span className="w-1 h-1 rounded-full bg-surface-secondary"></span>
                        <span className="text-xs text-text-tertiary flex items-center gap-1">
                          <MapPin className="w-3 h-3" /> {update.location || 'Remote'}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-2">
                    <span className={`px-3 py-1 rounded-full text-xs font-bold ${getStatusColor(update.status)}`}>
                      {update.status}
                    </span>
                    <span className="text-xs font-medium text-text-tertiary">{update.date_applied || 'Recent'}</span>
                  </div>
                </div>
              )) : (
                <div className="p-8 text-center text-text-tertiary flex flex-col items-center justify-center">
                  <Image src="/empty-state.jpg" alt="Empty applications" width={100} height={100} className="mb-3 opacity-80" />
                  <span className="text-sm">No recent updates.</span>
                </div>
              )}
            </div>
          </motion.div>

          {/* Role Focus */}
          <motion.div variants={item} className="bg-surface rounded-lg border border-surface-secondary p-5">
            <h2 className="text-base font-semibold mb-5">Role Focus</h2>
            <div className="space-y-4">
              <div className="flex h-2 rounded-full overflow-hidden bg-surface-secondary">
                {roleFocus.map((role, i) => (
                  <motion.div 
                    key={i} 
                    className="h-full" 
                    style={{ backgroundColor: role.color, width: `${role.percentage}%` }} 
                    initial={{ width: 0 }}
                    animate={{ width: `${role.percentage}%` }}
                    transition={{ duration: 1, delay: 0.5 + (i * 0.1) }}
                  />
                ))}
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 pt-4">
                {roleFocus.map((role, i) => (
                  <div key={i} className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full shadow-sm" style={{ backgroundColor: role.color }}></div>
                    <div>
                      <p className="text-sm font-bold text-text-primary">{role.percentage}%</p>
                      <p className="text-xs font-medium text-text-secondary">{role.role}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>

        </div>

        {/* Right Column (Upcoming Interviews) */}
        <div className="space-y-6">
          <motion.div variants={item} className="bg-surface rounded-lg border border-surface-secondary p-5">
            <div className="flex justify-between items-center mb-5">
              <h2 className="text-base font-semibold">Upcoming Interviews</h2>
              <Link href="/calendar" className="text-sm font-medium text-text-secondary hover:text-text-primary transition-colors">
                View Calendar
              </Link>
            </div>
            
            <div className="space-y-3">
              {upcomingInterviews.length > 0 ? upcomingInterviews.map((interview) => (
                <div key={interview.id} className="p-3 rounded-md border border-surface-secondary bg-surface transition-colors group">
                  <div className="flex justify-between items-start mb-2">
                    <div className="flex items-center gap-3">
                      <CompanyLogo company={interview.company} className="w-8 h-8" />
                      <div>
                        <h3 className="font-bold text-sm text-text-primary">{interview.company}</h3>
                        <p className="text-xs font-medium text-text-secondary">{interview.role}</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-3 mt-4 pt-4 border-t border-surface-secondary/50">
                    <div>
                      <p className="text-[10px] uppercase font-bold text-text-tertiary mb-1">Date & Time</p>
                      <p className="text-xs font-medium text-text-primary">{interview.interview_date || 'TBD'}</p>
                      <p className="text-xs font-medium text-text-secondary">{interview.interview_time || 'TBD'}</p>
                    </div>
                    <div>
                      <p className="text-[10px] uppercase font-bold text-text-tertiary mb-1">Platform</p>
                      <p className="text-xs font-medium text-text-primary">{interview.platform || 'TBD'}</p>
                      <p className="text-xs font-medium text-text-secondary">{interview.interviewer_name || 'TBD'}</p>
                    </div>
                  </div>
                </div>
              )) : (
                 <div className="p-6 text-center text-text-tertiary flex flex-col items-center justify-center">
                    <Image src="/empty-state.jpg" alt="Empty interviews" width={100} height={100} className="mb-3 opacity-80" />
                    <span className="text-sm">No upcoming interviews.</span>
                 </div>
              )}
            </div>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
}
