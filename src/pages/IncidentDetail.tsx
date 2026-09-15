import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { MapContainer, TileLayer, CircleMarker, Popup, ZoomControl } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { ArrowLeft, MapPin, Calendar, User, FileText, Tag, Building, MessageSquare } from 'lucide-react';
import { Card, StatusBadge, LoadingSpinner, Disclaimer } from '@/components/ui';
import { supabase } from '@/lib/supabase';
import type { Incident, Location, Incident as IncType } from '@/types';
import { INCIDENT_STATUSES } from '@/types';
import { formatDate } from '@/lib/utils';

export function IncidentDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [incident, setIncident] = useState<Incident | null>(null);
  const [location, setLocation] = useState<Location | null>(null);
  const [related, setRelated] = useState<IncType[]>([]);
  const [newStatus, setNewStatus] = useState('');
  const [newNote, setNewNote] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    async function fetchData() {
      if (!id) return;
      const { data: inc } = await supabase.from('incidents').select('*').eq('id', id).maybeSingle();
      if (!inc) { setLoading(false); return; }
      setIncident(inc as Incident);
      setNewStatus((inc as Incident).status);
      if ((inc as Incident).location_id) {
        const { data: loc } = await supabase.from('locations').select('*').eq('id', (inc as Incident).location_id!).maybeSingle();
        setLocation(loc as Location | null);
        const { data: rel } = await supabase.from('incidents').select('*').eq('location_id', (inc as Incident).location_id).neq('id', id).order('reported_date', { ascending: false }).limit(5);
        setRelated(rel ?? []);
      }
      setLoading(false);
    }
    fetchData();
  }, [id]);

  const handleUpdate = async () => {
    if (!incident || !id) return;
    setSaving(true);
    const updates: Record<string, string> = { status: newStatus };
    if (newNote.trim()) {
      updates.notes = newNote;
    }
    await supabase.from('incidents').update({ ...updates, updated_at: new Date().toISOString() }).eq('id', id);
    setIncident({ ...incident, ...updates });
    setNewNote('');
    setSaving(false);
  };

  if (loading) return <LoadingSpinner />;

  if (!incident) {
    return (
      <div className="text-center py-12">
        <p className="text-slate-500">Incident not found.</p>
        <button onClick={() => navigate('/incidents')} className="btn-primary mt-4">Back to Incidents</button>
      </div>
    );
  }

  return (
    <div className="animate-fade-in">
      <button onClick={() => navigate('/incidents')} className="btn-ghost flex items-center gap-1 mb-4">
        <ArrowLeft size={16} /> Back to Incidents
      </button>

      <div className="grid lg:grid-cols-3 gap-4">
        {/* Main detail */}
        <div className="lg:col-span-2 space-y-4">
          <Card>
            <div className="flex items-start justify-between mb-4">
              <div>
                <h1 className="text-lg font-bold text-white">{incident.category}</h1>
                <p className="text-xs text-slate-500 font-mono mt-1">{incident.incident_code}</p>
              </div>
              <div className="flex gap-2">
                <StatusBadge status={incident.status} />
                <span className={`badge ${
                  incident.severity === 'Critical' ? 'bg-red-500/15 text-red-400 border-red-500/30' :
                  incident.severity === 'High' ? 'bg-orange-500/15 text-orange-400 border-orange-500/30' :
                  incident.severity === 'Moderate' ? 'bg-yellow-500/15 text-yellow-400 border-yellow-500/30' :
                  'bg-green-500/15 text-green-400 border-green-500/30'
                }`}>{incident.severity}</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 text-sm">
              <div className="flex items-center gap-2 text-slate-400">
                <MapPin size={14} className="text-slate-500" /> {incident.location_name ?? 'Unknown'}
              </div>
              <div className="flex items-center gap-2 text-slate-400">
                <Calendar size={14} className="text-slate-500" /> {formatDate(incident.reported_date)}
              </div>
              <div className="flex items-center gap-2 text-slate-400">
                <Tag size={14} className="text-slate-500" /> {incident.source}
              </div>
              <div className="flex items-center gap-2 text-slate-400">
                <Building size={14} className="text-slate-500" /> {incident.assigned_department ?? 'Unassigned'}
              </div>
              <div className="flex items-center gap-2 text-slate-400">
                <User size={14} className="text-slate-500" /> {incident.verification_status}
              </div>
            </div>

            {incident.description && (
              <div className="mt-4 pt-4 border-t border-white/5">
                <p className="text-xs text-slate-500 mb-1 flex items-center gap-1"><FileText size={12} /> Description</p>
                <p className="text-sm text-slate-300">{incident.description}</p>
              </div>
            )}

            {incident.notes && (
              <div className="mt-4 pt-4 border-t border-white/5">
                <p className="text-xs text-slate-500 mb-1 flex items-center gap-1"><MessageSquare size={12} /> Notes</p>
                <p className="text-sm text-slate-300">{incident.notes}</p>
              </div>
            )}
          </Card>

          {/* Admin controls */}
          <Card>
            <h3 className="text-sm font-semibold text-white mb-3">Update Incident</h3>
            <div className="space-y-3">
              <div>
                <label className="text-xs text-slate-500 mb-1 block">Status</label>
                <select value={newStatus} onChange={(e) => setNewStatus(e.target.value)} className="input-field">
                  {INCIDENT_STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>
              <div>
                <label className="text-xs text-slate-500 mb-1 block">Add Note</label>
                <textarea
                  value={newNote}
                  onChange={(e) => setNewNote(e.target.value)}
                  placeholder="Add administrative note..."
                  rows={3}
                  className="input-field resize-none"
                />
              </div>
              <button onClick={handleUpdate} disabled={saving} className="btn-primary disabled:opacity-50">
                {saving ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </Card>

          {/* Related incidents */}
          {related.length > 0 && (
            <Card>
              <h3 className="text-sm font-semibold text-white mb-3">Related Incidents at This Location</h3>
              <div className="space-y-2">
                {related.map((rel) => (
                  <button
                    key={rel.id}
                    onClick={() => navigate(`/incidents/${rel.id}`)}
                    className="w-full flex items-center gap-3 p-2.5 rounded-lg bg-white/5 hover:bg-white/10 transition-colors text-left"
                  >
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-white truncate">{rel.category} — {rel.incident_code}</p>
                      <p className="text-xs text-slate-500">{formatDate(rel.reported_date)}</p>
                    </div>
                    <StatusBadge status={rel.status} />
                  </button>
                ))}
              </div>
            </Card>
          )}
        </div>

        {/* Side: Map + Location link */}
        <div className="space-y-4">
          {incident.latitude && incident.longitude && (
            <Card className="p-0 overflow-hidden">
              <div className="h-64">
                <MapContainer
                  center={[incident.latitude, incident.longitude]}
                  zoom={15}
                  className="w-full h-full"
                  zoomControl={false}
                >
                  <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" attribution='&copy; OSM' />
                  <ZoomControl position="topright" />
                  <CircleMarker
                    center={[incident.latitude, incident.longitude]}
                    radius={10}
                    pathOptions={{ color: '#22d3ee', fillColor: '#22d3ee', fillOpacity: 0.5, weight: 2 }}
                  >
                    <Popup>
                      <p className="font-semibold text-white text-sm">{incident.category}</p>
                      <p className="text-xs text-slate-400">{incident.location_name}</p>
                    </Popup>
                  </CircleMarker>
                </MapContainer>
              </div>
            </Card>
          )}

          {location && (
            <Card>
              <h3 className="text-sm font-semibold text-white mb-2">Linked Location</h3>
              <p className="text-sm text-slate-300">{location.name}</p>
              <p className="text-xs text-slate-500 mt-1">{location.primary_problem} · Score: {Math.round(location.priority_score)}/100</p>
              <button
                onClick={() => navigate(`/problem-memory/${location.id}`)}
                className="btn-secondary w-full mt-3"
              >
                View Problem Memory
              </button>
            </Card>
          )}

          <Disclaimer />
        </div>
      </div>
    </div>
  );
}
