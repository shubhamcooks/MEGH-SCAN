import { useEffect, useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, ChevronLeft, ChevronRight, FileWarning } from 'lucide-react';
import { Card, StatusBadge, LoadingSpinner, PageHeader, DemoBadge } from '@/components/ui';
import { supabase } from '@/lib/supabase';
import type { Incident } from '@/types';
import { formatDate, downloadCsv } from '@/lib/utils';
import { INCIDENT_CATEGORIES, INCIDENT_STATUSES, SEVERITIES } from '@/types';

const PAGE_SIZE = 10;

export function IncidentsPage() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [incidents, setIncidents] = useState<Incident[]>([]);
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [severityFilter, setSeverityFilter] = useState('all');
  const [page, setPage] = useState(1);
  const [sortBy, setSortBy] = useState<'reported_date' | 'severity' | 'category'>('reported_date');
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('desc');

  useEffect(() => {
    async function fetchData() {
      const { data } = await supabase.from('incidents').select('*').order('reported_date', { ascending: false });
      setIncidents(data ?? []);
      setLoading(false);
    }
    fetchData();
  }, []);

  const filtered = useMemo(() => {
    let result = incidents;
    if (search) {
      const q = search.toLowerCase();
      result = result.filter((i) =>
        i.category.toLowerCase().includes(q) ||
        i.location_name?.toLowerCase().includes(q) ||
        i.incident_code?.toLowerCase().includes(q) ||
        i.description?.toLowerCase().includes(q)
      );
    }
    if (categoryFilter !== 'all') result = result.filter((i) => i.category === categoryFilter);
    if (statusFilter !== 'all') result = result.filter((i) => i.status === statusFilter);
    if (severityFilter !== 'all') result = result.filter((i) => i.severity === severityFilter);

    result = [...result].sort((a, b) => {
      let cmp = 0;
      if (sortBy === 'reported_date') cmp = new Date(a.reported_date).getTime() - new Date(b.reported_date).getTime();
      else if (sortBy === 'severity') {
        const order = { Critical: 4, High: 3, Moderate: 2, Low: 1 };
        cmp = (order[a.severity as keyof typeof order] ?? 0) - (order[b.severity as keyof typeof order] ?? 0);
      } else cmp = a.category.localeCompare(b.category);
      return sortDir === 'desc' ? -cmp : cmp;
    });
    return result;
  }, [incidents, search, categoryFilter, statusFilter, severityFilter, sortBy, sortDir]);

  const totalPages = Math.ceil(filtered.length / PAGE_SIZE);
  const pageData = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const handleExport = () => {
    downloadCsv('megh-scan-incidents.csv', [
      'ID', 'Code', 'Category', 'Location', 'Severity', 'Date', 'Source', 'Verification', 'Status', 'Department'
    ], filtered.map((i) => [
      i.id, i.incident_code, i.category, i.location_name, i.severity, i.reported_date, i.source, i.verification_status, i.status, i.assigned_department
    ]));
  };

  if (loading) return <LoadingSpinner />;

  return (
    <div className="animate-fade-in">
      <PageHeader title="Incident Management" subtitle={`${filtered.length} incidents`}>
        <button onClick={handleExport} className="btn-secondary">Export CSV</button>
        <DemoBadge />
      </PageHeader>

      {/* Filters */}
      <Card className="mb-4">
        <div className="grid md:grid-cols-2 lg:grid-cols-5 gap-3">
          <div className="relative">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
            <input
              type="text"
              placeholder="Search incidents..."
              value={search}
              onChange={(e) => { setSearch(e.target.value); setPage(1); }}
              className="input-field pl-9"
            />
          </div>
          <select value={categoryFilter} onChange={(e) => { setCategoryFilter(e.target.value); setPage(1); }} className="input-field">
            <option value="all">All Categories</option>
            {INCIDENT_CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
          </select>
          <select value={statusFilter} onChange={(e) => { setStatusFilter(e.target.value); setPage(1); }} className="input-field">
            <option value="all">All Statuses</option>
            {INCIDENT_STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
          </select>
          <select value={severityFilter} onChange={(e) => { setSeverityFilter(e.target.value); setPage(1); }} className="input-field">
            <option value="all">All Severities</option>
            {SEVERITIES.map((s) => <option key={s} value={s}>{s}</option>)}
          </select>
          <select
            value={`${sortBy}-${sortDir}`}
            onChange={(e) => {
              const [by, dir] = e.target.value.split('-');
              setSortBy(by as 'reported_date' | 'severity' | 'category');
              setSortDir(dir as 'asc' | 'desc');
            }}
            className="input-field"
          >
            <option value="reported_date-desc">Date (newest)</option>
            <option value="reported_date-asc">Date (oldest)</option>
            <option value="severity-desc">Severity (highest)</option>
            <option value="category-asc">Category (A-Z)</option>
          </select>
        </div>
      </Card>

      {/* Table */}
      <Card className="p-0 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-white/5 text-xs text-slate-500 uppercase tracking-wider">
                <th className="px-4 py-3 text-left font-medium">Code</th>
                <th className="px-4 py-3 text-left font-medium">Location</th>
                <th className="px-4 py-3 text-left font-medium">Category</th>
                <th className="px-4 py-3 text-left font-medium">Severity</th>
                <th className="px-4 py-3 text-left font-medium">Date</th>
                <th className="px-4 py-3 text-left font-medium">Source</th>
                <th className="px-4 py-3 text-left font-medium">Status</th>
                <th className="px-4 py-3 text-left font-medium">Action</th>
              </tr>
            </thead>
            <tbody>
              {pageData.map((inc) => (
                <tr
                  key={inc.id}
                  onClick={() => navigate(`/incidents/${inc.id}`)}
                  className="border-b border-white/5 hover:bg-white/5 cursor-pointer transition-colors"
                >
                  <td className="px-4 py-3 text-slate-400 font-mono text-xs">{inc.incident_code}</td>
                  <td className="px-4 py-3 text-slate-300">{inc.location_name ?? 'N/A'}</td>
                  <td className="px-4 py-3 text-slate-300">{inc.category}</td>
                  <td className="px-4 py-3">
                    <span className={`badge ${
                      inc.severity === 'Critical' ? 'bg-red-500/15 text-red-400 border-red-500/30' :
                      inc.severity === 'High' ? 'bg-orange-500/15 text-orange-400 border-orange-500/30' :
                      inc.severity === 'Moderate' ? 'bg-yellow-500/15 text-yellow-400 border-yellow-500/30' :
                      'bg-green-500/15 text-green-400 border-green-500/30'
                    }`}>{inc.severity}</span>
                  </td>
                  <td className="px-4 py-3 text-slate-400 text-xs">{formatDate(inc.reported_date)}</td>
                  <td className="px-4 py-3 text-slate-400 text-xs">{inc.source}</td>
                  <td className="px-4 py-3"><StatusBadge status={inc.status} /></td>
                  <td className="px-4 py-3">
                    <span className="text-xs text-accent-400 hover:text-accent-300">View →</span>
                  </td>
                </tr>
              ))}
              {pageData.length === 0 && (
                <tr>
                  <td colSpan={8} className="px-4 py-12 text-center text-slate-500">
                    <FileWarning size={20} className="mx-auto mb-2 opacity-50" />
                    No incidents found matching filters
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between px-4 py-3 border-t border-white/5">
            <p className="text-xs text-slate-500">
              Page {page} of {totalPages} — {filtered.length} total
            </p>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setPage(Math.max(1, page - 1))}
                disabled={page === 1}
                className="btn-ghost disabled:opacity-30 flex items-center gap-1"
              >
                <ChevronLeft size={14} /> Prev
              </button>
              <button
                onClick={() => setPage(Math.min(totalPages, page + 1))}
                disabled={page === totalPages}
                className="btn-ghost disabled:opacity-30 flex items-center gap-1"
              >
                Next <ChevronRight size={14} />
              </button>
            </div>
          </div>
        )}
      </Card>
    </div>
  );
}
