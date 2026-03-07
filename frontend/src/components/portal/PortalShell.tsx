import { useEffect } from 'react';
import { Outlet, useNavigate, useLocation, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Send, FileText, Map, Bell } from 'lucide-react';
import { useAuthStore } from '@/store/authSlice';

const TABS = [
  { icon: Send, label: 'Submit', path: '/portal/submit' },
  { icon: FileText, label: 'My Reports', path: '/portal/reports' },
  { icon: Map, label: 'Safe Routes', path: '/portal/routes' },
  { icon: Bell, label: 'Alerts', path: '/portal/alerts' },
];

export const PortalShell = () => {
  const { status } = useAuthStore();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (status !== 'authenticated') {
      navigate('/auth/signin');
    }
  }, [status, navigate]);

  if (status !== 'authenticated') return null;

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Top bar */}
      <header className="flex items-center justify-between h-12 px-4 border-b border-border flex-shrink-0">
        <Link to="/portal/submit" className="font-mono text-sm text-primary tracking-widest">HIP</Link>
        <Link
          to="/portal/submit"
          className="font-mono text-[10px] tracking-wider text-primary border border-primary/30 rounded-sm px-3 py-1.5 hover:bg-primary/10 transition-colors"
        >
          REPORT
        </Link>
      </header>

      {/* Classification strip */}
      <div className="h-6 flex items-center justify-center bg-primary/5 border-b border-primary/20">
        <p className="font-mono text-[10px] text-primary tracking-wider">
          YOUR REPORTS HELP PROTECT YOUR COMMUNITY
        </p>
      </div>

      {/* Content */}
      <main className="flex-1 overflow-y-auto">
        <Outlet />
      </main>

      {/* Bottom tab bar */}
      <nav className="flex h-14 border-t border-border bg-popover flex-shrink-0">
        {TABS.map(tab => {
          const isActive = location.pathname === tab.path;
          return (
            <Link
              key={tab.path}
              to={tab.path}
              className={`flex-1 flex flex-col items-center justify-center gap-0.5 transition-colors ${
                isActive ? 'text-primary' : 'text-muted-foreground'
              }`}
            >
              <tab.icon className="w-4 h-4" />
              <span className="font-mono text-[8px] tracking-wider">{tab.label}</span>
              {isActive && (
                <motion.div
                  layoutId="portal-tab"
                  className="absolute bottom-0 h-0.5 w-10 bg-primary rounded-full"
                />
              )}
            </Link>
          );
        })}
      </nav>
    </div>
  );
};
