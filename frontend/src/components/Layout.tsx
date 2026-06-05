import { ReactNode } from 'react';
import { Activity } from 'lucide-react';

interface LayoutProps {
  children: ReactNode;
}

function Layout({ children }: LayoutProps) {
  return (
    <div className="min-h-screen bg-[#F8FAFC] font-sans text-[#0F172A]">
      <nav className="bg-[#0F172A] text-white">
        <div className="mx-auto flex max-w-6xl items-center gap-2 px-4 py-4 sm:px-6">
          <Activity className="h-6 w-6 text-[#3B82F6]" />
          <span className="text-lg font-semibold">Monitor Industrial</span>
        </div>
      </nav>

      <main className="mx-auto max-w-6xl px-4 py-8 sm:px-6">{children}</main>
    </div>
  );
}

export default Layout;
