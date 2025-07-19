import React from 'react';

export const Timeline: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div className="space-y-8">{children}</div>
);

interface TimelineItemProps {
  title: string;
  description: string;
  icon?: React.ReactNode;
  children?: React.ReactNode;
}

export const TimelineItem: React.FC<TimelineItemProps> = ({ title, description, icon, children }) => (
  <div className="flex items-start gap-4">
    <div className="mt-1">{icon}</div>
    <div>
      <h3 className="font-bold text-lg text-white">{title}</h3>
      <p className="text-white/70 mb-2">{description}</p>
      {children}
    </div>
  </div>
);