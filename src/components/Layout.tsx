import { NavLink, Outlet, useNavigate, useLocation } from 'react-router-dom';
import { useState, useEffect } from 'react';
import {
  LayoutDashboard,
  Map,
  ShieldAlert,
  History,
  FileWarning,
  Brain,
  BarChart3,
  Database,
  BookOpen,
  Settings,
  Bell,
  Search,
  ChevronDown,
  LogOut,
  Menu,
  X,
  MapPin,
} from 'lucide-react';
import { LogoFull } from '@/components/Logo';
import { useAuth } from '@/context/AuthContext';
import type { UserRole } from '@/types';

const NAV_ITEMS: { to: string; label: string; icon: typeof LayoutDashboard; roles?: UserRole[] }[] = [
  { to: '/dashboard', label: 'Overview', icon: LayoutDashboard },
  { to: '/map', label: 'Live Map', icon: Map },
  { to: '/risk', label: 'Risk Intelligence', icon: ShieldAlert, roles: ['admin', 'planner', 'disaster'] },
  { to: '/problem-memory', label: 'Problem Memory', icon: History },
  { to: '/incidents', label: 'Incidents', icon: FileWarning },
  { to: '/analysis', label: 'AI Analysis', icon: Brain, roles: ['admin', 'planner', 'disaster'] },
  { to: '/reports', label: 'Reports', icon: BarChart3, roles: ['admin', 'planner', 'disaster'] },
  { to: '/datasets', label: 'Datasets', icon: Database, roles: ['admin'] },
  { to: '/methodology', label: 'Methodology', icon: BookOpen },
  { to: '/settings', label: 'Settings', icon: Settings, roles: ['admin'] },
];

export function Layout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const main = document.querySelector('main');
    if (!main) return;
    const handler = () => setScrolled(main.scrollTop > 4);
    main.addEventListener('scroll', handler);
    return () => main.removeEventListener('scroll', handler);
  }, []);

  useEffect(() => {
    setSidebarOpen(false);
    setProfileOpen(false);
  }, [location.pathname]);

  const visibleNav = NAV_ITEMS.filter(
    (item) => !item.roles || (user && item.roles.includes(user.role))
  );

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-navy-950 flex">
      {/* Sidebar */}
      <aside
        className={`fixed lg:sticky top-0 left-0 z-40 h-screen w-64 bg-navy-900 border-r border-white/5 flex flex-col transition-transform duration-300 ease-out ${
          sidebarOpen ? 'translate-x-0 shadow-2xl shadow-black/50' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        <div className="p-4 border-b border-white/5 flex items-center justify-between">
          <button onClick={() => navigate('/')} className="cursor-pointer group">
            <LogoFull />
          </button>
          <button
            className="lg:hidden text-slate-400 hover:text-white transition-transform hover:rotate-90 duration-200"
            onClick={() => setSidebarOpen(false)}
          >
            <X size={20} />
          </button>
        </div>

        <div className="px-4 py-3 border-b border-white/5">
          <div className="flex items-center gap-2 text-xs text-slate-500">
            <MapPin size={14} className="text-accent-400 animate-pulse-slow" />
            <span>Shillong, Meghalaya</span>
          </div>
        </div>

        <nav className="flex-1 overflow-y-auto p-3 space-y-1">
          {visibleNav.map((item, i) => (
            <NavLink
              key={item.to}
              to={item.to}
              onClick={() => setSidebarOpen(false)}
              className={({ isActive }) =>
                `nav-link ${isActive ? 'nav-link-active' : ''}`
              }
              style={{ animation: `slideUp 0.3s ease-out ${i * 0.04}s both` }}
            >
              <item.icon size={18} className="transition-transform duration-200 group-hover:scale-110" />
              <span>{item.label}</span>
            </NavLink>
          ))}
        </nav>

        <div className="p-3 border-t border-white/5">
          <NavLink to="/submit-observation" className="nav-link group">
            <FileWarning size={18} className="transition-transform duration-200 group-hover:rotate-12" />
            <span>Submit Observation</span>
          </NavLink>
        </div>
      </aside>

      {sidebarOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/50 lg:hidden animate-fade-in"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Main content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top bar */}
        <header className={`sticky top-0 z-20 h-14 flex items-center px-4 gap-4 transition-all duration-300 ${
          scrolled ? 'bg-navy-900/90 backdrop-blur-lg border-b border-white/5 shadow-lg shadow-black/20' : 'bg-navy-900/80 backdrop-blur-md border-b border-white/5'
        }`}>
          <button
            className="lg:hidden text-slate-400 hover:text-white transition-transform hover:scale-110 duration-200"
            onClick={() => setSidebarOpen(true)}
          >
            <Menu size={20} />
          </button>

          <div className="hidden md:flex items-center gap-2 flex-1 max-w-md">
            <div className="relative flex-1 group">
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 transition-colors group-focus-within:text-accent-400" />
              <input
                type="text"
                placeholder="Search locations, incidents..."
                className="w-full pl-9 pr-3 py-1.5 rounded-lg bg-navy-800 border border-white/5 text-sm text-slate-300 placeholder:text-slate-500 focus:outline-none focus:border-accent-500/30 focus:bg-navy-700/50 focus:ring-2 focus:ring-accent-500/10 transition-all duration-200"
              />
            </div>
          </div>

          <div className="flex-1 md:hidden" />

          <button className="relative text-slate-400 hover:text-white p-2 rounded-lg hover:bg-white/5 transition-all duration-200 hover:scale-110">
            <Bell size={18} />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-accent-400 rounded-full animate-pulse-ring" />
          </button>

          <div className="relative">
            <button
              onClick={() => setProfileOpen(!profileOpen)}
              className="flex items-center gap-2 px-2 py-1.5 rounded-lg hover:bg-white/5 transition-all duration-200"
            >
              <div className="w-7 h-7 rounded-full bg-accent-500/20 flex items-center justify-center text-accent-400 text-xs font-semibold ring-2 ring-accent-500/0 hover:ring-accent-500/30 transition-all duration-200">
                {user?.name.charAt(0) ?? 'U'}
              </div>
              <span className="hidden sm:block text-sm text-slate-300">{user?.name ?? 'Guest'}</span>
              <ChevronDown size={14} className={`text-slate-500 transition-transform duration-200 ${profileOpen ? 'rotate-180' : ''}`} />
            </button>
            {profileOpen && (
              <div className="absolute right-0 mt-2 w-48 glass-card p-1 shadow-xl animate-scale-in origin-top-right">
                <div className="px-3 py-2 border-b border-white/5">
                  <p className="text-sm text-slate-300">{user?.name}</p>
                  <p className="text-xs text-slate-500 capitalize">{user?.role} Role</p>
                </div>
                <button
                  onClick={() => { setProfileOpen(false); navigate('/settings'); }}
                  className="w-full flex items-center gap-2 px-3 py-2 text-sm text-slate-400 hover:text-white hover:bg-white/5 rounded-lg transition-colors"
                >
                  <Settings size={16} />
                  Settings
                </button>
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-2 px-3 py-2 text-sm text-slate-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
                >
                  <LogOut size={16} />
                  Sign Out
                </button>
              </div>
            )}
          </div>
        </header>

        <main className="flex-1 overflow-auto p-4 lg:p-6">
          <div key={location.pathname} className="page-transition">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}
