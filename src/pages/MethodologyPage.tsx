import { Card, PageHeader, DemoBadge, Disclaimer } from '@/components/ui';
import { Database, Brain, Shield, Map, CloudRain, History, Activity, Layers, AlertTriangle } from 'lucide-react';

export function MethodologyPage() {
  return (
    <div className="animate-fade-in">
      <PageHeader title="Methodology & Data Sources" subtitle="How MEGH-SCAN works, what data it uses, and its limitations">
        <DemoBadge />
      </PageHeader>

      <div className="space-y-4 max-w-4xl">
        <Card>
          <h2 className="text-base font-bold text-white mb-3 flex items-center gap-2">
            <Database size={18} className="text-accent-400" /> Data Sources
          </h2>
          <div className="space-y-3 text-sm text-slate-300">
            <div>
              <p className="font-semibold text-white mb-1">Historical Incident Records</p>
              <p className="text-slate-400">Manually curated incident data spanning 2019–2025. In production, this would be sourced from municipal records, PWD logs, and disaster management reports.</p>
            </div>
            <div>
              <p className="font-semibold text-white mb-1">Citizen Observations</p>
              <p className="text-slate-400">Public submissions via the observation portal. Each report requires verification before being treated as confirmed data.</p>
            </div>
            <div>
              <p className="font-semibold text-white mb-1">Rainfall Data</p>
              <p className="text-slate-400">Simulated monthly rainfall data for Shillong. In production, this would use IMD (India Meteorological Department) or regional weather station data.</p>
            </div>
            <div>
              <p className="font-semibold text-white mb-1">Road Network & Terrain</p>
              <p className="text-slate-400">OpenStreetMap for road network data. SRTM-derived elevation/slope data for terrain analysis.</p>
            </div>
            <div>
              <p className="font-semibold text-white mb-1">Map Base Layers</p>
              <p className="text-slate-400">OpenStreetMap tiles for street view, Esri World Imagery for satellite, OpenTopoMap for terrain.</p>
            </div>
          </div>
        </Card>

        <Card>
          <h2 className="text-base font-bold text-white mb-3 flex items-center gap-2">
            <Shield size={18} className="text-accent-400" /> Priority Scoring Model
          </h2>
          <p className="text-sm text-slate-400 mb-4">
            The priority score is a transparent, weighted combination of six factors. Each factor contributes a portion of the total 0–100 score. Weights can be adjusted by administrators.
          </p>
          <div className="space-y-2">
            {[
              { name: 'Recurrence Score', weight: '30%', max: 30, desc: 'How often the same problem has been recorded at this location. Higher recurrence = higher score.' },
              { name: 'Severity Score', weight: '20%', max: 20, desc: 'The highest severity level recorded across all incidents at this location.' },
              { name: 'Recent Activity Score', weight: '15%', max: 15, desc: 'How recently incidents have been reported. More recent activity = higher score.' },
              { name: 'Population/Service Exposure', weight: '15%', max: 15, desc: 'Estimated impact on population and essential services if the problem occurs.' },
              { name: 'Environmental Indicators', weight: '10%', max: 10, desc: 'Terrain, slope, drainage and rainfall-related environmental factors.' },
              { name: 'Accessibility Impact', weight: '10%', max: 10, desc: 'Impact on road accessibility and emergency route availability.' },
            ].map((f) => (
              <div key={f.name} className="p-3 rounded-lg bg-white/5">
                <div className="flex items-center justify-between mb-1">
                  <p className="text-sm font-semibold text-white">{f.name}</p>
                  <span className="text-xs text-accent-400 font-mono">{f.weight} (max {f.max})</span>
                </div>
                <p className="text-xs text-slate-400">{f.desc}</p>
              </div>
            ))}
          </div>
          <div className="mt-4 p-3 rounded-lg bg-navy-900/50 border border-white/5">
            <p className="text-xs text-slate-500 mb-1">Risk Level Classification</p>
            <div className="grid grid-cols-4 gap-2 text-xs">
              <div className="text-center p-2 rounded bg-green-500/15 text-green-400">Low (0–44)</div>
              <div className="text-center p-2 rounded bg-yellow-500/15 text-yellow-400">Moderate (45–64)</div>
              <div className="text-center p-2 rounded bg-orange-500/15 text-orange-400">High (65–79)</div>
              <div className="text-center p-2 rounded bg-red-500/15 text-red-400">Critical (80–100)</div>
            </div>
          </div>
        </Card>

        <Card>
          <h2 className="text-base font-bold text-white mb-3 flex items-center gap-2">
            <Brain size={18} className="text-accent-400" /> AI-Assisted Analysis
          </h2>
          <div className="space-y-2 text-sm text-slate-400">
            <p>The AI analysis module generates structured summaries based on historical data patterns. It uses a deterministic local analysis function that examines:</p>
            <ul className="space-y-1 ml-4">
              <li className="flex items-start gap-2"><span className="text-accent-400">•</span> Recurrence patterns and frequency</li>
              <li className="flex items-start gap-2"><span className="text-accent-400">•</span> Severity distribution over time</li>
              <li className="flex items-start gap-2"><span className="text-accent-400">•</span> Intervention history and outcomes</li>
              <li className="flex items-start gap-2"><span className="text-accent-400">•</span> Environmental and terrain context</li>
              <li className="flex items-start gap-2"><span className="text-accent-400">•</span> Seasonal correlation with rainfall</li>
            </ul>
            <p className="mt-2">The system is designed so that external AI services (OpenAI, Gemini, etc.) can be connected via a service abstraction layer. The current prototype uses rule-based analysis.</p>
          </div>
        </Card>

        <Card>
          <h2 className="text-base font-bold text-white mb-3 flex items-center gap-2">
            <AlertTriangle size={18} className="text-amber-400" /> Limitations
          </h2>
          <div className="space-y-2 text-sm text-slate-400">
            <p>MEGH-SCAN is an AI-assisted decision-support prototype. The following limitations apply:</p>
            <ul className="space-y-1 ml-4">
              <li className="flex items-start gap-2"><span className="text-amber-400">•</span> All data in the prototype is simulated/demo data</li>
              <li className="flex items-start gap-2"><span className="text-amber-400">•</span> The system does NOT automatically scan Google Maps</li>
              <li className="flex items-start gap-2"><span className="text-amber-400">•</span> The system does NOT predict disasters with certainty</li>
              <li className="flex items-start gap-2"><span className="text-amber-400">•</span> No access to live CCTV or unrestricted satellite imagery</li>
              <li className="flex items-start gap-2"><span className="text-amber-400">•</span> Results are indicators for human inspection, not official warnings</li>
              <li className="flex items-start gap-2"><span className="text-amber-400">•</span> Contributing factors are possible indicators, not confirmed causation</li>
              <li className="flex items-start gap-2"><span className="text-amber-400">•</span> Rainfall data is simulated and should be replaced with IMD data</li>
            </ul>
          </div>
        </Card>

        <Card>
          <h2 className="text-base font-bold text-white mb-3 flex items-center gap-2">
            <Layers size={18} className="text-accent-400" /> System Architecture
          </h2>
          <div className="grid md:grid-cols-2 gap-3 text-sm">
            <div className="p-3 rounded-lg bg-white/5">
              <p className="font-semibold text-white mb-1">Frontend</p>
              <p className="text-slate-400">React + TypeScript + Vite, Tailwind CSS, Leaflet for GIS mapping, Recharts for analytics</p>
            </div>
            <div className="p-3 rounded-lg bg-white/5">
              <p className="font-semibold text-white mb-1">Backend</p>
              <p className="text-slate-400">PostgreSQL via Supabase with Row Level Security, Edge Functions for server-side processing</p>
            </div>
            <div className="p-3 rounded-lg bg-white/5">
              <p className="font-semibold text-white mb-1">Auth</p>
              <p className="text-slate-400">Demo role-based auth (localStorage). Supabase Auth can be connected for production.</p>
            </div>
            <div className="p-3 rounded-lg bg-white/5">
              <p className="font-semibold text-white mb-1">Extensibility</p>
              <p className="text-slate-400">Designed for real API integration: IMD weather, satellite imagery, Google Maps, AI models</p>
            </div>
          </div>
        </Card>

        <Disclaimer />
      </div>
    </div>
  );
}
