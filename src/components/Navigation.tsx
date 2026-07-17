'use client';

import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';

export default function Navigation() {
  const pathname = usePathname();

  const links = [
    { href: '/', label: 'Overview' },
    { href: '/applications', label: 'Applications' },
    { href: '/calendar', label: 'Calendar' },
    { href: '/analytics', label: 'Analytics' },
  ];

  return (
    <header className="sticky top-0 z-40 bg-surface border-b border-surface-secondary">
      <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-start md:items-center px-4 md:px-8">
        <div className="flex items-center gap-3 h-16 mr-8">
          <Image src="/SmileyFace.svg" alt="Pyni Logo" width={32} height={32} className="w-8 h-8" />
          <span className="font-semibold tracking-tight text-text-primary">Pyni</span>
        </div>
        
        <nav className="flex items-center gap-6 h-12 md:h-16 w-full md:w-auto overflow-x-auto hide-scrollbar text-sm font-medium">
          {links.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link 
                key={link.href}
                href={link.href} 
                className={`relative h-full flex items-center whitespace-nowrap transition-colors ${isActive ? 'text-text-primary' : 'text-text-secondary hover:text-text-primary'}`}
              >
                {link.label}
                {isActive && (
                  <span className="absolute bottom-0 left-0 right-0 h-[2px] bg-primary rounded-t-full" />
                )}
              </Link>
            );
          })}
        </nav>
      </div>
    </header>
  );
}
