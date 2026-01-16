'use client';

import React from 'react';
import { Sidebar } from './Sidebar';

interface MainLayoutProps {
  children: React.ReactNode;
}

export const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  return (
    <div className="flex h-screen overflow-hidden bg-gray-50 dark:bg-background-dark font-display text-gray-900 dark:text-white">
      <Sidebar />
      <main className="flex-1 flex flex-col h-full overflow-hidden">
        {children}
      </main>
    </div>
  );
};





