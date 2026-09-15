import { useEffect, useState, useRef } from 'react';
import { Database, Upload, Trash2, FileSpreadsheet, CheckCircle, AlertCircle, Clock } from 'lucide-react';
import { Card, LoadingSpinner, PageHeader, DemoBadge, StatusBadge } from '@/components/ui';
import { supabase } from '@/lib/supabase';
import type { Dataset } from '@/types';
import { formatDate } from '@/lib/utils';

const DATASET_TYPES = [
  'Incident Records', 'Road Network', 'Drainage Points', 'Rainfall Records',
  'Elevation/Slope', 'Waste Hotspot Observations', 'Infrastructure Locations', 'Citizen Observations',
];

export function DatasetsPage() {
  const [loading, setLoading] = useState(true);
  const [datasets, setDatasets] = useState<Dataset[]>([]);
  const [showUpload, setShowUpload] = useState(false);
  const [uploadForm, setUploadForm] = useState({ name: '', type: 'Incident Records', source: '' });
  const [csvPreview, setCsvPreview] = useState<string[][] | null>(null);
  const [csvErrors, setCsvErrors] = useState<string[]>([]);
  const [csvFileName, setCsvFileName] = useState('');
  const fileRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    async function fetchData() {
      const { data } = await supabase.from('datasets').select('*').order('created_at', { ascending: false });
      setDatasets(data ?? []);
      setLoading(false);
    }
    fetchData();
  }, []);

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setCsvFileName(file.name);
    const reader = new FileReader();
    reader.onload = (ev) => {
      const text = ev.target?.result as string;
      const lines = text.split('\n').filter((l) => l.trim());
      const rows = lines.slice(0, 6).map((l) => l.split(','));
      setCsvPreview(rows);
      // Validate
      const errors: string[] = [];
      if (rows.length === 0) errors.push('File is empty');
      if (rows.length < 2) errors.push('File has no data rows (header only)');
      if (rows[0] && rows[0].length < 3) errors.push('CSV should have at least 3 columns');
      setCsvErrors(errors);
    };
    reader.readAsText(file);
  };

  const handleImport = async () => {
    if (!uploadForm.name) return;
    const { data } = await supabase.from('datasets').insert({
      name: uploadForm.name,
      type: uploadForm.type,
      source: uploadForm.source || 'Manual Upload',
      uploaded_by: 'Demo Admin',
      record_count: csvPreview ? csvPreview.length - 1 : 0,
      data_freshness: 'Current',
      is_demo: false,
    }).select().single();
    if (data) {
      setDatasets([data as Dataset, ...datasets]);
      setShowUpload(false);
      setUploadForm({ name: '', type: 'Incident Records', source: '' });
      setCsvPreview(null);
      setCsvErrors([]);
      setCsvFileName('');
    }
  };

  const handleDelete = async (id: string) => {
    await supabase.from('datasets').delete().eq('id', id);
    setDatasets(datasets.filter((d) => d.id !== id));
  };

  if (loading) return <LoadingSpinner />;

  return (
    <div className="animate-fade-in">
      <PageHeader title="Data Management" subtitle="Upload, validate and manage geospatial datasets">
        <button onClick={() => setShowUpload(!showUpload)} className="btn-primary flex items-center gap-2">
          <Upload size={14} /> Upload Dataset
        </button>
        <DemoBadge />
      </PageHeader>

      {showUpload && (
        <Card className="mb-4">
          <h3 className="text-sm font-semibold text-white mb-3">Upload CSV Dataset</h3>
          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-3">
              <div>
                <label className="text-xs text-slate-500 mb-1 block">Dataset Name *</label>
                <input
                  type="text"
                  value={uploadForm.name}
                  onChange={(e) => setUploadForm({ ...uploadForm, name: e.target.value })}
                  placeholder="e.g. Shillong Drainage Survey 2025"
                  className="input-field"
                />
              </div>
              <div>
                <label className="text-xs text-slate-500 mb-1 block">Dataset Type</label>
                <select
                  value={uploadForm.type}
                  onChange={(e) => setUploadForm({ ...uploadForm, type: e.target.value })}
                  className="input-field"
                >
                  {DATASET_TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
                </select>
              </div>
              <div>
                <label className="text-xs text-slate-500 mb-1 block">Source</label>
                <input
                  type="text"
                  value={uploadForm.source}
                  onChange={(e) => setUploadForm({ ...uploadForm, source: e.target.value })}
                  placeholder="e.g. Field Survey, IMD, OpenStreetMap"
                  className="input-field"
                />
              </div>
              <div>
                <label className="text-xs text-slate-500 mb-1 block">CSV File</label>
                <div
                  onClick={() => fileRef.current?.click()}
                  className="border-2 border-dashed border-white/10 rounded-lg p-6 text-center cursor-pointer hover:border-accent-500/30 transition-colors"
                >
                  <FileSpreadsheet size={24} className="mx-auto text-slate-600 mb-2" />
                  <p className="text-xs text-slate-500">{csvFileName || 'Click to select CSV file'}</p>
                  <input ref={fileRef} type="file" accept=".csv" className="hidden" onChange={handleFile} />
                </div>
              </div>
            </div>

            {/* Preview */}
            <div>
              <label className="text-xs text-slate-500 mb-1 block">Preview & Validation</label>
              {csvPreview ? (
                <div className="space-y-2">
                  <div className="overflow-x-auto rounded-lg border border-white/5">
                    <table className="w-full text-xs">
                      <thead>
                        <tr className="bg-white/5">
                          {csvPreview[0].map((h, i) => (
                            <th key={i} className="px-2 py-1.5 text-left text-slate-400 font-medium">{h}</th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {csvPreview.slice(1).map((row, i) => (
                          <tr key={i} className="border-t border-white/5">
                            {row.map((cell, j) => (
                              <td key={j} className="px-2 py-1.5 text-slate-300">{cell}</td>
                            ))}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  {csvErrors.length > 0 ? (
                    <div className="space-y-1">
                      {csvErrors.map((err, i) => (
                        <p key={i} className="text-xs text-red-400 flex items-center gap-1">
                          <AlertCircle size={12} /> {err}
                        </p>
                      ))}
                    </div>
                  ) : (
                    <p className="text-xs text-green-400 flex items-center gap-1">
                      <CheckCircle size={12} /> Validation passed — {csvPreview.length - 1} data rows detected
                    </p>
                  )}
                  <button onClick={handleImport} disabled={!uploadForm.name} className="btn-primary w-full disabled:opacity-50">
                    Import Dataset
                  </button>
                </div>
              ) : (
                <div className="border border-white/5 rounded-lg p-6 text-center">
                  <Database size={20} className="mx-auto text-slate-700 mb-2" />
                  <p className="text-xs text-slate-600">Upload a CSV to see preview</p>
                  <div className="mt-3 text-left">
                    <p className="text-xs text-slate-500 mb-1">Expected columns by type:</p>
                    <ul className="text-xs text-slate-600 space-y-0.5">
                      <li>Incidents: id, location_name, latitude, longitude, category, severity, reported_date, status, source</li>
                      <li>Locations: id, name, district, latitude, longitude, primary_problem, recurrence_count, priority_score</li>
                      <li>Rainfall: date, location_name, rainfall_mm, source</li>
                    </ul>
                  </div>
                </div>
              )}
            </div>
          </div>
        </Card>
      )}

      {/* Dataset list */}
      <div className="space-y-3">
        {datasets.map((ds) => (
          <Card key={ds.id}>
            <div className="flex items-start justify-between">
              <div className="flex items-start gap-3 flex-1">
                <div className="p-2.5 rounded-lg bg-accent-500/10 text-accent-400">
                  <Database size={20} />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <h3 className="text-sm font-semibold text-white">{ds.name}</h3>
                    {ds.is_demo && <DemoBadge />}
                  </div>
                  <p className="text-xs text-slate-500 mt-1">
                    {ds.type} · {ds.source ?? 'Unknown source'} · {ds.record_count} records
                  </p>
                  <div className="flex items-center gap-3 mt-2">
                    <span className="text-xs text-slate-500 flex items-center gap-1">
                      <Clock size={10} /> {formatDate(ds.created_at)}
                    </span>
                    <StatusBadge status={ds.data_freshness === 'Current' ? 'Verified' : 'Pending'} />
                  </div>
                </div>
              </div>
              <button
                onClick={() => handleDelete(ds.id)}
                className="p-2 rounded-lg text-slate-500 hover:text-red-400 hover:bg-red-500/10 transition-colors"
              >
                <Trash2 size={16} />
              </button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
