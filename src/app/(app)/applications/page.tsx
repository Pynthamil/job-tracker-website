'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Plus, MoreHorizontal, MapPin } from 'lucide-react';
import { ApplicationStatus, Application } from '@/types';
import { getApplications, addApplication } from '@/lib/api';
import CompanyLogo from '@/components/CompanyLogo';

const statuses: ApplicationStatus[] = ['Wishlist', 'Applied', 'OA', 'Interview', 'Offer', 'Rejected'];

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

export default function ApplicationsPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<ApplicationStatus | 'All'>('All');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [applications, setApplications] = useState<Application[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Modal State
  const [newApp, setNewApp] = useState({
    company: '',
    role: '',
    status: 'Wishlist' as ApplicationStatus,
    location: ''
  });

  useEffect(() => {
    async function loadData() {
      const data = await getApplications();
      setApplications(data);
      setIsLoading(false);
    }
    loadData();
  }, []);

  const handleSave = async () => {
    try {
      const added = await addApplication({
        company: newApp.company,
        role: newApp.role,
        status: newApp.status,
        location: newApp.location,
        date_applied: new Date().toISOString().split('T')[0]
      });
      setApplications(prev => [added, ...prev]);
      setIsModalOpen(false);
      setNewApp({ company: '', role: '', status: 'Wishlist', location: '' });
    } catch (e) {
      console.error(e);
      const error = e as Error;
      alert(`Failed to save application: ${error.message || 'Unknown error'}. This is likely due to Row Level Security (RLS) or Foreign Key constraints since we removed authentication.`);
    }
  };

  const filteredApps = applications.filter(app => {
    const matchesSearch = app.company.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          app.role.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = selectedStatus === 'All' || app.status === selectedStatus;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Applications</h1>
          <p className="text-text-secondary mt-1">Track and manage your job search progress.</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="bg-primary hover:bg-black/90 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          New Application
        </button>
      </div>

      {/* Filters Bar */}
      <div className="flex flex-col lg:flex-row gap-4 justify-between items-center">
        <div className="relative w-full lg:w-96">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-tertiary" />
          <input 
            type="text" 
            placeholder="Search companies or roles..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-surface border border-surface-secondary focus:border-text-primary rounded-md outline-none transition-colors text-sm font-medium"
          />
        </div>

        <div className="flex items-center gap-2 overflow-x-auto w-full lg:w-auto pb-2 lg:pb-0 hide-scrollbar">
          <button 
            onClick={() => setSelectedStatus('All')}
            className={`px-3 py-1.5 rounded-md text-xs font-semibold whitespace-nowrap transition-colors ${selectedStatus === 'All' ? 'bg-text-primary text-white' : 'bg-surface border border-surface-secondary text-text-secondary hover:text-text-primary'}`}
          >
            All
          </button>
          {statuses.map(status => (
            <button 
              key={status}
              onClick={() => setSelectedStatus(status)}
              className={`px-3 py-1.5 rounded-md text-xs font-semibold whitespace-nowrap transition-colors ${selectedStatus === status ? getStatusColor(status) : 'bg-surface border border-surface-secondary text-text-secondary hover:text-text-primary'}`}
            >
              {status}
            </button>
          ))}
        </div>
      </div>

      {/* Applications Grid/List */}
      <div className="bg-surface rounded-lg border border-surface-secondary overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-surface-secondary bg-surface">
                <th className="px-5 py-3 text-xs font-semibold text-text-secondary uppercase tracking-wider">Company & Role</th>
                <th className="px-5 py-3 text-xs font-semibold text-text-secondary uppercase tracking-wider">Status</th>
                <th className="px-5 py-3 text-xs font-semibold text-text-secondary uppercase tracking-wider">Date Applied</th>
                <th className="px-5 py-3 text-xs font-semibold text-text-secondary uppercase tracking-wider text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-secondary">
              <AnimatePresence>
                {isLoading ? (
                  <tr>
                    <td colSpan={4} className="px-6 py-12 text-center text-text-tertiary">
                      <div className="flex justify-center items-center h-full">Loading...</div>
                    </td>
                  </tr>
                ) : filteredApps.length > 0 ? filteredApps.map((app, index) => (
                  <motion.tr 
                    key={app.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.2, delay: index * 0.05 }}
                    className="hover:bg-surface-secondary/50 transition-colors group"
                  >
                    <td className="px-5 py-3">
                      <div className="flex items-center gap-3">
                        <CompanyLogo company={app.company} className="w-8 h-8" />
                        <div>
                          <h3 className="font-medium text-text-primary text-sm">{app.company}</h3>
                          <div className="flex items-center gap-2 mt-0.5">
                            <span className="text-xs text-text-secondary">{app.role}</span>
                            <span className="w-1 h-1 rounded-full bg-surface-secondary"></span>
                            <span className="text-[11px] text-text-tertiary flex items-center gap-1">
                              <MapPin className="w-3 h-3" /> {app.location || 'Remote'}
                            </span>
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-3">
                      <span className={`px-2 py-1 rounded-md text-[11px] font-semibold inline-block ${getStatusColor(app.status)}`}>
                        {app.status}
                      </span>
                    </td>
                    <td className="px-5 py-3 text-sm text-text-secondary">
                      {app.date_applied || 'Not applied'}
                    </td>
                    <td className="px-5 py-3 text-right">
                      <button className="p-1.5 text-text-tertiary hover:text-text-primary hover:bg-surface-secondary rounded-md transition-colors">
                        <MoreHorizontal className="w-4 h-4" />
                      </button>
                    </td>
                  </motion.tr>
                )) : (
                  <tr>
                    <td colSpan={4} className="px-6 py-12 text-center text-text-tertiary">
                      <div className="flex flex-col items-center justify-center">
                        <Image src="/empty-state.jpg" alt="Empty applications" width={160} height={160} className="mb-4 opacity-80" />
                        <p className="font-medium text-sm text-text-secondary">No applications found matching your criteria.</p>
                      </div>
                    </td>
                  </tr>
                )}
              </AnimatePresence>
            </tbody>
          </table>
        </div>
      </div>

      {/* New Application Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              exit={{ opacity: 0 }} 
              onClick={() => setIsModalOpen(false)}
              className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              className="relative w-full max-w-lg bg-surface rounded-lg border border-surface-secondary shadow-lg overflow-hidden"
            >
              <div className="p-5 border-b border-surface-secondary flex justify-between items-center">
                <h2 className="text-lg font-semibold">New Application</h2>
                <button onClick={() => setIsModalOpen(false)} className="p-1.5 text-text-tertiary hover:text-text-primary hover:bg-surface-secondary rounded-md transition-colors">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                </button>
              </div>
              <div className="p-5 space-y-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-text-secondary uppercase tracking-wide">Company</label>
                  <input type="text" placeholder="e.g. Vercel" value={newApp.company} onChange={e => setNewApp({...newApp, company: e.target.value})} className="w-full px-3 py-2 bg-surface border border-surface-secondary focus:border-text-primary rounded-md outline-none transition-colors text-sm font-medium" />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-text-secondary uppercase tracking-wide">Role</label>
                  <input type="text" placeholder="e.g. Frontend Engineer" value={newApp.role} onChange={e => setNewApp({...newApp, role: e.target.value})} className="w-full px-3 py-2 bg-surface border border-surface-secondary focus:border-text-primary rounded-md outline-none transition-colors text-sm font-medium" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                   <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-text-secondary uppercase tracking-wide">Status</label>
                    <select value={newApp.status} onChange={e => setNewApp({...newApp, status: e.target.value as ApplicationStatus})} className="w-full px-3 py-2 bg-surface border border-surface-secondary focus:border-text-primary rounded-md outline-none transition-colors text-sm font-medium appearance-none">
                      {statuses.map(s => <option key={s} value={s}>{s}</option>)}
                    </select>
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-text-secondary uppercase tracking-wide">Location</label>
                    <input type="text" placeholder="e.g. Remote" value={newApp.location} onChange={e => setNewApp({...newApp, location: e.target.value})} className="w-full px-3 py-2 bg-surface border border-surface-secondary focus:border-text-primary rounded-md outline-none transition-colors text-sm font-medium" />
                  </div>
                </div>
              </div>
              <div className="p-5 border-t border-surface-secondary bg-surface flex justify-end gap-3">
                <button onClick={() => setIsModalOpen(false)} className="px-4 py-2 rounded-md font-medium text-text-secondary hover:bg-surface-secondary border border-transparent transition-colors text-sm">Cancel</button>
                <button onClick={handleSave} className="px-4 py-2 rounded-md font-medium bg-primary hover:bg-black/90 text-white transition-colors text-sm">Save Application</button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
