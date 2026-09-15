import { useEffect, useState, useMemo } from 'react';
import {
  BarChart, Bar, LineChart, Line, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
} from 'recharts';
import { Download } from 'lucide-react';
import { Card, LoadingSpinner, PageHeader, DemoBadge } from '@/components/ui';
import { supabase } from '@/lib/supabase';
import type { Incident, Location } from '@/types';
import { downloadCsv } from '@/lib/utils';

const COLORS = ['#22d3ee', '#f97316', '#ef4444', '#84cc16', '#8b5cf6', '#fbbf24', '#3b82f6', '#a16207', '#64748b', '#ec4899'];

export function ReportsPage() {
  const [loading, setLoading] = useState(true);
  const [incidents, setIncidents] = useState<Incident[]>([]);
  const [locations, setLocations] = useState<Location[]>([]);
  const [districtFilter, setDistrictFilter] = useState('all');
  const [categoryFilter, setCategoryFilter] = useState('all');

  useEffect(() => {
    async function fetchData() {
      const [{ data: incs }, { data: locs }] = await Promise.all([
        supabase.from('incidents').select('*'),
        supabase.from('locations').select('*'),
      ]);
      setIncidents(incs ?? []);
      setLocations(locs ?? []);
      setLoading(false);
    }
    fetchData();
  }, []);

  const filteredIncidents = useMemo(() => {
    let result = incidents;
    if (categoryFilter !== 'all') result = result.filter((i) => i.category === categoryFilter);
    return result;
  }, [incidents, categoryFilter]);

  // A: Incidents by category
  const categoryData = useMemo(() => {
    const counts: Record<string, number> = {};
    filteredIncidents.forEach((i) => { counts[i.category] = (counts[i.category] ?? 0) + 1; });
    return Object.entries(counts).map(([name, count]) => ({ name, count })).sort((a, b) => b.count - a.count);
  }, [filteredIncidents]);

  // B: Incidents over time (by year-month)
  const timeData = useMemo(() => {
    const months: Record<string, number> = {};
    filteredIncidents.forEach((i) => {
      const d = new Date(i.reported_date);
      const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
      months[key] = (months[key] ?? 0) + 1;
    });
    return Object.entries(months).sort().map(([month, count]) => {
      const [y, m] = month.split('-');
      return { month: `${['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'][parseInt(m)-1]} ${y}`, count };
    });
  }, [filteredIncidents]);

  // C: Recurring locations by district
  const districtData = useMemo(() => {
    const counts: Record<string, number> = {};
    locations.forEach((l) => { counts[l.district] = (counts[l.district] ?? 0) + 1; });
    return Object.entries(counts).map(([name, count]) => ({ name, count }));
  }, [locations]);

  // D: Verified vs unverified
  const verifiedData = useMemo(() => {
    const verified = filteredIncidents.filter((i) => i.verification_status === 'Verified').length;
    const unverified = filteredIncidents.length - verified;
    return [
      { name: 'Verified', value: verified },
      { name: 'Unverified', value: unverified },
    ];
  }, [filteredIncidents]);

  // E: Resolved vs unresolved
  const resolvedData = useMemo(() => {
    const resolved = filteredIncidents.filter((i) => i.status === 'Resolved').length;
    const inProgress = filteredIncidents.filter((i) => i.status === 'In Progress').length;
    const open = filteredIncidents.filter((i) => ['Reported', 'Under Review', 'Assigned', 'Reopened'].includes(i.status)).length;
    return [
      { name: 'Resolved', value: resolved },
      { name: 'In Progress', value: inProgress },
      { name: 'Open', value: open },
    ];
  }, [filteredIncidents]);

  // F: Priority distribution
  const priorityData = useMemo(() => {
    const dist: Record<string, number> = { Low: 0, Moderate: 0, High: 0, Critical: 0 };
    locations.forEach((l) => { dist[l.risk_level] = (dist[l.risk_level] ?? 0) + 1; });
    return Object.entries(dist).map(([name, value]) => ({ name, value }));
  }, [locations]);

  // G: Seasonal trend
  const seasonalData = useMemo(() => {
    const seasons = { 'Pre-Monsoon': 0, 'Monsoon': 0, 'Post-Monsoon': 0 };
    filteredIncidents.forEach((i) => {
      const m = new Date(i.reported_date).getMonth();
      if (m >= 5 && m <= 8) seasons['Monsoon']++;
      else if (m >= 9 && m <= 10) seasons['Post-Monsoon']++;
      else seasons['Pre-Monsoon']++;
    });
    return Object.entries(seasons).map(([name, count]) => ({ name, count }));
  }, [filteredIncidents]);

  // H: Road accessibility impact
  const roadImpactData = useMemo(() => {
    const affectingRoads = locations.filter((l) =>
      l.primary_problem === 'Waterlogging' || l.primary_problem === 'Road Damage' || l.primary_problem === 'Erosion'
    ).length;
    const affectingEmergency = locations.filter((l) => l.priority_score >= 75).length;
    return [
      { name: 'Affecting Major Roads', value: affectingRoads },
      { name: 'Affecting Emergency Access', value: affectingEmergency },
    ];
  }, [locations]);

  const handleExport = () => {
    downloadCsv('megh-scan-report.csv',
      ['Category', 'Location', 'Severity', 'Date', 'Status', 'Verification', 'Source'],
      filteredIncidents.map((i) => [i.category, i.location_name, i.severity, i.reported_date, i.status, i.verification_status, i.source])
    );
  };

  if (loading) return <LoadingSpinner />;

  const tooltipStyle = { background: '#102238', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '0.5rem', fontSize: '12px' };

  return (
    <div className="animate-fade-in">
      <PageHeader title="Reports & Analytics" subtitle="Charts, trends and downloadable data">
        <button onClick={handleExport} className="btn-secondary flex items-center gap-2">
          <Download size={14} /> Export CSV
        </button>
        <DemoBadge />
      </PageHeader>

      {/* Filters */}
      <Card className="mb-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <select value={districtFilter} onChange={(e) => setDistrictFilter(e.target.value)} className="input-field">
            <option value="all">All Districts</option>
            <option value="East Khasi Hills">East Khasi Hills</option>
          </select>
          <select value={categoryFilter} onChange={(e) => setCategoryFilter(e.target.value)} className="input-field">
            <option value="all">All Categories</option>
            {Object.keys(COLORS).map((_, i) => null)}
            {['Waterlogging','Drainage Blockage','Road Damage','Landslide','Waste Accumulation','Water-Supply Disruption','Power Disruption','Flooding','Erosion','Other'].map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
          <div className="text-xs text-slate-500 flex items-center">
            {filteredIncidents.length} incidents · {locations.length} locations
          </div>
        </div>
      </Card>

      <div className="grid lg:grid-cols-2 gap-4">
        {/* A: Incidents by category */}
        <Card>
          <h3 className="text-sm font-semibold text-white mb-4">A. Incidents by Category</h3>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={categoryData} margin={{ left: -20 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
              <XAxis dataKey="name" stroke="#475569" fontSize={10} angle={-20} textAnchor="end" height={60} />
              <YAxis stroke="#475569" fontSize={11} />
              <Tooltip contentStyle={tooltipStyle} />
              <Bar dataKey="count" fill="#22d3ee" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </Card>

        {/* B: Incidents over time */}
        <Card>
          <h3 className="text-sm font-semibold text-white mb-4">B. Incidents Over Time</h3>
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={timeData} margin={{ left: -20 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
              <XAxis dataKey="month" stroke="#475569" fontSize={10} angle={-20} textAnchor="end" height={60} />
              <YAxis stroke="#475569" fontSize={11} />
              <Tooltip contentStyle={tooltipStyle} />
              <Line type="monotone" dataKey="count" stroke="#f97316" strokeWidth={2} dot={{ r: 3 }} />
            </LineChart>
          </ResponsiveContainer>
        </Card>

        {/* C: Recurring locations by district */}
        <Card>
          <h3 className="text-sm font-semibold text-white mb-4">C. Recurring Locations by District</h3>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={districtData} margin={{ left: -20 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
              <XAxis dataKey="name" stroke="#475569" fontSize={11} />
              <YAxis stroke="#475569" fontSize={11} />
              <Tooltip contentStyle={tooltipStyle} />
              <Bar dataKey="count" fill="#8b5cf6" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </Card>

        {/* D: Verified vs unverified */}
        <Card>
          <h3 className="text-sm font-semibold text-white mb-4">D. Verified vs Unverified Observations</h3>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie data={verifiedData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} label>
                <Cell fill="#22c55e" />
                <Cell fill="#64748b" />
              </Pie>
              <Tooltip contentStyle={tooltipStyle} />
              <Legend wrapperStyle={{ fontSize: '12px' }} />
            </PieChart>
          </ResponsiveContainer>
        </Card>

        {/* E: Resolved vs unresolved */}
        <Card>
          <h3 className="text-sm font-semibold text-white mb-4">E. Resolved vs Unresolved Incidents</h3>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={resolvedData} margin={{ left: -20 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
              <XAxis dataKey="name" stroke="#475569" fontSize={11} />
              <YAxis stroke="#475569" fontSize={11} />
              <Tooltip contentStyle={tooltipStyle} />
              <Bar dataKey="value" stackId="a" fill="#22d3ee" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </Card>

        {/* F: Priority distribution */}
        <Card>
          <h3 className="text-sm font-semibold text-white mb-4">F. Priority Distribution</h3>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie data={priorityData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} label>
                <Cell fill="#22c55e" />
                <Cell fill="#eab308" />
                <Cell fill="#f97316" />
                <Cell fill="#ef4444" />
              </Pie>
              <Tooltip contentStyle={tooltipStyle} />
              <Legend wrapperStyle={{ fontSize: '12px' }} />
            </PieChart>
          </ResponsiveContainer>
        </Card>

        {/* G: Seasonal trend */}
        <Card>
          <h3 className="text-sm font-semibold text-white mb-4">G. Seasonal Trend</h3>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={seasonalData} margin={{ left: -20 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
              <XAxis dataKey="name" stroke="#475569" fontSize={11} />
              <YAxis stroke="#475569" fontSize={11} />
              <Tooltip contentStyle={tooltipStyle} />
              <Bar dataKey="count" fill="#3b82f6" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </Card>

        {/* H: Road accessibility impact */}
        <Card>
          <h3 className="text-sm font-semibold text-white mb-4">H. Road Accessibility Impact</h3>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={roadImpactData} layout="vertical" margin={{ left: 40 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
              <XAxis type="number" stroke="#475569" fontSize={11} />
              <YAxis type="category" dataKey="name" stroke="#64748b" fontSize={10} width={120} tickLine={false} axisLine={false} />
              <Tooltip contentStyle={tooltipStyle} />
              <Bar dataKey="value" fill="#f97316" radius={[0, 4, 4, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </Card>
      </div>
    </div>
  );
}
