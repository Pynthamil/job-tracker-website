'use client';

import { motion } from 'framer-motion';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, AreaChart, Area
} from 'recharts';
import { TrendingUp, Target, Award, MousePointerClick } from 'lucide-react';

const funnelData = [
  { name: 'Applied', value: 120 },
  { name: 'OA', value: 45 },
  { name: 'Interview', value: 15 },
  { name: 'Offer', value: 3 },
];

const timelineData = [
  { name: 'Jan', applications: 10 },
  { name: 'Feb', applications: 25 },
  { name: 'Mar', applications: 40 },
  { name: 'Apr', applications: 20 },
  { name: 'May', applications: 15 },
  { name: 'Jun', applications: 10 },
];

const COLORS = ['#007AFF', '#AF52DE', '#FF8A63', '#34C759'];

const stats = [
  { label: 'Total Applications', value: '120', trend: '+12% this month', icon: MousePointerClick, color: 'text-primary' },
  { label: 'Interview Rate', value: '12.5%', trend: '+2.1% this month', icon: Target, color: 'text-status-interview-text' },
  { label: 'Offer Rate', value: '2.5%', trend: 'Steady', icon: Award, color: 'text-status-offer-text' },
];

export default function AnalyticsPage() {
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
              className="bg-surface p-6 rounded-2xl border border-surface-secondary shadow-sm"
            >
              <div className="flex justify-between items-start mb-4">
                <div className={`p-3 rounded-xl bg-surface-secondary ${stat.color}`}>
                  <Icon className="w-6 h-6" />
                </div>
                <div className="flex items-center gap-1 text-xs font-bold text-status-offer-text bg-status-offer-bg px-2 py-1 rounded-lg">
                  <TrendingUp className="w-3 h-3" />
                  {stat.trend.split(' ')[0]}
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
          className="bg-surface p-6 rounded-2xl border border-surface-secondary shadow-sm"
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
          className="bg-surface p-6 rounded-2xl border border-surface-secondary shadow-sm"
        >
          <h2 className="text-lg font-bold mb-6">Application Timeline</h2>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={timelineData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorApps" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#FF5F28" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#FF5F28" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E5EA" />
                <XAxis dataKey="name" tick={{ fill: '#90909F', fontSize: 12 }} axisLine={false} tickLine={false} dy={10} />
                <YAxis tick={{ fill: '#90909F', fontSize: 12 }} axisLine={false} tickLine={false} />
                <Tooltip 
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 20px rgba(0,0,0,0.08)' }}
                />
                <Area type="monotone" dataKey="applications" stroke="#FF5F28" strokeWidth={3} fillOpacity={1} fill="url(#colorApps)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
