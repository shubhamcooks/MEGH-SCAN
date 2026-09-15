import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MapPin, Upload, CheckCircle, ArrowLeft, User, Mail, FileText, Calendar } from 'lucide-react';
import { MapContainer, TileLayer, Marker, Popup, useMapEvents } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { Card, PageHeader, Disclaimer } from '@/components/ui';
import { supabase } from '@/lib/supabase';
import { OBSERVATION_CATEGORIES, SEVERITIES } from '@/types';

const SHILLONG_CENTER: [number, number] = [25.5788, 91.8933];

const pinIcon = L.divIcon({
  className: '',
  html: '<div style="width:24px;height:24px;background:#22d3ee;border-radius:50% 50% 50% 0;transform:rotate(-45deg);border:2px solid #0c1a2c;box-shadow:0 2px 6px rgba(0,0,0,0.4)"></div>',
  iconSize: [24, 24],
  iconAnchor: [12, 24],
});

function MapClickHandler({ onPick }: { onPick: (lat: number, lng: number) => void }) {
  useMapEvents({
    click(e) {
      onPick(e.latlng.lat, e.latlng.lng);
    },
  });
  return null;
}

export function SubmitObservation() {
  const navigate = useNavigate();
  const [submitted, setSubmitted] = useState(false);
  const [refCode, setRefCode] = useState('');
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    submitted_by: '',
    email: '',
    category: '',
    description: '',
    severity: 'Moderate',
    observed_date: new Date().toISOString().split('T')[0],
    consent: false,
    latitude: 0,
    longitude: 0,
    location_name: '',
  });

  const handlePick = (lat: number, lng: number) => {
    setForm({ ...form, latitude: lat, longitude: lng });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.category || !form.consent) return;
    setSaving(true);
    const code = `OBS-${new Date().getFullYear()}-${String(Math.floor(Math.random() * 9000) + 1000)}`;
    setRefCode(code);
    await supabase.from('observations').insert({
      reference_code: code,
      submitted_by: form.submitted_by || 'Anonymous',
      email: form.email || null,
      category: form.category,
      description: form.description,
      latitude: form.latitude || null,
      longitude: form.longitude || null,
      location_name: form.location_name || null,
      severity: form.severity,
      observed_date: form.observed_date,
      verification_status: 'Unverified',
      consent_given: form.consent,
    });
    setSaving(false);
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div className="min-h-screen bg-navy-950 flex items-center justify-center p-6">
        <div className="max-w-md w-full">
          <Card className="text-center py-8">
            <div className="w-16 h-16 rounded-full bg-green-500/20 flex items-center justify-center mx-auto mb-4">
              <CheckCircle size={32} className="text-green-400" />
            </div>
            <h2 className="text-lg font-bold text-white mb-2">Observation Submitted</h2>
            <p className="text-sm text-slate-400 mb-4">
              Your reference ID is <span className="text-accent-400 font-mono font-semibold">{refCode}</span>
            </p>
            <p className="text-xs text-slate-500 mb-6">
              Your report has been received and will require verification before it appears as a confirmed risk.
              This process helps ensure data quality and prevents false reports.
            </p>
            <div className="space-y-2">
              <button onClick={() => navigate('/dashboard')} className="btn-primary w-full">Return to Dashboard</button>
              <button onClick={() => { setSubmitted(false); setForm({ ...form, description: '', category: '' }); }} className="btn-ghost w-full">
                Submit Another Report
              </button>
            </div>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-navy-950 p-4 lg:p-6">
      <div className="max-w-4xl mx-auto">
        <button onClick={() => navigate(-1)} className="btn-ghost flex items-center gap-1 mb-4">
          <ArrowLeft size={16} /> Back
        </button>

        <PageHeader title="Submit an Observation" subtitle="Help build a better picture of infrastructure issues in Meghalaya" />

        <form onSubmit={handleSubmit} className="grid lg:grid-cols-2 gap-4">
          {/* Form fields */}
          <div className="space-y-4">
            <Card>
              <h3 className="text-sm font-semibold text-white mb-3">Your Information</h3>
              <div className="space-y-3">
                <div>
                  <label className="text-xs text-slate-500 mb-1 block">Name (optional — leave blank for anonymous)</label>
                  <div className="relative">
                    <User size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
                    <input
                      type="text"
                      value={form.submitted_by}
                      onChange={(e) => setForm({ ...form, submitted_by: e.target.value })}
                      placeholder="Anonymous"
                      className="input-field pl-9"
                    />
                  </div>
                </div>
                <div>
                  <label className="text-xs text-slate-500 mb-1 block">Email (optional)</label>
                  <div className="relative">
                    <Mail size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
                    <input
                      type="email"
                      value={form.email}
                      onChange={(e) => setForm({ ...form, email: e.target.value })}
                      placeholder="your@email.com"
                      className="input-field pl-9"
                    />
                  </div>
                </div>
              </div>
            </Card>

            <Card>
              <h3 className="text-sm font-semibold text-white mb-3">Observation Details</h3>
              <div className="space-y-3">
                <div>
                  <label className="text-xs text-slate-500 mb-1 block">Problem Category *</label>
                  <select
                    value={form.category}
                    onChange={(e) => setForm({ ...form, category: e.target.value })}
                    required
                    className="input-field"
                  >
                    <option value="">Select category...</option>
                    {OBSERVATION_CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
                <div>
                  <label className="text-xs text-slate-500 mb-1 block">Description *</label>
                  <textarea
                    value={form.description}
                    onChange={(e) => setForm({ ...form, description: e.target.value })}
                    placeholder="Describe what you observed..."
                    rows={4}
                    required
                    className="input-field resize-none"
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs text-slate-500 mb-1 block">Date Observed</label>
                    <div className="relative">
                      <Calendar size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
                      <input
                        type="date"
                        value={form.observed_date}
                        onChange={(e) => setForm({ ...form, observed_date: e.target.value })}
                        className="input-field pl-9"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="text-xs text-slate-500 mb-1 block">Severity</label>
                    <select
                      value={form.severity}
                      onChange={(e) => setForm({ ...form, severity: e.target.value })}
                      className="input-field"
                    >
                      {SEVERITIES.map((s) => <option key={s} value={s}>{s}</option>)}
                    </select>
                  </div>
                </div>
                <div>
                  <label className="text-xs text-slate-500 mb-1 block">Location Name (optional)</label>
                  <div className="relative">
                    <MapPin size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
                    <input
                      type="text"
                      value={form.location_name}
                      onChange={(e) => setForm({ ...form, location_name: e.target.value })}
                      placeholder="e.g. Near Police Bazar, Shillong"
                      className="input-field pl-9"
                    />
                  </div>
                </div>
              </div>
            </Card>

            <Card>
              <h3 className="text-sm font-semibold text-white mb-3">Photo Upload (optional)</h3>
              <div className="border-2 border-dashed border-white/10 rounded-lg p-6 text-center">
                <Upload size={24} className="mx-auto text-slate-600 mb-2" />
                <p className="text-xs text-slate-500">Click or drag to upload evidence photo</p>
                <input type="file" accept="image/*" className="hidden" />
              </div>
            </Card>

            <div className="flex items-start gap-2">
              <input
                type="checkbox"
                checked={form.consent}
                onChange={(e) => setForm({ ...form, consent: e.target.checked })}
                required
                className="accent-cyan-500 mt-1"
              />
              <p className="text-xs text-slate-400">
                I consent to this observation being used for infrastructure analysis. I understand this is a citizen report and will require verification before being treated as confirmed data.
              </p>
            </div>

            <button type="submit" disabled={saving || !form.consent || !form.category} className="btn-primary w-full disabled:opacity-50">
              {saving ? 'Submitting...' : 'Submit Observation'}
            </button>
          </div>

          {/* Map picker */}
          <div className="space-y-4">
            <Card className="p-0 overflow-hidden">
              <div className="p-3 border-b border-white/5">
                <h3 className="text-sm font-semibold text-white flex items-center gap-2">
                  <MapPin size={14} className="text-accent-400" /> Pick Location on Map
                </h3>
                <p className="text-xs text-slate-500 mt-1">Click on the map to set the observation location</p>
              </div>
              <div className="h-96">
                <MapContainer
                  center={SHILLONG_CENTER}
                  zoom={13}
                  className="w-full h-full"
                >
                  <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" attribution='&copy; OSM' />
                  <MapClickHandler onPick={handlePick} />
                  {form.latitude !== 0 && form.longitude !== 0 && (
                    <Marker position={[form.latitude, form.longitude]} icon={pinIcon}>
                      <Popup>
                        <p className="text-sm text-white">Selected location</p>
                        <p className="text-xs text-slate-400">{form.latitude.toFixed(4)}, {form.longitude.toFixed(4)}</p>
                      </Popup>
                    </Marker>
                  )}
                </MapContainer>
              </div>
              {form.latitude !== 0 && (
                <div className="p-3 border-t border-white/5">
                  <p className="text-xs text-slate-400">
                    <FileText size={12} className="inline mr-1" />
                    Coordinates: {form.latitude.toFixed(4)}, {form.longitude.toFixed(4)}
                  </p>
                </div>
              )}
            </Card>

            <Disclaimer text="Your observation will be stored and reviewed. It will not automatically be treated as a confirmed risk. False or misleading reports may be rejected during verification." />
          </div>
        </form>
      </div>
    </div>
  );
}
