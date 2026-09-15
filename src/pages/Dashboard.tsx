import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  MapPin,
  Repeat,
  AlertOctagon,
  CloudRain,
  CheckCircle,
  Search,
  Activity,
  ArrowRight,
  TrendingUp,
} from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  Legend,
} from 'recharts';
import { KpiCard, Card, RiskBadge, StatusBadge, DemoBadge, LoadingSpinner, PageHeader } from '@/components/ui';
import { supabase } from '@/lib/supabase';
import type { Location, Incident } from '@/types';
import { formatDate, timeAgo } from '@/lib/utils';

const tooltipStyle = { background: '#102238', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '0.5rem', fontSize: '12px', animation: 'scaleIn 0.15s ease-out' };

export function Dashboard() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [locations, setLocations] = useState<Location[]>([]);
  const [incidents, setIncidents] = useState<Incident[]>([]);
  const [recentIncidents, setRecentIncidents] = useState<Incident[]>([]);

  useEffect(() => {
    async function fetchData() {
      const [{ data: locs }, { data: incs }] = await Promise.all([
        supabase.from('locations').select('*').order('priority_score', { ascending: false }),
        supabase.from('incidents').select('*').order('reported_date', { ascending: false }),
      ]);
      setLocations(locs ?? []);
      setIncidents(incs ?? []);
      setRecentIncidents((incs ?? []).slice(0, 6));
      setLoading(false);
    }
    fetchData();
  }, []);

  if (loading) return <LoadingSpinner />;

  const recurringZones = locations.filter((l) => l.recurrence_count >= 3).length;
  const highPriority = locations.filter((l) => l.priority_score >= 65).length;
  const monsoonIncidents = incidents.filter((i) => {
    const m = new Date(i.reported_date).getMonth();
    return m >= 5 && m <= 8;
  }).length;
  const verifiedPct = incidents.length > 0
    ? Math.round((incidents.filter((i) => i.verification_status === 'Verified').length / incidents.length) * 100)
    : 0;
  const needsInspection = locations.filter((l) =>
    l.inspection_status === 'Inspection Required' || l.inspection_status === 'Inspection Recommended'
  ).length;

  const categoryCounts: Record<string, number> = {};
  incidents.forEach((i) => { categoryCounts[i.category] = (categoryCounts[i.category] ?? 0) + 1; });
  const categoryData = Object.entries(categoryCounts)
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count);

  const monthlyData: Record<string, { month: string; incidents: number; rainfall: number; resolved: number }> = {};
  const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  for (let m = 0; m < 12; m++) {
    monthlyData[m] = { month: monthNames[m], incidents: 0, rainfall: 0, resolved: 0 };
  }
  incidents.forEach((i) => {
    const d = new Date(i.reported_date);
    if (d.getFullYear() === 2025) {
      monthlyData[d.getMonth()].incidents++;
      if (i.status === 'Resolved') monthlyData[d.getMonth()].resolved++;
    }
  });
  const trendData = Object.values(monthlyData).slice(0, 9);

  const priorityQueue = locations.slice(0, 6);

  return (
    <div className="animate-fade-in">
      <PageHeader title="Command Dashboard" subtitle="Shillong, Meghalaya — Overview of monitored infrastructure risk">
        <DemoBadge />
      </PageHeader>

      {/* KPI Cards with stagger */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 mb-6 stagger">
        <KpiCard label="Monitored Locations" value={locations.length} icon={MapPin} accent="text-accent-400" isDemo />
        <KpiCard label="Recurring Zones" value={recurringZones} icon={Repeat} accent="text-orange-400" isDemo />
        <KpiCard label="High-Priority" value={highPriority} icon={AlertOctagon} accent="text-red-400" isDemo />
        <KpiCard label="Monsoon Incidents" value={monsoonIncidents} icon={CloudRain} accent="text-blue-400" isDemo />
        <KpiCard label="Verified" value={`${verifiedPct}%`} icon={CheckCircle} accent="text-green-400" isDemo />
        <KpiCard label="Need Inspection" value={needsInspection} icon={Search} accent="text-amber-400" isDemo />
      </div>

      <div className="grid lg:grid-cols-3 gap-4 mb-4">
        {/* Recurring Problem Chart */}
        <Card className="lg:col-span-1 group">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold text-white">Recurring Problem Categories</h3>
            <TrendingUp size={14} className="text-slate-600 group-hover:text-accent-400 transition-colors duration-300" />
          </div>
          <ResponsiveContainer width="100%" height={240}>
            <BarChart data={categoryData} layout="vertical" margin={{ left: 20, right: 10 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
              <XAxis type="number" stroke="#475569" fontSize={11} />
              <YAxis type="category" dataKey="name" stroke="#64748b" fontSize={10} width={80} tickLine={false} axisLine={false} />
              <Tooltip contentStyle={tooltipStyle} labelStyle={{ color: '#e2e8f0' }} cursor={{ fill: 'rgba(34, 211, 238, 0.05)' }} />
              <Bar dataKey="count" fill="#22d3ee" radius={[0, 4, 4, 0]} animationDuration={800} />
            </BarChart>
          </ResponsiveContainer>
        </Card>

        {/* Risk Trend Chart */}
        <Card className="lg:col-span-2 group">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold text-white">Risk Trend — 2025</h3>
            <TrendingUp size={14} className="text-slate-600 group-hover:text-accent-400 transition-colors duration-300" />
          </div>
          <ResponsiveContainer width="100%" height={240}>
            <LineChart data={trendData} margin={{ left: -20, right: 10 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
              <XAxis dataKey="month" stroke="#475569" fontSize={11} />
              <YAxis stroke="#475569" fontSize={11} />
              <Tooltip contentStyle={tooltipStyle} labelStyle={{ color: '#e2e8f0' }} cursor={{ stroke: 'rgba(34, 211, 238, 0.2)', strokeWidth: 1 }} />
              <Legend wrapperStyle={{ fontSize: '11px' }} />
              <Line type="monotone" dataKey="incidents" stroke="#f97316" strokeWidth={2} name="Incidents" dot={{ r: 3 }} activeDot={{ r: 5, animationDuration: 200 }} animationDuration={1000} />
              <Line type="monotone" dataKey="resolved" stroke="#22c55e" strokeWidth={2} name="Resolved" dot={{ r: 3 }} activeDot={{ r: 5, animationDuration: 200 }} animationDuration={1200} />
            </LineChart>
          </ResponsiveContainer>
        </Card>
      </div>

      <div className="grid lg:grid-cols-2 gap-4">
        {/* Priority Queue */}
        <Card>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold text-white">Priority Queue — Locations Needing Attention</h3>
            <button onClick={() => navigate('/risk')} className="text-xs text-accent-400 hover:text-accent-300 flex items-center gap-1 transition-all hover:translate-x-0.5">
              View all <ArrowRight size={12} />
            </button>
          </div>
          <div className="space-y-2">
            {priorityQueue.map((loc, i) => (
              <button
                key={loc.id}
                onClick={() => navigate(`/problem-memory/${loc.id}`)}
                className="w-full flex items-center gap-3 p-2.5 rounded-lg bg-white/5 hover:bg-white/10 transition-all duration-200 text-left group hover:translate-x-1 hover:shadow-md"
                style={{ animation: `slideUp 0.3s ease-out ${i * 0.06}s both` }}
              >
                <div className="flex-shrink-0 w-10 text-center relative">
                  <span className={`text-lg font-bold tabular-nums ${
                    loc.priority_score >= 80 ? 'text-red-400' :
                    loc.priority_score >= 65 ? 'text-orange-400' :
                    loc.priority_score >= 45 ? 'text-yellow-400' : 'text-green-400'
                  }`}>
                    {Math.round(loc.priority_score)}
                  </span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-white truncate group-hover:text-accent-300 transition-colors">{loc.name}</p>
                  <p className="text-xs text-slate-500">{loc.primary_problem} · {loc.recurrence_count} recurrences</p>
                </div>
                <RiskBadge level={loc.risk_level as 'Low' | 'Moderate' | 'High' | 'Critical'} />
                <ArrowRight size={14} className="text-slate-600 group-hover:text-accent-400 group-hover:translate-x-0.5 transition-all" />
              </button>
            ))}
          </div>
        </Card>

        {/* Recent Activity */}
        <Card>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold text-white flex items-center gap-2">
              <Activity size={16} className="text-accent-400" />
              Recent Activity
            </h3>
            <button onClick={() => navigate('/incidents')} className="text-xs text-accent-400 hover:text-accent-300 flex items-center gap-1 transition-all hover:translate-x-0.5">
              View all <ArrowRight size={12} />
            </button>
          </div>
          <div className="space-y-2">
            {recentIncidents.map((inc, i) => (
              <button
                key={inc.id}
                onClick={() => navigate(`/incidents/${inc.id}`)}
                className="w-full flex items-start gap-3 p-2.5 rounded-lg bg-white/5 hover:bg-white/10 transition-all duration-200 text-left group hover:translate-x-1"
                style={{ animation: `slideUp 0.3s ease-out ${i * 0.06}s both` }}
              >
                <div className="w-2 h-2 rounded-full bg-accent-400 mt-1.5 flex-shrink-0 animate-pulse-slow" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-white truncate group-hover:text-accent-300 transition-colors">{inc.category} — {inc.location_name ?? 'Unknown'}</p>
                  <p className="text-xs text-slate-500">{inc.source} · {timeAgo(inc.reported_date)}</p>
                </div>
                <StatusBadge status={inc.status} />
              </button>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}
