'use client';

import { useState, useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  AreaChart, Area, Cell
} from 'recharts';
import { TrendingUp, Target, Award, MousePointerClick } from 'lucide-react';
import { getApplications } from '@/lib/api';
import { Application } from '@/types';

const COLORS = ['#0066FF', '#FF7300', '#FFC107', '#34C759'];

export default function AnalyticsPage() {
  const [applications, setApplications] = useState<Application[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      const data = await getApplications();
      setApplications(data);
      setIsLoading(false);
    }
    loadData();
  }, []);

  const funnelData = useMemo(() => {
    const applied = applications.length;
    const oa = applications.filter(a => ['OA', 'Interview', 'Offer', 'Rejected'].includes(a.status)).length;
    const interview = applications.filter(a => ['Interview', 'Offer', 'Rejected'].includes(a.status) && a.status !== 'OA').length;
    const offer = applications.filter(a => a.status === 'Offer').length;
    
    return [
      { name: 'Applied', value: applied },
      { name: 'OA', value: oa },
      { name: 'Interview', value: interview },
      { name: 'Offer', value: offer },
    ];
  }, [applications]);

  const timelineData = useMemo(() => {
    // Simple mock timeline calculation based on actual data
    // Group by month
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const counts = new Array(12).fill(0);
    
    applications.forEach(app => {
      if (app.date_applied) {
        const date = new Date(app.date_applied);
        counts[date.getMonth()] += 1;
      }
    });

    const currentMonth = new Date().getMonth();
    // Show last 6 months
    return Array.from({length: 6}).map((_, i) => {
      const monthIdx = (currentMonth - 5 + i + 12) % 12;
      return {
        name: months[monthIdx],
        applications: counts[monthIdx]
      };
    });
  }, [applications]);

  const stats = useMemo(() => {
    const total = applications.length;
    const interviewCount = funnelData.find(f => f.name === 'Interview')?.value || 0;
    const offerCount = funnelData.find(f => f.name === 'Offer')?.value || 0;
    
    const interviewRate = total > 0 ? ((interviewCount / total) * 100).toFixed(1) + '%' : '0%';
    const offerRate = total > 0 ? ((offerCount / total) * 100).toFixed(1) + '%' : '0%';
    
    return [
      { label: 'Total Applications', value: total.toString(), trend: 'Active', icon: MousePointerClick, color: 'text-primary' },
      { label: 'Interview Rate', value: interviewRate, trend: 'Tracked', icon: Target, color: 'text-status-interview-text' },
      { label: 'Offer Rate', value: offerRate, trend: 'Tracked', icon: Award, color: 'text-status-offer-text' },
    ];
  }, [applications, funnelData]);

  if (isLoading) {
    return <div className="p-12 text-center text-text-tertiary">Loading analytics...</div>;
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Analytics</h1>
        <p className="text-text-secondary mt-1">Insights and metrics for your job search.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <motion.div 
              key={index}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-surface p-6 rounded-2xl border border-surface-secondary"
            >
              <div className="flex justify-between items-start mb-4">
                <div className={`p-3 rounded-xl bg-surface-secondary ${stat.color}`}>
                  <Icon className="w-6 h-6" />
                </div>
                <div className="flex items-center gap-1 text-xs font-bold text-status-offer-text bg-status-offer-bg px-2 py-1 rounded-lg">
                  <TrendingUp className="w-3 h-3" />
                  {stat.trend}
                </div>
              </div>
              <p className="text-3xl font-bold text-text-primary">{stat.value}</p>
              <p className="text-sm font-medium text-text-secondary mt-1">{stat.label}</p>
            </motion.div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Funnel Chart */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3 }}
          className="bg-surface p-6 rounded-2xl border border-surface-secondary"
        >
          <h2 className="text-lg font-bold mb-6">Conversion Funnel</h2>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={funnelData} layout="vertical" margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#E5E5EA" />
                <XAxis type="number" tick={{ fill: '#90909F', fontSize: 12 }} axisLine={false} tickLine={false} />
                <YAxis dataKey="name" type="category" tick={{ fill: '#626271', fontSize: 12, fontWeight: 600 }} axisLine={false} tickLine={false} />
                <Tooltip 
                  cursor={{ fill: 'rgba(246, 245, 250, 0.5)' }}
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 20px rgba(0,0,0,0.08)' }}
                />
                <Bar dataKey="value" radius={[0, 8, 8, 0]} barSize={32}>
                  {funnelData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* Timeline Chart */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.4 }}
          className="bg-surface p-6 rounded-2xl border border-surface-secondary"
        >
          <h2 className="text-lg font-bold mb-6">Application Timeline</h2>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={timelineData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorApps" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#0066FF" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#0066FF" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#EBEBEB" />
                <XAxis dataKey="name" tick={{ fill: '#999999', fontSize: 12 }} axisLine={false} tickLine={false} dy={10} />
                <YAxis tick={{ fill: '#999999', fontSize: 12 }} axisLine={false} tickLine={false} />
                <Tooltip 
                  contentStyle={{ borderRadius: '12px', border: '1px solid #EBEBEB', boxShadow: 'none' }}
                />
                <Area type="monotone" dataKey="applications" stroke="#0066FF" strokeWidth={3} fillOpacity={1} fill="url(#colorApps)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

