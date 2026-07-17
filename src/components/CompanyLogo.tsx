'use client';

import { useState } from 'react';

interface CompanyLogoProps {
  company: string;
  className?: string;
}

export default function CompanyLogo({ company, className = "" }: CompanyLogoProps) {
  const [error, setError] = useState(false);
  // Clean company name: e.g. "Google Inc." -> "google.com"
  const cleanName = company.split(' ')[0].toLowerCase().replace(/[^a-z0-9]/g, '');
  const domain = `${cleanName}.com`;
  
  if (error) {
    return (
      <div className={`rounded-md bg-surface-secondary flex items-center justify-center font-semibold text-text-primary shrink-0 ${className}`}>
        {company.charAt(0)}
      </div>
    );
  }

  return (
    <img 
      src={`https://www.google.com/s2/favicons?domain=${domain}&sz=128`}
      alt={`${company} logo`}
      className={`object-contain shrink-0 ${className}`}
      onError={() => setError(true)}
    />
  );
}
