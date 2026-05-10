import { useState } from 'react';
import Sidebar from './Sidebar';
import Navbar from './Navbar';
import ToastContainer from './ToastContainer';

interface AppLayoutProps {
  children: React.ReactNode;
  title?: string;
}

const AppLayout = ({ children, title }: AppLayoutProps) => {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  return (
    <div className="min-h-screen bg-background flex">
      <Sidebar isOpen={sidebarOpen} onToggle={() => setSidebarOpen(v => !v)} />

      <div
        className={`flex-1 flex flex-col min-w-0 transition-all duration-300 ${sidebarOpen ? 'lg:ml-60' : 'lg:ml-16'}`}
      >
        <Navbar onMenuToggle={() => setSidebarOpen(v => !v)} title={title} />
        <main className="flex-1 p-4 md:p-6 lg:p-8 animate-fade-in" id="main-content" role="main">
          {children}
        </main>
      </div>

      <ToastContainer />
    </div>
  );
};

export default AppLayout;
