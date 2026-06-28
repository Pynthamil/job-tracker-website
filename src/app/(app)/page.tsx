'use client';

import { useState, useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Briefcase, Calendar, CheckCircle, Clock, MapPin, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { Application, Interview } from '@/types';
import { getApplications, getInterviews } from '@/lib/api';

const getStatusColor = (status: string) => {
  switch (status) {
    case 'Wishlist': return 'text-status-wishlist-text bg-status-wishlist-bg';
    case 'Applied': return 'text-status-applied-text bg-status-applied-bg';
    case 'OA': return 'text-status-oa-text bg-status-oa-bg';
    case 'Interview': return 'text-status-interview-text bg-status-interview-bg';
    case 'Offer': return 'text-status-offer-text bg-status-offer-bg';
    case 'Rejected': return 'text-status-rejected-text bg-status-rejected-bg';
    default: return 'text-text-secondary bg-surface-secondary';
  }
};

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.1 }
  }
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 300, damping: 24 } }
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
      if (title.includes('frontend') || title.includes('ui')) category = 'Frontend Engineer';
      else if (title.includes('backend') || title.includes('server')) category = 'Backend Engineer';
      else if (title.includes('full') || title.includes('fullstack')) category = 'Fullstack Engineer';
      else if (title.includes('mobile') || title.includes('ios') || title.includes('android')) category = 'Mobile Engineer';
      
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
          <Link href="/applications" className="bg-primary hover:bg-primary-hover text-white px-5 py-2.5 rounded-xl font-medium transition-colors shadow-sm shadow-primary/20 flex items-center gap-2">
            <Briefcase className="w-4 h-4" />
            New Application
          </Link>
        </motion.div>
      </div>

      {/* Stats Grid */}
      <motion.div variants={item} className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {stats.map((stat, i) => {
          const Icon = stat.icon;
          return (
            <div key={i} className="bg-surface p-5 rounded-2xl border border-surface-secondary shadow-sm flex flex-col justify-between group hover:shadow-md transition-shadow">
              <div className="flex justify-between items-start mb-4">
                <div className={`p-3 rounded-xl ${stat.bg} ${stat.color} transition-transform group-hover:scale-110`}>
                  <Icon className="w-6 h-6" />
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
          
          <motion.div variants={item} className="bg-surface rounded-2xl border border-surface-secondary shadow-sm overflow-hidden">
            <div className="p-5 border-b border-surface-secondary flex justify-between items-center bg-surface/50 backdrop-blur-sm">
              <h2 className="text-lg font-bold">Recent Updates</h2>
              <Link href="/applications" className="text-sm font-medium text-primary hover:underline flex items-center gap-1">
                View All <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
            <div className="divide-y divide-surface-secondary">
              {recentUpdates.length > 0 ? recentUpdates.map((update) => (
                <div key={update.id} className="p-5 hover:bg-surface-secondary/50 transition-colors flex items-center justify-between group cursor-pointer">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-gray-100 to-gray-200 border border-gray-200 flex items-center justify-center font-bold text-gray-600 shadow-sm group-hover:scale-105 transition-transform">
                      {update.company.charAt(0)}
                    </div>
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
                <div className="p-8 text-center text-text-tertiary text-sm">No recent applications found.</div>
              )}
            </div>
          </motion.div>

          {/* Role Focus */}
          <motion.div variants={item} className="bg-surface rounded-2xl border border-surface-secondary shadow-sm p-6">
            <h2 className="text-lg font-bold mb-6">Role Focus</h2>
            <div className="space-y-4">
              <div className="flex h-3 rounded-full overflow-hidden bg-surface-secondary">
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
          <motion.div variants={item} className="bg-surface rounded-2xl border border-surface-secondary shadow-sm p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-lg font-bold">Upcoming Interviews</h2>
              <button className="p-2 hover:bg-surface-secondary rounded-lg text-text-secondary transition-colors">
                <Calendar className="w-5 h-5" />
              </button>
            </div>
            
            <div className="space-y-4">
              {upcomingInterviews.length > 0 ? upcomingInterviews.map((interview) => (
                <div key={interview.id} className="p-4 rounded-xl border border-surface-secondary hover:border-status-interview-text/30 bg-gradient-to-b from-white to-surface-secondary/20 transition-all shadow-sm group">
                  <div className="flex justify-between items-start mb-3">
                    <div className="flex items-center gap-3">
                       <div className="w-10 h-10 rounded-lg bg-status-interview-bg text-status-interview-text flex items-center justify-center font-bold shadow-sm">
                        {interview.company.charAt(0)}
                      </div>
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
                 <div className="p-8 text-center text-text-tertiary text-sm">No upcoming interviews.</div>
              )}
              
              <Link href="/calendar" className="block w-full py-3 text-center text-sm font-bold text-text-secondary hover:text-primary transition-colors bg-surface-secondary/50 hover:bg-surface-secondary rounded-xl">
                View Full Calendar
              </Link>
            </div>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
}
