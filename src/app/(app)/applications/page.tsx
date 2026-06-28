'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Plus, MoreHorizontal, MapPin } from 'lucide-react';
import { ApplicationStatus, Application } from '@/types';
import { getApplications, addApplication } from '@/lib/api';

const statuses: ApplicationStatus[] = ['Wishlist', 'Applied', 'OA', 'Interview', 'Offer', 'Rejected'];

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
          className="bg-primary hover:bg-primary-hover text-white px-5 py-2.5 rounded-xl font-medium transition-colors shadow-sm shadow-primary/20 flex items-center gap-2"
        >
          <Plus className="w-5 h-5" />
          New Application
        </button>
      </div>

      {/* Filters Bar */}
      <div className="bg-surface p-4 rounded-2xl border border-surface-secondary shadow-sm flex flex-col lg:flex-row gap-4 justify-between items-center">
        <div className="relative w-full lg:w-96">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-text-tertiary" />
          <input 
            type="text" 
            placeholder="Search companies or roles..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-surface-secondary/50 border border-transparent focus:border-primary/50 focus:bg-surface rounded-xl outline-none transition-all text-sm font-medium"
          />
        </div>

        <div className="flex items-center gap-2 overflow-x-auto w-full lg:w-auto pb-2 lg:pb-0 hide-scrollbar">
          <button 
            onClick={() => setSelectedStatus('All')}
            className={`px-4 py-2 rounded-xl text-sm font-bold whitespace-nowrap transition-colors ${selectedStatus === 'All' ? 'bg-text-primary text-white shadow-sm' : 'bg-surface-secondary/50 text-text-secondary hover:bg-surface-secondary'}`}
          >
            All
          </button>
          {statuses.map(status => (
            <button 
              key={status}
              onClick={() => setSelectedStatus(status)}
              className={`px-4 py-2 rounded-xl text-sm font-bold whitespace-nowrap transition-colors ${selectedStatus === status ? getStatusColor(status) : 'bg-surface-secondary/50 text-text-secondary hover:bg-surface-secondary'}`}
            >
              {status}
            </button>
          ))}
        </div>
      </div>

      {/* Applications Grid/List */}
      <div className="bg-surface rounded-2xl border border-surface-secondary shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-surface-secondary bg-surface-secondary/30">
                <th className="px-6 py-4 text-xs font-bold text-text-tertiary uppercase tracking-wider">Company & Role</th>
                <th className="px-6 py-4 text-xs font-bold text-text-tertiary uppercase tracking-wider">Status</th>
                <th className="px-6 py-4 text-xs font-bold text-text-tertiary uppercase tracking-wider">Date Applied</th>
                <th className="px-6 py-4 text-xs font-bold text-text-tertiary uppercase tracking-wider text-right">Actions</th>
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
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-gray-100 to-gray-200 border border-gray-200 flex items-center justify-center font-bold text-gray-600 shadow-sm shrink-0">
                          {app.company.charAt(0)}
                        </div>
                        <div>
                          <h3 className="font-bold text-text-primary">{app.company}</h3>
                          <div className="flex items-center gap-2 mt-0.5">
                            <span className="text-sm font-medium text-text-secondary">{app.role}</span>
                            <span className="w-1 h-1 rounded-full bg-surface-secondary"></span>
                            <span className="text-xs text-text-tertiary flex items-center gap-1">
                              <MapPin className="w-3 h-3" /> {app.location || 'Remote'}
                            </span>
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1.5 rounded-full text-xs font-bold inline-block ${getStatusColor(app.status)}`}>
                        {app.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm font-medium text-text-secondary">
                      {app.date_applied || 'Not applied'}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button className="p-2 text-text-tertiary hover:text-text-primary hover:bg-surface-secondary rounded-lg transition-colors">
                        <MoreHorizontal className="w-5 h-5" />
                      </button>
                    </td>
                  </motion.tr>
                )) : (
                  <tr>
                    <td colSpan={4} className="px-6 py-12 text-center text-text-tertiary">
                      <div className="flex flex-col items-center justify-center">
                        <Search className="w-10 h-10 mb-3 opacity-20" />
                        <p className="font-medium text-sm">No applications found matching your criteria.</p>
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
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-lg bg-surface rounded-2xl shadow-2xl overflow-hidden"
            >
              <div className="p-6 border-b border-surface-secondary flex justify-between items-center">
                <h2 className="text-xl font-bold">New Application</h2>
                <button onClick={() => setIsModalOpen(false)} className="p-2 text-text-tertiary hover:text-text-primary hover:bg-surface-secondary rounded-full transition-colors">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                </button>
              </div>
              <div className="p-6 space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-bold text-text-secondary">Company</label>
                  <input type="text" placeholder="e.g. Google" value={newApp.company} onChange={e => setNewApp({...newApp, company: e.target.value})} className="w-full px-4 py-2.5 bg-surface-secondary/50 border border-transparent focus:border-primary/50 focus:bg-surface rounded-xl outline-none transition-all text-sm font-medium" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-text-secondary">Role</label>
                  <input type="text" placeholder="e.g. Frontend Engineer" value={newApp.role} onChange={e => setNewApp({...newApp, role: e.target.value})} className="w-full px-4 py-2.5 bg-surface-secondary/50 border border-transparent focus:border-primary/50 focus:bg-surface rounded-xl outline-none transition-all text-sm font-medium" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                   <div className="space-y-2">
                    <label className="text-sm font-bold text-text-secondary">Status</label>
                    <select value={newApp.status} onChange={e => setNewApp({...newApp, status: e.target.value as ApplicationStatus})} className="w-full px-4 py-2.5 bg-surface-secondary/50 border border-transparent focus:border-primary/50 focus:bg-surface rounded-xl outline-none transition-all text-sm font-medium appearance-none">
                      {statuses.map(s => <option key={s} value={s}>{s}</option>)}
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-text-secondary">Location</label>
                    <input type="text" placeholder="e.g. Remote" value={newApp.location} onChange={e => setNewApp({...newApp, location: e.target.value})} className="w-full px-4 py-2.5 bg-surface-secondary/50 border border-transparent focus:border-primary/50 focus:bg-surface rounded-xl outline-none transition-all text-sm font-medium" />
                  </div>
                </div>
              </div>
              <div className="p-6 border-t border-surface-secondary bg-surface-secondary/20 flex justify-end gap-3">
                <button onClick={() => setIsModalOpen(false)} className="px-5 py-2.5 rounded-xl font-bold text-text-secondary hover:bg-surface-secondary transition-colors">Cancel</button>
                <button onClick={handleSave} className="px-5 py-2.5 rounded-xl font-bold bg-primary hover:bg-primary-hover text-white transition-colors shadow-sm shadow-primary/20">Save Application</button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
