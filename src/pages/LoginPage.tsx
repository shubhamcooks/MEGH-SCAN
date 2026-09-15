import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { Shield, Map, Users, AlertTriangle, ArrowRight } from 'lucide-react';
import { LogoFull } from '@/components/Logo';
import { useAuth } from '@/context/AuthContext';
import type { UserRole } from '@/types';
import { Disclaimer } from '@/components/ui';

const ROLES: { role: UserRole; label: string; desc: string; icon: typeof Shield }[] = [
  { role: 'admin', label: 'Administrator', desc: 'Full access: manage users, verify reports, manage datasets, change incident status', icon: Shield },
  { role: 'planner', label: 'Urban Planner', desc: 'Analyse hotspots, view trends, compare locations, review priority scores, export reports', icon: Map },
  { role: 'disaster', label: 'Disaster Management', desc: 'View high-risk zones, monitor rainfall incidents, check road accessibility and emergency routes', icon: AlertTriangle },
  { role: 'public', label: 'Public User', desc: 'View public risk zones, explore map layers, submit observations, check nearby risk', icon: Users },
];

export function LoginPage() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [selected, setSelected] = useState<UserRole | null>(null);

  const handleEnter = () => {
    if (!selected) return;
    login(selected);
    navigate('/dashboard');
  };

  return (
    <div className="min-h-screen bg-navy-950 flex items-center justify-center p-6">
      <div className="absolute inset-0 opacity-10" style={{
        backgroundImage: `radial-gradient(circle at 50% 50%, rgba(34, 211, 238, 0.3) 0%, transparent 60%)`,
      }} />

      <div className="relative w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-block mb-4">
            <LogoFull />
          </div>
          <h1 className="text-xl font-bold text-white">Demo Login</h1>
          <p className="text-sm text-slate-500 mt-1">Select a role to explore the platform</p>
        </div>

        <div className="glass-card p-6">
          <div className="space-y-3">
            {ROLES.map((r) => (
              <button
                key={r.role}
                onClick={() => setSelected(r.role)}
                className={`w-full flex items-start gap-3 p-3 rounded-lg border transition-all text-left ${
                  selected === r.role
                    ? 'bg-accent-500/10 border-accent-500/40'
                    : 'bg-white/5 border-white/5 hover:bg-white/10 hover:border-white/10'
                }`}
              >
                <div className={`p-2 rounded-lg ${selected === r.role ? 'bg-accent-500/20 text-accent-400' : 'bg-white/5 text-slate-400'}`}>
                  <r.icon size={18} />
                </div>
                <div className="flex-1">
                  <p className={`text-sm font-semibold ${selected === r.role ? 'text-white' : 'text-slate-300'}`}>
                    {r.label}
                  </p>
                  <p className="text-xs text-slate-500 mt-0.5">{r.desc}</p>
                </div>
              </button>
            ))}
          </div>

          <button
            onClick={handleEnter}
            disabled={!selected}
            className="btn-primary w-full mt-6 flex items-center justify-center gap-2 disabled:opacity-40 disabled:cursor-not-allowed"
          >
            Enter Command Centre
            <ArrowRight size={16} />
          </button>

          <div className="mt-4">
            <Disclaimer text="This is a demo authentication system. No real credentials are required. Supabase Auth can be connected later." />
          </div>
        </div>

        <button
          onClick={() => navigate('/')}
          className="w-full text-center text-sm text-slate-500 hover:text-white mt-4 transition-colors"
        >
          Back to landing page
        </button>
      </div>
    </div>
  );
}
