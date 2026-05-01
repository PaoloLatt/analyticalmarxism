'use client';

import { useState } from 'react';
import { usePathname } from 'next/navigation';
import Sidebar from './Sidebar';
import TopBar from './TopBar';
import Footer from './Footer';

interface ThinkerItem { name: string; slug: string; }

interface LayoutShellProps {
  children: React.ReactNode;
  thinkers: ThinkerItem[];
}

export default function LayoutShell({ children, thinkers }: LayoutShellProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const pathname = usePathname();

  if (pathname.startsWith('/admin')) {
    return <>{children}</>;
  }

  return (
    <>
      <Sidebar
        thinkers={thinkers}
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />
      <div className="lg:ml-[200px] flex flex-col min-h-screen">
        <TopBar onMenuClick={() => setSidebarOpen(true)} />
        <main className="flex-1">{children}</main>
        <Footer />
      </div>
    </>
  );
}
