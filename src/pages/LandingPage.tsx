import { useNavigate } from 'react-router-dom';
import { useEffect, useState, useRef } from 'react';
import {
  MapPin,
  Brain,
  TrendingDown,
  ShieldCheck,
  ArrowRight,
  Database,
  Radar,
  History,
  AlertTriangle,
  Activity,
  Layers,
  CloudRain,
} from 'lucide-react';
import { LogoFull, Logo } from '@/components/Logo';
import { Disclaimer } from '@/components/ui';

const ANIMATED_POINTS = [
  { x: 45, y: 35, delay: 0, color: '#ef4444' },
  { x: 55, y: 45, delay: 0.5, color: '#f97316' },
  { x: 38, y: 50, delay: 1, color: '#22d3ee' },
  { x: 62, y: 30, delay: 1.5, color: '#ef4444' },
  { x: 50, y: 55, delay: 2, color: '#f97316' },
  { x: 42, y: 40, delay: 2.5, color: '#22d3ee' },
  { x: 58, y: 50, delay: 3, color: '#ef4444' },
  { x: 48, y: 42, delay: 3.5, color: '#f97316' },
];

function useScrollReveal() {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setVisible(true); },
      { threshold: 0.15 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => { if (ref.current) observer.unobserve(ref.current); };
  }, []);
  return { ref, visible };
}

