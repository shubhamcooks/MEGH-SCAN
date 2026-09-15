import { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { MapContainer, TileLayer, CircleMarker, Popup, LayersControl, ZoomControl, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { Layers, Maximize, Crosshair, Filter, X } from 'lucide-react';
import { Card, LoadingSpinner, RiskBadge, StatusBadge, PageHeader, DemoBadge } from '@/components/ui';
import { supabase } from '@/lib/supabase';
import type { Location, Incident, Observation } from '@/types';
import { formatDate } from '@/lib/utils';
import { RISK_COLORS } from '@/types';

const SHILLONG_CENTER: [number, number] = [25.5788, 91.8933];

const CATEGORY_COLORS: Record<string, string> = {
  Waterlogging: '#3b82f6',
  'Drainage Blockage': '#06b6d4',
  'Road Damage': '#f97316',
  Landslide: '#ef4444',
  'Landslide Exposure': '#ef4444',
  'Waste Accumulation': '#84cc16',
  'Water-Supply Disruption': '#8b5cf6',
  'Power Disruption': '#fbbf24',
  Flooding: '#2563eb',
  Erosion: '#a16207',
  Other: '#64748b',
};

function FullscreenControl() {
  const map = useMap();
  return (
    <button
      onClick={() => {
        const el = map.getContainer();
        if (!document.fullscreenElement) el.requestFullscreen?.();
        else document.exitFullscreen?.();
      }}
      className="leaflet-bar absolute right-2.5 top-20 z-[1000] bg-navy-600 border border-white/10 rounded-lg p-2 text-slate-300 hover:bg-navy-500 transition-colors"
      title="Toggle fullscreen"
    >
      <Maximize size={16} />
    </button>
  );
}

function LocateControl() {
  const map = useMap();
  return (
    <button
      onClick={() => map.flyTo(SHILLONG_CENTER, 13)}
      className="leaflet-bar absolute right-2.5 top-40 z-[1000] bg-navy-600 border border-white/10 rounded-lg p-2 text-slate-300 hover:bg-navy-500 transition-colors"
      title="Center on Shillong"
    >
      <Crosshair size={16} />
    </button>
  );
}

export function MapPage() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [locations, setLocations] = useState<Location[]>([]);
  const [incidents, setIncidents] = useState<Incident[]>([]);
  const [observations, setObservations] = useState<Observation[]>([]);
  const [selectedLayers, setSelectedLayers] = useState<Set<string>>(new Set(['locations', 'incidents', 'observations']));
  const [riskFilter, setRiskFilter] = useState<string>('all');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [showLegend, setShowLegend] = useState(true);
  const [detailPanel, setDetailPanel] = useState<Location | null>(null);
  const mapRef = useRef<L.Map | null>(null);

  useEffect(() => {
    async function fetchData() {
      const [{ data: locs }, { data: incs }, { data: obs }] = await Promise.all([
        supabase.from('locations').select('*'),
        supabase.from('incidents').select('*'),
        supabase.from('observations').select('*'),
      ]);
      setLocations(locs ?? []);
      setIncidents(incs ?? []);
      setObservations(obs ?? []);
      setLoading(false);
    }
    fetchData();
  }, []);

  const toggleLayer = (layer: string) => {
    setSelectedLayers((prev) => {
      const next = new Set(prev);
      if (next.has(layer)) next.delete(layer);
      else next.add(layer);
      return next;
    });
  };

  const filteredLocations = locations.filter((l) => {
    if (riskFilter !== 'all' && l.risk_level !== riskFilter) return false;
    if (categoryFilter !== 'all' && l.primary_problem !== categoryFilter) return false;
    return true;
  });

  if (loading) return <LoadingSpinner />;

  return (
    <div className="animate-fade-in h-[calc(100vh-7rem)] flex flex-col">
      <PageHeader title="Interactive GIS Map" subtitle="Shillong, Meghalaya — Multi-layer geospatial view">
        <DemoBadge />
      </PageHeader>

      <div className="flex-1 flex gap-4 min-h-0">
        {/* Map */}
        <div className="flex-1 relative rounded-xl overflow-hidden border border-white/5">
          <MapContainer
            center={SHILLONG_CENTER}
            zoom={13}
            className="w-full h-full"
            zoomControl={false}
            ref={(m) => { if (m) mapRef.current = m; }}
          >
            <LayersControl position="topright">
              <LayersControl.BaseLayer checked name="Street Map">
                <TileLayer
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  attribution='&copy; OpenStreetMap contributors'
                />
              </LayersControl.BaseLayer>
              <LayersControl.BaseLayer name="Satellite">
                <TileLayer
                  url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
                  attribution='&copy; Esri'
                />
              </LayersControl.BaseLayer>
              <LayersControl.BaseLayer name="Terrain">
                <TileLayer
                  url="https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png"
                  attribution='&copy; OpenTopoMap'
                />
              </LayersControl.BaseLayer>
            </LayersControl>

            <ZoomControl position="topleft" />

            {/* Location markers */}
            {selectedLayers.has('locations') &&
              filteredLocations.map((loc) => (
                <CircleMarker
                  key={loc.id}
                  center={[loc.latitude, loc.longitude]}
                  radius={Math.max(6, loc.priority_score / 10)}
                  pathOptions={{
                    color: RISK_COLORS[loc.risk_level as keyof typeof RISK_COLORS],
                    fillColor: RISK_COLORS[loc.risk_level as keyof typeof RISK_COLORS],
                    fillOpacity: 0.6,
                    weight: 2,
                  }}
                  eventHandlers={{ click: () => setDetailPanel(loc) }}
                >
                  <Popup>
                    <div className="min-w-[200px]">
                      <p className="font-semibold text-white text-sm">{loc.name}</p>
                      <p className="text-xs text-slate-400 mt-1">{loc.primary_problem}</p>
                      <div className="flex items-center gap-2 mt-2">
                        <RiskBadge level={loc.risk_level as 'Low' | 'Moderate' | 'High' | 'Critical'} />
                        <span className="text-xs text-slate-400">Score: {Math.round(loc.priority_score)}/100</span>
                      </div>
                      <p className="text-xs text-slate-500 mt-2">Recurrences: {loc.recurrence_count}</p>
                      <button
                        onClick={() => navigate(`/problem-memory/${loc.id}`)}
                        className="text-xs text-accent-400 hover:text-accent-300 mt-2"
                      >
                        View location profile →
                      </button>
                    </div>
                  </Popup>
                </CircleMarker>
              ))}

            {/* Incident markers */}
            {selectedLayers.has('incidents') &&
              incidents
                .filter((i) => i.latitude && i.longitude)
                .filter((i) => categoryFilter === 'all' || i.category === categoryFilter)
                .map((inc) => (
                  <CircleMarker
                    key={inc.id}
                    center={[inc.latitude!, inc.longitude!]}
                    radius={5}
                    pathOptions={{
                      color: CATEGORY_COLORS[inc.category] ?? '#64748b',
                      fillColor: CATEGORY_COLORS[inc.category] ?? '#64748b',
                      fillOpacity: 0.5,
                      weight: 1.5,
                    }}
                  >
                    <Popup>
                      <div className="min-w-[180px]">
                        <p className="font-semibold text-white text-sm">{inc.category}</p>
                        <p className="text-xs text-slate-400 mt-1">{inc.location_name ?? 'Unknown'}</p>
                        <p className="text-xs text-slate-500 mt-1">{formatDate(inc.reported_date)}</p>
                        <div className="mt-2">
                          <StatusBadge status={inc.status} />
                        </div>
                        <button
                          onClick={() => navigate(`/incidents/${inc.id}`)}
                          className="text-xs text-accent-400 hover:text-accent-300 mt-2"
                        >
                          View incident →
                        </button>
                      </div>
                    </Popup>
                  </CircleMarker>
                ))}

            {/* Observation markers */}
            {selectedLayers.has('observations') &&
              observations
                .filter((o) => o.latitude && o.longitude)
                .map((obs) => (
                  <CircleMarker
                    key={obs.id}
                    center={[obs.latitude!, obs.longitude!]}
                    radius={4}
                    pathOptions={{
                      color: obs.verification_status === 'Verified' ? '#22c55e' : '#94a3b8',
                      fillColor: obs.verification_status === 'Verified' ? '#22c55e' : '#94a3b8',
                      fillOpacity: 0.4,
                      weight: 1,
                    }}
                  >
                    <Popup>
                      <div className="min-w-[160px]">
                        <p className="font-semibold text-white text-sm">{obs.category}</p>
                        <p className="text-xs text-slate-400 mt-1">{obs.description?.slice(0, 80)}</p>
                        <p className="text-xs text-slate-500 mt-1">{obs.reference_code}</p>
                        <div className="mt-2">
                          <StatusBadge status={obs.verification_status} />
                        </div>
                      </div>
                    </Popup>
                  </CircleMarker>
                ))}

            <FullscreenControl />
            <LocateControl />
          </MapContainer>

          {/* Legend */}
          {showLegend && (
            <div className="absolute bottom-4 left-4 glass-card p-3 z-[500] max-w-xs">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-semibold text-white flex items-center gap-1">
                  <Layers size={12} /> Legend
                </span>
                <button onClick={() => setShowLegend(false)} className="text-slate-500 hover:text-white">
                  <X size={12} />
                </button>
              </div>
              <div className="space-y-1.5 text-xs">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-red-500" />
                  <span className="text-slate-400">Critical risk location</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-orange-500" />
                  <span className="text-slate-400">High risk location</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-yellow-500" />
                  <span className="text-slate-400">Moderate risk location</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-green-500" />
                  <span className="text-slate-400">Low risk location</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-blue-500" />
                  <span className="text-slate-400">Incident point</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full border border-green-500" />
                  <span className="text-slate-400">Verified observation</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full border border-slate-400" />
                  <span className="text-slate-400">Unverified observation</span>
                </div>
              </div>
            </div>
          )}

          {!showLegend && (
            <button
              onClick={() => setShowLegend(true)}
              className="absolute bottom-4 left-4 glass-card p-2 z-[500] text-slate-400 hover:text-white"
            >
              <Layers size={16} />
            </button>
          )}
        </div>

        {/* Side panel: Layer controls + Detail */}
        <div className="w-72 flex-shrink-0 space-y-3 overflow-y-auto">
          <Card>
            <h3 className="text-sm font-semibold text-white mb-3 flex items-center gap-2">
              <Filter size={14} /> Filters
            </h3>
            <div className="space-y-3">
              <div>
                <label className="text-xs text-slate-500 mb-1 block">Risk Level</label>
                <select
                  value={riskFilter}
                  onChange={(e) => setRiskFilter(e.target.value)}
                  className="input-field"
                >
                  <option value="all">All Risk Levels</option>
                  <option value="Critical">Critical</option>
                  <option value="High">High</option>
                  <option value="Moderate">Moderate</option>
                  <option value="Low">Low</option>
                </select>
              </div>
              <div>
                <label className="text-xs text-slate-500 mb-1 block">Category</label>
                <select
                  value={categoryFilter}
                  onChange={(e) => setCategoryFilter(e.target.value)}
                  className="input-field"
                >
                  <option value="all">All Categories</option>
                  {Object.keys(CATEGORY_COLORS).map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>
            </div>
          </Card>

          <Card>
            <h3 className="text-sm font-semibold text-white mb-3">Data Layers</h3>
            <div className="space-y-2">
              {[
                { key: 'locations', label: 'Risk Locations', count: filteredLocations.length },
                { key: 'incidents', label: 'Incident Points', count: incidents.length },
                { key: 'observations', label: 'Citizen Observations', count: observations.length },
              ].map((layer) => (
                <label key={layer.key} className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={selectedLayers.has(layer.key)}
                    onChange={() => toggleLayer(layer.key)}
                    className="accent-cyan-500"
                  />
                  <span className="text-sm text-slate-300 flex-1">{layer.label}</span>
                  <span className="text-xs text-slate-500">{layer.count}</span>
                </label>
              ))}
            </div>
          </Card>

          {detailPanel && (
            <Card>
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-semibold text-white">Location Detail</h3>
                <button onClick={() => setDetailPanel(null)} className="text-slate-500 hover:text-white">
                  <X size={14} />
                </button>
              </div>
              <div className="space-y-2">
                <p className="text-sm text-white font-medium">{detailPanel.name}</p>
                <p className="text-xs text-slate-400">{detailPanel.description}</p>
                <div className="flex items-center gap-2">
                  <RiskBadge level={detailPanel.risk_level as 'Low' | 'Moderate' | 'High' | 'Critical'} />
                  <span className="text-xs text-slate-400">Score: {Math.round(detailPanel.priority_score)}/100</span>
                </div>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div>
                    <p className="text-slate-500">Problem</p>
                    <p className="text-slate-300">{detailPanel.primary_problem}</p>
                  </div>
                  <div>
                    <p className="text-slate-500">Recurrences</p>
                    <p className="text-slate-300">{detailPanel.recurrence_count}</p>
                  </div>
                  <div>
                    <p className="text-slate-500">Last Incident</p>
                    <p className="text-slate-300">{formatDate(detailPanel.last_incident_date)}</p>
                  </div>
                  <div>
                    <p className="text-slate-500">Inspection</p>
                    <StatusBadge status={detailPanel.inspection_status} />
                  </div>
                </div>
                <button
                  onClick={() => navigate(`/problem-memory/${detailPanel.id}`)}
                  className="btn-primary w-full mt-2 text-center"
                >
                  View Full Profile
                </button>
              </div>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
