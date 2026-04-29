import AdminSidebar from '@/components/AdminSidebar';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex bg-parchment">
      <AdminSidebar />
      <div className="flex-1 flex flex-col min-w-0">
        <div className="h-11 flex items-center px-6 border-b border-sand bg-cream shrink-0">
          <span className="text-[0.75rem] text-muted font-sans">
            Admin Panel
          </span>
        </div>
        <main className="flex-1 p-6 overflow-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
