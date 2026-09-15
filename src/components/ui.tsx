import { ReactNode, useEffect, useRef, useState } from 'react';
import { AlertTriangle } from 'lucide-react';
import type { RiskLevel } from '@/types';
import { RISK_BG } from '@/types';

export function Card({ children, className = '' }: { children: ReactNode; className?: string }) {
  return <div className={`glass-card p-5 ${className}`}>{children}</div>;
}

function useCountUp(target: number, duration = 800): number {
  const [value, setValue] = useState(0);
  const started = useRef(false);

  useEffect(() => {
    if (started.current) return;
    started.current = true;
    const start = performance.now();
    const animate = (now: number) => {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setValue(Math.round(target * eased));
      if (progress < 1) requestAnimationFrame(animate);
    };
    requestAnimationFrame(animate);
  }, [target, duration]);

  return value;
}

export function KpiCard({
  label,
  value,
  icon: Icon,
  accent = 'text-accent-400',
  isDemo = false,
}: {
  label: string;
  value: string | number;
  icon: typeof AlertTriangle;
  accent?: string;
  isDemo?: boolean;
}) {
  const numericValue = typeof value === 'number' ? value : 0;
  const displayValue = typeof value === 'string' ? value : useCountUp(numericValue);

  return (
    <div className="glass-card glass-card-hover p-4 relative overflow-hidden group">
      <div className={`absolute -right-8 -top-8 w-24 h-24 rounded-full opacity-5 blur-2xl transition-opacity duration-300 group-hover:opacity-10 ${accent.replace('text-', 'bg-')}`} />
      <div className="flex items-start justify-between relative">
        <div>
          <p className="text-xs text-slate-500 uppercase tracking-wider font-medium">{label}</p>
          <p className="text-2xl font-bold text-white mt-1 tabular-nums">{displayValue}</p>
        </div>
        <div className={`p-2 rounded-lg bg-white/5 ${accent} transition-transform duration-300 group-hover:scale-110 group-hover:-rotate-6`}>
          <Icon size={20} />
        </div>
      </div>
      {isDemo && (
        <span className="absolute top-2 right-2 text-[10px] text-slate-600 font-medium">DEMO</span>
      )}
    </div>
  );
}

export function RiskBadge({ level }: { level: RiskLevel }) {
  return (
    <span className={`badge ${RISK_BG[level]} hover:scale-110 cursor-default`}>
      {level}
    </span>
  );
}

export function StatusBadge({ status }: { status: string }) {
  const colors: Record<string, string> = {
    Reported: 'bg-blue-500/15 text-blue-400 border-blue-500/30',
    'Under Review': 'bg-purple-500/15 text-purple-400 border-purple-500/30',
    Verified: 'bg-accent-500/15 text-accent-400 border-accent-500/30',
    Assigned: 'bg-indigo-500/15 text-indigo-400 border-indigo-500/30',
    'In Progress': 'bg-orange-500/15 text-orange-400 border-orange-500/30',
    Resolved: 'bg-green-500/15 text-green-400 border-green-500/30',
    Reopened: 'bg-red-500/15 text-red-400 border-red-500/30',
    Rejected: 'bg-slate-500/15 text-slate-400 border-slate-500/30',
    Pending: 'bg-slate-500/15 text-slate-400 border-slate-500/30',
    Monitoring: 'bg-cyan-500/15 text-cyan-400 border-cyan-500/30',
    'Inspection Recommended': 'bg-amber-500/15 text-amber-400 border-amber-500/30',
    'Inspection Required': 'bg-red-500/15 text-red-400 border-red-500/30',
    Unverified: 'bg-slate-500/15 text-slate-400 border-slate-500/30',
  };
  return <span className={`badge ${colors[status] ?? colors.Pending} hover:scale-105 cursor-default`}>{status}</span>;
}

export function DemoBadge() {
  return (
    <span className="badge bg-amber-500/15 text-amber-400 border-amber-500/30 hover:scale-105 cursor-default animate-pulse-slow">
      Demo Data
    </span>
  );
}

export function PageHeader({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle?: string;
  children?: ReactNode;
}) {
  return (
    <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 animate-slide-up">
      <div>
        <h1 className="text-xl font-bold text-white">{title}</h1>
        {subtitle && <p className="text-sm text-slate-500 mt-1">{subtitle}</p>}
      </div>
      {children && <div className="flex items-center gap-2 flex-wrap">{children}</div>}
    </div>
  );
}

export function LoadingSpinner() {
  return (
    <div className="flex items-center justify-center py-12">
      <div className="relative">
        <div className="w-10 h-10 border-2 border-accent-500/20 rounded-full" />
        <div className="absolute inset-0 w-10 h-10 border-2 border-accent-500 border-t-transparent rounded-full animate-spin" />
      </div>
    </div>
  );
}

export function EmptyState({ message }: { message: string }) {
  return (
    <div className="text-center py-12 text-slate-500 animate-fade-in">
      <AlertTriangle size={24} className="mx-auto mb-2 opacity-50" />
      <p className="text-sm">{message}</p>
    </div>
  );
}

export function Disclaimer({ text }: { text?: string }) {
  return (
    <div className="flex items-start gap-2 p-3 rounded-lg bg-amber-500/10 border border-amber-500/20 text-xs text-amber-400/80 transition-all duration-200 hover:bg-amber-500/15">
      <AlertTriangle size={14} className="mt-0.5 flex-shrink-0 animate-pulse-slow" />
      <p>{text ?? 'MEGH-SCAN is an AI-assisted decision-support prototype. Results are indicators for human inspection, not guaranteed predictions or official warnings.'}</p>
    </div>
  );
}