function RevealSection({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  const { ref, visible } = useScrollReveal();
  return (
    <div ref={ref} className={`transition-all duration-700 ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'} ${className}`}>
      {children}
    </div>
  );
}

export function LandingPage() {
  const navigate = useNavigate();
  const [mounted, setMounted] = useState(false);
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    setMounted(true);
    const handler = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handler, { passive: true });
    return () => window.removeEventListener('scroll', handler);
  }, []);

  return (
    <div className="min-h-screen bg-navy-950 text-slate-200">
      {/* Nav */}
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrollY > 20 ? 'bg-navy-950/90 backdrop-blur-lg border-b border-white/5 shadow-lg shadow-black/20' : 'bg-navy-950/80 backdrop-blur-md border-b border-white/5'
      }`}>
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <button onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} className="group">
            <LogoFull />
          </button>
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate('/methodology')}
              className="text-sm text-slate-400 hover:text-white transition-colors hidden sm:block"
            >
              How It Works
            </button>
            <button
              onClick={() => navigate('/login')}
              className="btn-primary group"
            >
              Enter Command Centre
              <ArrowRight size={16} className="group-hover:translate-x-0.5 transition-transform" />
            </button>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative pt-32 pb-20 px-6 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-navy-900/50 via-navy-950 to-navy-950" />
        <div className="absolute inset-0 opacity-20" style={{
          backgroundImage: `radial-gradient(circle at 50% 50%, rgba(34, 211, 238, 0.15) 0%, transparent 50%)`,
        }} />
        {/* Grid background */}
        <div className="absolute inset-0 opacity-[0.03]" style={{
          backgroundImage: `linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)`,
          backgroundSize: '40px 40px',
        }} />

        <div className="relative max-w-7xl mx-auto grid lg:grid-cols-2 gap-12 items-center">
          <div className={`transition-all duration-700 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-accent-500/10 border border-accent-500/20 text-accent-400 text-xs font-medium mb-6 animate-bounce-in">
              <MapPin size={12} className="animate-pulse-slow" />
              Pilot: Shillong, Meghalaya, India
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight tracking-tight">
              Intelligence for a <span className="text-accent-400 relative inline-block">Resilient Meghalaya
                <span className="absolute -bottom-1 left-0 right-0 h-0.5 bg-accent-400/40 rounded-full" />
              </span>
            </h1>
            <p className="mt-6 text-lg text-slate-400 leading-relaxed max-w-xl">
              Discover recurring infrastructure problems, understand changing risk patterns, and prioritise preventive action through geospatial intelligence.
            </p>
            <div className="mt-8 flex flex-col sm:flex-row gap-3">
              <button
                onClick={() => navigate('/login')}
                className="btn-primary flex items-center gap-2 justify-center group"
              >
                Explore Command Centre
                <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
              </button>
              <button
                onClick={() => navigate('/methodology')}
                className="btn-secondary flex items-center gap-2 justify-center"
              >
                View How It Works
              </button>
            </div>
            <div className="mt-8 max-w-lg">
              <Disclaimer />
            </div>
          </div>

          {/* Map visual */}
          <div className={`relative transition-all duration-1000 delay-200 ${mounted ? 'opacity-100 scale-100' : 'opacity-0 scale-95'}`}>
            <div className="relative aspect-square max-w-md mx-auto" style={{ transform: `translateY(${scrollY * 0.05}px)` }}>
              <div className="absolute inset-0 rounded-2xl glass-card overflow-hidden group">
                {/* Topographic contour lines */}
                <svg viewBox="0 0 400 400" className="absolute inset-0 w-full h-full opacity-30">
                  {[60, 100, 140, 180, 220, 260, 300, 340].map((r, i) => (
                    <ellipse
                      key={i}
                      cx="200"
                      cy="200"
                      rx={r}
                      ry={r * 0.85}
                      fill="none"
                      stroke="#22d3ee"
                      strokeWidth="1"
                      opacity={1 - i * 0.1}
                      className="transition-all duration-700 group-hover:opacity-50"
                    />
                  ))}
                </svg>
                {/* Animated data points */}
                {ANIMATED_POINTS.map((pt, i) => (
                  <div
                    key={i}
                    className="absolute w-3 h-3 -translate-x-1/2 -translate-y-1/2"
                    style={{ left: `${pt.x}%`, top: `${pt.y}%`, animationDelay: `${pt.delay}s` }}
                  >
                    <div className="w-3 h-3 rounded-full animate-pulse-slow" style={{ backgroundColor: pt.color }} />
                    <div className="absolute inset-0 w-3 h-3 rounded-full animate-pulse-ring" style={{ backgroundColor: pt.color }} />
                  </div>
                ))}
                {/* Center label */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center">
                  <Logo size={48} />
                  <p className="text-xs text-slate-500 mt-2 font-mono">25.5788°N, 91.8933°E</p>
                </div>
              </div>
              {/* Floating stats */}
              <div className="absolute -top-4 -right-4 glass-card px-3 py-2 text-xs animate-float">
                <p className="text-slate-500">Monitored</p>
                <p className="text-white font-bold text-lg tabular-nums">128</p>
              </div>
              <div className="absolute -bottom-4 -left-4 glass-card px-3 py-2 text-xs animate-float" style={{ animationDelay: '1s' }}>
                <p className="text-slate-500">Recurring Zones</p>
                <p className="text-orange-400 font-bold text-lg tabular-nums">24</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Feature cards */}
      <RevealSection>
        <section className="py-16 px-6 max-w-7xl mx-auto">
          <div className="grid md:grid-cols-3 gap-6">
            {[
              { icon: Radar, title: 'Detect Recurring Problems', desc: 'Identify locations where the same infrastructure issue returns year after year through historical incident analysis and problem memory.', color: 'text-accent-400' },
              { icon: TrendingDown, title: 'Understand Risk Patterns', desc: 'Analyse how risk changes over time with transparent scoring models based on recurrence, severity, exposure and environmental indicators.', color: 'text-orange-400' },
              { icon: ShieldCheck, title: 'Prioritise Preventive Action', desc: 'Generate priority queues and AI-assisted recommendations so authorities know which locations need inspection first.', color: 'text-green-400' },
            ].map((feature, i) => (
              <div key={i} className="glass-card glass-card-hover p-6 group" style={{ animationDelay: `${i * 0.1}s` }}>
                <div className={`p-3 rounded-xl bg-white/5 ${feature.color} mb-4 w-fit group-hover:scale-110 group-hover:-rotate-6 transition-all duration-300`}>
                  <feature.icon size={24} />
                </div>
                <h3 className="text-lg font-semibold text-white mb-2">{feature.title}</h3>
                <p className="text-sm text-slate-400 leading-relaxed">{feature.desc}</p>
              </div>
            ))}
          </div>
        </section>
      </RevealSection>

      {/* The Problem */}
      <RevealSection>
        <section className="py-16 px-6 bg-navy-900/30">
          <div className="max-w-4xl mx-auto text-center">
            <p className="section-title text-accent-400 mb-3">The Problem</p>
            <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">
              Why does the same problem keep returning at the same location?
            </h2>
            <p className="text-slate-400 leading-relaxed">
              Across Meghalaya, infrastructure issues like waterlogging, drainage blockage, and road damage recur at the same locations year after year. Temporary repairs fade. Records are lost. The cycle repeats. MEGH-SCAN breaks this cycle by maintaining a geospatial memory of every location's problem history, so patterns become visible and preventive action becomes possible.
            </p>
          </div>
        </section>
      </RevealSection>

      {/* How it works */}
      <RevealSection>
        <section className="py-16 px-6 max-w-7xl mx-auto">
          <p className="section-title text-accent-400 mb-3 text-center">How MEGH-SCAN Works</p>
          <h2 className="text-2xl font-bold text-white text-center mb-12">From observation to prioritised action</h2>
          <div className="grid md:grid-cols-4 gap-6">
            {[
              { icon: Database, step: '01', title: 'Data Collection', desc: 'Historical incidents, citizen observations, rainfall data, terrain indicators and road network information are collected and stored.' },
              { icon: History, step: '02', title: 'Problem Memory', desc: 'Each location maintains a timeline of every recorded event, intervention and result, building a complete problem history.' },
              { icon: Activity, step: '03', title: 'Risk Scoring', desc: 'A transparent, weighted scoring model calculates priority based on recurrence, severity, exposure and environmental factors.' },
              { icon: Brain, step: '04', title: 'AI-Assisted Analysis', desc: 'AI generates summaries, contributing factors and recommended actions, with clear limitations and confidence levels.' },
            ].map((item, i) => (
              <div key={i} className="relative group">
                <div className="glass-card glass-card-hover p-5">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="p-2 rounded-lg bg-accent-500/10 text-accent-400 group-hover:scale-110 group-hover:-rotate-6 transition-all duration-300">
                      <item.icon size={20} />
                    </div>
                    <span className="text-2xl font-bold text-navy-400 font-mono">{item.step}</span>
                  </div>
                  <h3 className="text-sm font-semibold text-white mb-2">{item.title}</h3>
                  <p className="text-xs text-slate-400 leading-relaxed">{item.desc}</p>
                </div>
                {i < 3 && (
                  <ArrowRight size={16} className="hidden md:block absolute top-1/2 -right-3 text-slate-700 group-hover:text-accent-400 group-hover:translate-x-1 transition-all" />
                )}
              </div>
            ))}
          </div>
        </section>
      </RevealSection>

      {/* Core capabilities */}
      <RevealSection>
        <section className="py-16 px-6 bg-navy-900/30">
          <div className="max-w-7xl mx-auto">
            <p className="section-title text-accent-400 mb-3 text-center">Core Capabilities</p>
            <h2 className="text-2xl font-bold text-white text-center mb-12">A complete geospatial command centre</h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 stagger">
              {[
                { icon: Layers, title: 'Interactive GIS Map', desc: 'Multi-layer map with risk markers, heatmaps and incident data' },
                { icon: History, title: 'Problem Memory Timeline', desc: 'Historical record per location with recurrence analysis' },
                { icon: ShieldCheck, title: 'Risk Intelligence', desc: 'Transparent priority scoring with factor breakdowns' },
                { icon: Brain, title: 'AI-Assisted Analysis', desc: 'Summaries, contributing factors and recommended actions' },
                { icon: Activity, title: 'Incident Management', desc: 'Track, verify and manage infrastructure incidents' },
                { icon: CloudRain, title: 'Rainfall Integration', desc: 'Correlate incidents with rainfall and seasonal patterns' },
                { icon: TrendingDown, title: 'Reports & Analytics', desc: 'Charts, trends and exportable data for decision-makers' },
                { icon: Database, title: 'Dataset Management', desc: 'Upload, validate and manage geospatial datasets' },
                { icon: AlertTriangle, title: 'Citizen Observations', desc: 'Public submission portal with verification workflow' },
              ].map((cap, i) => (
                <div key={i} className="flex items-start gap-3 p-4 rounded-lg bg-white/5 hover:bg-white/10 transition-all duration-200 group hover:translate-x-1 cursor-default">
                  <div className="p-2 rounded-lg bg-accent-500/10 text-accent-400 flex-shrink-0 group-hover:scale-110 group-hover:-rotate-6 transition-all duration-300">
                    <cap.icon size={18} />
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-white group-hover:text-accent-300 transition-colors">{cap.title}</h3>
                    <p className="text-xs text-slate-400 mt-1">{cap.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </RevealSection>

      {/* Meghalaya pilot */}
      <RevealSection>
        <section className="py-16 px-6 max-w-4xl mx-auto text-center">
          <p className="section-title text-accent-400 mb-3">Meghalaya Pilot</p>
          <h2 className="text-2xl font-bold text-white mb-4">Starting with Shillong</h2>
          <p className="text-slate-400 leading-relaxed mb-8">
            The initial pilot focuses on Shillong, the capital of Meghalaya, where monsoon-related infrastructure problems are recurring and well-documented. The platform is designed to scale to other districts including East Khasi Hills, West Khasi Hills, Ri-Bhoi, and Jaintia Hills.
          </p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 stagger">
            {[
              { label: 'Monitored Locations', value: '12' },
              { label: 'Historical Incidents', value: '30+' },
              { label: 'Problem Categories', value: '10' },
              { label: 'Years of Data', value: '6+' },
            ].map((stat, i) => (
              <div key={i} className="glass-card glass-card-hover p-4 group">
                <p className="text-2xl font-bold text-accent-400 group-hover:scale-110 transition-transform duration-300">{stat.value}</p>
                <p className="text-xs text-slate-500 mt-1">{stat.label}</p>
              </div>
            ))}
          </div>
        </section>
      </RevealSection>

      {/* Technology overview */}
      <RevealSection>
        <section className="py-16 px-6 bg-navy-900/30">
          <div className="max-w-4xl mx-auto">
            <p className="section-title text-accent-400 mb-3 text-center">Technology Overview</p>
            <h2 className="text-2xl font-bold text-white text-center mb-8">Built on open, extensible foundations</h2>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="glass-card glass-card-hover p-5">
                <h3 className="text-sm font-semibold text-white mb-3">Frontend</h3>
                <ul className="space-y-2 text-sm text-slate-400">
                  <li className="hover:text-slate-300 transition-colors cursor-default">React + TypeScript + Vite</li>
                  <li className="hover:text-slate-300 transition-colors cursor-default">Leaflet / MapLibre for interactive GIS mapping</li>
                  <li className="hover:text-slate-300 transition-colors cursor-default">Recharts for analytics visualisation</li>
                  <li className="hover:text-slate-300 transition-colors cursor-default">Tailwind CSS for responsive design</li>
                </ul>
              </div>
              <div className="glass-card glass-card-hover p-5">
                <h3 className="text-sm font-semibold text-white mb-3">Backend & Data</h3>
                <ul className="space-y-2 text-sm text-slate-400">
                  <li className="hover:text-slate-300 transition-colors cursor-default">PostgreSQL via Supabase</li>
                  <li className="hover:text-slate-300 transition-colors cursor-default">Row Level Security for access control</li>
                  <li className="hover:text-slate-300 transition-colors cursor-default">Edge Functions for server-side processing</li>
                  <li className="hover:text-slate-300 transition-colors cursor-default">Designed for real API integration (IMD, OSM, satellite)</li>
                </ul>
              </div>
            </div>
          </div>
        </section>
      </RevealSection>

      {/* Data & limitations */}
      <RevealSection>
        <section className="py-16 px-6 max-w-4xl mx-auto">
          <p className="section-title text-accent-400 mb-3 text-center">Data & Limitations</p>
          <h2 className="text-2xl font-bold text-white text-center mb-8">Transparent about what we know and don't</h2>
          <div className="space-y-4">
            <div className="glass-card glass-card-hover p-5">
              <h3 className="text-sm font-semibold text-white mb-2">What MEGH-SCAN uses</h3>
              <ul className="space-y-1.5 text-sm text-slate-400">
                <li className="hover:text-slate-300 transition-colors cursor-default flex items-center gap-2"><span className="text-accent-400">+</span> Historical incident records and citizen observations</li>
                <li className="hover:text-slate-300 transition-colors cursor-default flex items-center gap-2"><span className="text-accent-400">+</span> Simulated rainfall data (replaceable with IMD data)</li>
                <li className="hover:text-slate-300 transition-colors cursor-default flex items-center gap-2"><span className="text-accent-400">+</span> OpenStreetMap road network and terrain information</li>
                <li className="hover:text-slate-300 transition-colors cursor-default flex items-center gap-2"><span className="text-accent-400">+</span> Manually uploaded datasets (CSV format)</li>
              </ul>
            </div>
            <div className="glass-card glass-card-hover p-5">
              <h3 className="text-sm font-semibold text-white mb-2">What MEGH-SCAN does NOT do</h3>
              <ul className="space-y-1.5 text-sm text-slate-400">
                <li className="hover:text-slate-300 transition-colors cursor-default flex items-center gap-2"><span className="text-red-400">-</span> Automatically scan all of Google Maps every day</li>
                <li className="hover:text-slate-300 transition-colors cursor-default flex items-center gap-2"><span className="text-red-400">-</span> Predict disasters with certainty</li>
                <li className="hover:text-slate-300 transition-colors cursor-default flex items-center gap-2"><span className="text-red-400">-</span> Access live CCTV or unrestricted satellite imagery</li>
                <li className="hover:text-slate-300 transition-colors cursor-default flex items-center gap-2"><span className="text-red-400">-</span> Issue official disaster warnings</li>
              </ul>
            </div>
            <Disclaimer text="All data shown in the prototype is simulated/demo data. Real APIs and datasets can be connected as they become available. Results are indicators for human inspection, not guaranteed predictions." />
          </div>
        </section>
      </RevealSection>

      {/* CTA */}
      <RevealSection>
        <section className="py-20 px-6 text-center">
          <div className="max-w-2xl mx-auto">
            <div className="inline-block animate-float">
              <Logo size={48} />
            </div>
            <h2 className="text-3xl font-bold text-white mt-6 mb-4">Ready to explore?</h2>
            <p className="text-slate-400 mb-8">Enter the MEGH-SCAN command centre and explore the geospatial intelligence platform.</p>
            <button
              onClick={() => navigate('/login')}
              className="btn-primary inline-flex items-center gap-2 group"
            >
              Enter Command Centre
              <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </section>
      </RevealSection>

      {/* Footer */}
      <footer className="border-t border-white/5 py-8 px-6">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <LogoFull />
          <p className="text-xs text-slate-600">
            MEGH-SCAN — AI-Assisted Geospatial Intelligence for Meghalaya | Prototype Demo
          </p>
        </div>
      </footer>
    </div>
  );
}
