import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { History, MapPin, Calendar, Wrench, CheckCircle, AlertCircle, ArrowRight } from 'lucide-react';
import { MapContainer, TileLayer, CircleMarker, Popup, ZoomControl } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { Card, RiskBadge, StatusBadge, LoadingSpinner, PageHeader, DemoBadge, Disclaimer } from '@/components/ui';
import { supabase } from '@/lib/supabase';
import type { Location, TimelineEvent, Incident, RiskScore } from '@/types';
import { RISK_COLORS } from '@/types';
import { formatDate } from '@/lib/utils';

export function ProblemMemory() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [location, setLocation] = useState<Location | null>(null);
  const [timeline, setTimeline] = useState<TimelineEvent[]>([]);
  const [incidents, setIncidents] = useState<Incident[]>([]);
  const [riskScore, setRiskScore] = useState<RiskScore | null>(null);
  const [allLocations, setAllLocations] = useState<Location[]>([]);

  useEffect(() => {
    async function fetchData() {
      if (!id) {
        // No ID — show location selector
        const { data: locs } = await supabase.from('locations').select('*').order('priority_score', { ascending: false });
        setAllLocations(locs ?? []);
        setLoading(false);
        return;
      }
      const [{ data: loc }, { data: tl }, { data: incs }, { data: rs }] = await Promise.all([
        supabase.from('locations').select('*').eq('id', id).maybeSingle(),
        supabase.from('location_timeline').select('*').eq('location_id', id).order('event_date', { ascending: false }),
        supabase.from('incidents').select('*').eq('location_id', id).order('reported_date', { ascending: false }),
        supabase.from('risk_scores').select('*').eq('location_id', id).order('calculated_at', { ascending: false }).limit(1).maybeSingle(),
      ]);
      setLocation(loc as Location | null);
      setTimeline(tl ?? []);
      setIncidents(incs ?? []);
      setRiskScore(rs as RiskScore | null);
      setLoading(false);
    }
    fetchData();
  }, [id]);

  if (loading) return <LoadingSpinner />;

  // Location selector view
  if (!id) {
    return (
      <div className="animate-fade-in">
        <PageHeader title="Problem Memory" subtitle="Select a location to view its complete problem history">
          <DemoBadge />
        </PageHeader>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-3">
          {allLocations.map((loc) => (
            <button
              key={loc.id}
              onClick={() => navigate(`/problem-memory/${loc.id}`)}
              className="glass-card p-4 text-left hover:border-accent-500/20 transition-colors"
            >
              <div className="flex items-start justify-between mb-2">
                <div>
                  <p className="text-sm font-semibold text-white">{loc.name}</p>
                  <p className="text-xs text-slate-500">{loc.primary_problem}</p>
                </div>
                <RiskBadge level={loc.risk_level as 'Low' | 'Moderate' | 'High' | 'Critical'} />
              </div>
              <div className="flex items-center gap-4 text-xs text-slate-500 mt-3">
                <span>{loc.recurrence_count} recurrences</span>
                <span>Score: {Math.round(loc.priority_score)}/100</span>
              </div>
            </button>
          ))}
        </div>
      </div>
    );
  }

  if (!location) {
    return (
      <div className="animate-fade-in">
        <PageHeader title="Problem Memory" />
        <Card>
          <p className="text-slate-500 text-center py-8">Location not found.</p>
        </Card>
      </div>
    );
  }

  return (
    <div className="animate-fade-in">
      <PageHeader title="Problem Memory" subtitle={`Complete historical record — ${location.name}`}>
        <DemoBadge />
      </PageHeader>

      <div className="grid lg:grid-cols-3 gap-4 mb-4">
        {/* Location summary */}
        <Card>
          <div className="flex items-start justify-between mb-3">
            <div>
              <h2 className="text-base font-bold text-white">{location.name}</h2>
              <p className="text-xs text-slate-500 flex items-center gap-1 mt-1">
                <MapPin size={12} /> {location.district}
              </p>
            </div>
            <RiskBadge level={location.risk_level as 'Low' | 'Moderate' | 'High' | 'Critical'} />
          </div>
          <p className="text-xs text-slate-400 mb-4">{location.description}</p>
          <div className="grid grid-cols-2 gap-3 text-sm">
            <div>
              <p className="text-xs text-slate-500">Primary Problem</p>
              <p className="text-slate-300">{location.primary_problem}</p>
            </div>
            <div>
              <p className="text-xs text-slate-500">Priority Score</p>
              <p className="text-slate-300">{Math.round(location.priority_score)}/100</p>
            </div>
            <div>
              <p className="text-xs text-slate-500">First Recorded</p>
              <p className="text-slate-300">{formatDate(location.first_recorded)}</p>
            </div>
            <div>
              <p className="text-xs text-slate-500">Last Incident</p>
              <p className="text-slate-300">{formatDate(location.last_incident_date)}</p>
            </div>
            <div>
              <p className="text-xs text-slate-500">Recurrence Count</p>
              <p className="text-slate-300">{location.recurrence_count}</p>
            </div>
            <div>
              <p className="text-xs text-slate-500">Inspection</p>
              <StatusBadge status={location.inspection_status} />
            </div>
          </div>
        </Card>

        {/* Mini map */}
        <Card className="p-0 overflow-hidden">
          <div className="h-full min-h-[200px]">
            <MapContainer
              center={[location.latitude, location.longitude]}
              zoom={15}
              className="w-full h-full min-h-[200px]"
              zoomControl={false}
            >
              <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" attribution='&copy; OSM' />
              <ZoomControl position="topright" />
              <CircleMarker
                center={[location.latitude, location.longitude]}
                radius={12}
                pathOptions={{
                  color: RISK_COLORS[location.risk_level as keyof typeof RISK_COLORS],
                  fillColor: RISK_COLORS[location.risk_level as keyof typeof RISK_COLORS],
                  fillOpacity: 0.5,
                  weight: 2,
                }}
              >
                <Popup>
                  <p className="font-semibold text-white text-sm">{location.name}</p>
                  <p className="text-xs text-slate-400">{location.primary_problem}</p>
                </Popup>
              </CircleMarker>
            </MapContainer>
          </div>
        </Card>

        {/* Recurrence explanation */}
        <Card>
          <h3 className="text-sm font-semibold text-white mb-3 flex items-center gap-2">
            <AlertCircle size={16} className="text-amber-400" />
            Why This Location Is Flagged
          </h3>
          <ul className="space-y-2 text-xs text-slate-400">
            <li className="flex items-start gap-2">
              <span className="text-accent-400 mt-0.5">•</span>
              <span>{location.recurrence_count} incidents recorded over {location.first_recorded ? new Date(location.first_recorded).getFullYear() : 'N/A'}–{location.last_incident_date ? new Date(location.last_incident_date).getFullYear() : 'N/A'}</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-accent-400 mt-0.5">•</span>
              <span>Similar issue repeated across different periods</span>
            </li>
            {location.primary_problem.toLowerCase().includes('water') || location.primary_problem.toLowerCase().includes('drain')
              ? <li className="flex items-start gap-2"><span className="text-accent-400 mt-0.5">•</span><span>Nearby drainage or low-lying terrain indicator</span></li>
              : null}
            <li className="flex items-start gap-2">
              <span className="text-accent-400 mt-0.5">•</span>
              <span>Recent rainfall-related reports in the area</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-accent-400 mt-0.5">•</span>
              <span>Previous intervention did not permanently resolve the issue</span>
            </li>
          </ul>
          <div className="mt-4 pt-3 border-t border-white/5">
            <Disclaimer text="These are possible contributing factors based on available data. Requires field verification. Indicators, not confirmed causation." />
          </div>
        </Card>
      </div>

      {/* Timeline */}
      <Card>
        <h3 className="text-sm font-semibold text-white mb-1 flex items-center gap-2">
          <History size={16} className="text-accent-400" />
          Demonstration Timeline
        </h3>
        <p className="text-xs text-slate-500 mb-6">Historical record of events at this location — demo data for prototype demonstration</p>

        <div className="relative">
          <div className="absolute left-4 top-0 bottom-0 w-px bg-white/10" />
          <div className="space-y-4">
            {timeline.map((event, i) => (
              <div key={event.id} className="relative pl-12 animate-slide-up" style={{ animationDelay: `${i * 50}ms` }}>
                <div className={`absolute left-2.5 top-1 w-3 h-3 rounded-full border-2 border-navy-900 ${
                  event.status === 'Resolved' ? 'bg-green-500' :
                  event.status === 'Reopened' ? 'bg-red-500' :
                  event.status === 'In Progress' ? 'bg-orange-500' :
                  event.status === 'Recorded' ? 'bg-accent-500' :
                  'bg-slate-500'
                }`} />
                <div className="glass-card p-3">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-xs text-slate-500 flex items-center gap-1">
                          <Calendar size={10} /> {formatDate(event.event_date)}
                        </span>
                        <span className="badge bg-white/5 text-slate-400 border-white/10">{event.event_type}</span>
                        {event.category && <span className="badge bg-white/5 text-slate-400 border-white/10">{event.category}</span>}
                        {event.severity && <span className={`badge ${
                          event.severity === 'Critical' ? 'bg-red-500/15 text-red-400 border-red-500/30' :
                          event.severity === 'High' ? 'bg-orange-500/15 text-orange-400 border-orange-500/30' :
                          event.severity === 'Moderate' ? 'bg-yellow-500/15 text-yellow-400 border-yellow-500/30' :
                          'bg-green-500/15 text-green-400 border-green-500/30'
                        }`}>{event.severity}</span>
                        }
                      </div>
                      <p className="text-sm text-slate-300 mt-2">{event.description}</p>
                      {event.intervention && (
                        <p className="text-xs text-slate-400 mt-2 flex items-center gap-1">
                          <Wrench size={10} /> Intervention: {event.intervention}
                        </p>
                      )}
                      {event.result && (
                        <p className="text-xs text-slate-400 mt-1 flex items-center gap-1">
                          <CheckCircle size={10} /> Result: {event.result}
                        </p>
                      )}
                    </div>
                    <StatusBadge status={event.status} />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </Card>

      {/* Related incidents */}
      {incidents.length > 0 && (
        <Card className="mt-4">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-semibold text-white">Related Incidents ({incidents.length})</h3>
            <button onClick={() => navigate('/incidents')} className="text-xs text-accent-400 hover:text-accent-300 flex items-center gap-1">
              View all <ArrowRight size={12} />
            </button>
          </div>
          <div className="space-y-2">
            {incidents.map((inc) => (
              <button
                key={inc.id}
                onClick={() => navigate(`/incidents/${inc.id}`)}
                className="w-full flex items-center gap-3 p-2.5 rounded-lg bg-white/5 hover:bg-white/10 transition-colors text-left"
              >
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-white truncate">{inc.category} — {inc.incident_code}</p>
                  <p className="text-xs text-slate-500">{formatDate(inc.reported_date)} · {inc.source}</p>
                </div>
                <StatusBadge status={inc.status} />
              </button>
            ))}
          </div>
        </Card>
      )}

      {riskScore && (
        <Card className="mt-4">
          <h3 className="text-sm font-semibold text-white mb-3">Risk Score Breakdown</h3>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3 text-sm">
            <div className="p-2 rounded-lg bg-white/5">
              <p className="text-xs text-slate-500">Recurrence</p>
              <p className="text-slate-300">{riskScore.recurrence_score}/30</p>
            </div>
            <div className="p-2 rounded-lg bg-white/5">
              <p className="text-xs text-slate-500">Severity</p>
              <p className="text-slate-300">{riskScore.severity_score}/20</p>
            </div>
            <div className="p-2 rounded-lg bg-white/5">
              <p className="text-xs text-slate-500">Recent Activity</p>
              <p className="text-slate-300">{riskScore.recent_activity_score}/15</p>
            </div>
            <div className="p-2 rounded-lg bg-white/5">
              <p className="text-xs text-slate-500">Exposure</p>
              <p className="text-slate-300">{riskScore.exposure_score}/15</p>
            </div>
            <div className="p-2 rounded-lg bg-white/5">
              <p className="text-xs text-slate-500">Environmental</p>
              <p className="text-slate-300">{riskScore.environmental_score}/10</p>
            </div>
            <div className="p-2 rounded-lg bg-white/5">
              <p className="text-xs text-slate-500">Accessibility</p>
              <p className="text-slate-300">{riskScore.accessibility_score}/10</p>
            </div>
          </div>
        </Card>
      )}
    </div>
  );
}
