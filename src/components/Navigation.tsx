'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, Briefcase, Calendar as CalendarIcon, BarChart3, LogOut, User } from 'lucide-react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const navItems = [
  { name: 'Dashboard', href: '/', icon: LayoutDashboard },
  { name: 'Applications', href: '/applications', icon: Briefcase },
  { name: 'Calendar', href: '/calendar', icon: CalendarIcon },
  { name: 'Analytics', href: '/analytics', icon: BarChart3 },
];

export default function Navigation() {
  const pathname = usePathname();

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="hidden md:flex flex-col w-64 bg-surface border-r border-surface-secondary px-4 py-8 h-full sticky top-0 shadow-sm">
        <div className="flex items-center gap-3 px-2 mb-10">
          <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center text-primary font-bold text-xl">
            JT
          </div>
          <span className="text-xl font-bold text-text-primary tracking-tight">JobTracker</span>
        </div>

        <nav className="flex-1 space-y-2">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            const Icon = item.icon;
            return (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  'flex items-center gap-3 px-3 py-3 rounded-xl transition-all duration-200 group',
                  isActive 
                    ? 'bg-primary text-white shadow-md shadow-primary/20' 
                    : 'text-text-secondary hover:bg-surface-secondary hover:text-text-primary'
                )}
              >
                <Icon className={cn('w-5 h-5 transition-colors', isActive ? 'text-white' : 'text-text-tertiary group-hover:text-primary')} />
                <span className="font-medium">{item.name}</span>
              </Link>
            );
          })}
        </nav>

        <div className="mt-auto space-y-2">
          <button className="w-full flex items-center gap-3 px-3 py-3 rounded-xl text-text-secondary hover:bg-surface-secondary hover:text-text-primary transition-colors group">
            <User className="w-5 h-5 text-text-tertiary group-hover:text-primary" />
            <span className="font-medium">Profile</span>
          </button>
          <button className="w-full flex items-center gap-3 px-3 py-3 rounded-xl text-text-secondary hover:bg-status-rejected-bg hover:text-status-rejected-text transition-colors group">
            <LogOut className="w-5 h-5 text-text-tertiary group-hover:text-status-rejected-text" />
            <span className="font-medium">Log out</span>
          </button>
        </div>
      </aside>

      {/* Mobile Bottom Navigation */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-surface border-t border-surface-secondary px-6 py-3 flex justify-between items-center z-50 shadow-[0_-4px_20px_rgba(0,0,0,0.05)] pb-safe">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          const Icon = item.icon;
          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                'flex flex-col items-center gap-1 p-2 rounded-xl transition-all duration-200',
                isActive ? 'text-primary' : 'text-text-tertiary'
              )}
            >
              <div className={cn(
                'p-1.5 rounded-lg transition-all',
                isActive ? 'bg-primary/10' : 'bg-transparent'
              )}>
                <Icon className={cn('w-5 h-5', isActive ? 'text-primary' : 'text-text-tertiary')} />
              </div>
              <span className="text-[10px] font-medium">{item.name}</span>
            </Link>
          );
        })}
      </nav>
    </>
  );
}
