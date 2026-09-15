import { useState } from 'react';
import { Card, PageHeader, DemoBadge, Disclaimer } from '@/components/ui';
import { Sliders, User, Map, Bell, Shield } from 'lucide-react';

export function SettingsPage() {
  const [weights, setWeights] = useState({
    recurrence: 30,
    severity: 20,
    recentActivity: 15,
    exposure: 15,
    environmental: 10,
    accessibility: 10,
  });
  const [region, setRegion] = useState('Shillong, Meghalaya');
  const [saved, setSaved] = useState(false);

  const total = weights.recurrence + weights.severity + weights.recentActivity + weights.exposure + weights.environmental + weights.accessibility;

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="animate-fade-in">
      <PageHeader title="Settings" subtitle="Configure scoring weights, region and application preferences">
        <DemoBadge />
      </PageHeader>

      <div className="space-y-4 max-w-3xl">
        {/* Scoring weights */}
        <Card>
          <h2 className="text-base font-bold text-white mb-1 flex items-center gap-2">
            <Sliders size={18} className="text-accent-400" /> Priority Score Weights
          </h2>
          <p className="text-xs text-slate-500 mb-4">Adjust the weight of each factor in the priority score calculation. Total should equal 100%.</p>

          <div className="space-y-4">
            {[
              { key: 'recurrence', label: 'Recurrence', desc: 'How often the problem recurs' },
              { key: 'severity', label: 'Severity', desc: 'Highest severity recorded' },
              { key: 'recentActivity', label: 'Recent Activity', desc: 'How recently incidents occurred' },
              { key: 'exposure', label: 'Exposure', desc: 'Population and service impact' },
              { key: 'environmental', label: 'Environmental', desc: 'Terrain and rainfall indicators' },
              { key: 'accessibility', label: 'Accessibility', desc: 'Road and emergency route impact' },
            ].map((f) => (
              <div key={f.key}>
                <div className="flex items-center justify-between mb-1">
                  <div>
                    <p className="text-sm text-white">{f.label}</p>
                    <p className="text-xs text-slate-500">{f.desc}</p>
                  </div>
                  <span className="text-sm font-mono text-accent-400">{weights[f.key as keyof typeof weights]}%</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="50"
                  value={weights[f.key as keyof typeof weights]}
                  onChange={(e) => setWeights({ ...weights, [f.key]: parseInt(e.target.value) })}
                  className="w-full accent-cyan-500"
                />
              </div>
            ))}
          </div>

          <div className="mt-4 pt-4 border-t border-white/5 flex items-center justify-between">
            <span className={`text-sm ${total === 100 ? 'text-green-400' : 'text-amber-400'}`}>
              Total: {total}% {total !== 100 && '(should be 100%)'}
            </span>
            <button onClick={handleSave} className="btn-primary">
              {saved ? 'Saved!' : 'Save Weights'}
            </button>
          </div>
          <Disclaimer text="Weight changes in the prototype are visual only. In production, these would recalculate all priority scores and update the database." />
        </Card>

        {/* Region settings */}
        <Card>
          <h2 className="text-base font-bold text-white mb-3 flex items-center gap-2">
            <Map size={18} className="text-accent-400" /> Region Configuration
          </h2>
          <div className="space-y-3">
            <div>
              <label className="text-xs text-slate-500 mb-1 block">Active Region</label>
              <select value={region} onChange={(e) => setRegion(e.target.value)} className="input-field">
                <option value="Shillong, Meghalaya">Shillong, Meghalaya</option>
                <option value="Tura, Meghalaya">Tura, Meghalaya</option>
                <option value="Jowai, Meghalaya">Jowai, Meghalaya</option>
                <option value="Nongstoin, Meghalaya">Nongstoin, Meghalaya</option>
              </select>
            </div>
            <div>
              <label className="text-xs text-slate-500 mb-1 block">Default Map Center</label>
              <div className="grid grid-cols-2 gap-2">
                <input type="text" defaultValue="25.5788" className="input-field" placeholder="Latitude" />
                <input type="text" defaultValue="91.8933" className="input-field" placeholder="Longitude" />
              </div>
            </div>
          </div>
        </Card>

        {/* User profile */}
        <Card>
          <h2 className="text-base font-bold text-white mb-3 flex items-center gap-2">
            <User size={18} className="text-accent-400" /> Profile
          </h2>
          <div className="space-y-3">
            <div>
              <label className="text-xs text-slate-500 mb-1 block">Display Name</label>
              <input type="text" defaultValue="Demo Admin" className="input-field" />
            </div>
            <div>
              <label className="text-xs text-slate-500 mb-1 block">Email</label>
              <input type="email" defaultValue="admin@megh-scan.demo" className="input-field" />
            </div>
          </div>
        </Card>

        {/* Notifications */}
        <Card>
          <h2 className="text-base font-bold text-white mb-3 flex items-center gap-2">
            <Bell size={18} className="text-accent-400" /> Notifications
          </h2>
          <div className="space-y-3">
            {[
              { label: 'New observation submitted', default: true },
              { label: 'High-priority incident reported', default: true },
              { label: 'Risk score updated', default: false },
              { label: 'Dataset imported', default: true },
              { label: 'Inspection status changed', default: false },
            ].map((n) => (
              <label key={n.label} className="flex items-center justify-between">
                <span className="text-sm text-slate-300">{n.label}</span>
                <input type="checkbox" defaultChecked={n.default} className="accent-cyan-500" />
              </label>
            ))}
          </div>
        </Card>

        {/* Security */}
        <Card>
          <h2 className="text-base font-bold text-white mb-3 flex items-center gap-2">
            <Shield size={18} className="text-accent-400" /> Security
          </h2>
          <div className="space-y-2 text-sm text-slate-400">
            <p>Row Level Security is enabled on all database tables.</p>
            <p>Demo authentication uses localStorage. Connect Supabase Auth for production.</p>
            <p>All API keys and secrets are stored as environment variables.</p>
          </div>
        </Card>
      </div>
    </div>
  );
}
