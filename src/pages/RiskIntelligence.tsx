import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ShieldAlert, ChevronRight, Sliders } from 'lucide-react';
import {
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  ResponsiveContainer,
} from 'recharts';
import { Card, RiskBadge, LoadingSpinner, PageHeader, DemoBadge, Disclaimer } from '@/components/ui';
import { supabase } from '@/lib/supabase';
import type { Location, RiskScore } from '@/types';
import { formatDate } from '@/lib/utils';

const FACTOR_LABELS: { key: keyof RiskScore; label: string; max: number; weight: string }[] = [
  { key: 'recurrence_score', label: 'Recurrence', max: 30, weight: '30%' },
  { key: 'severity_score', label: 'Severity', max: 20, weight: '20%' },
  { key: 'recent_activity_score', label: 'Recent Activity', max: 15, weight: '15%' },
  { key: 'exposure_score', label: 'Exposure', max: 15, weight: '15%' },
  { key: 'environmental_score', label: 'Environmental', max: 10, weight: '10%' },
  { key: 'accessibility_score', label: 'Accessibility', max: 10, weight: '10%' },
];

export function RiskIntelligence() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [locations, setLocations] = useState<Location[]>([]);
  const [riskScores, setRiskScores] = useState<Record<string, RiskScore>>({});
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [showWeights, setShowWeights] = useState(false);

  useEffect(() => {
    async function fetchData() {
      const [{ data: locs }, { data: scores }] = await Promise.all([
        supabase.from('locations').select('*').order('priority_score', { ascending: false }),
        supabase.from('risk_scores').select('*'),
      ]);
      setLocations(locs ?? []);
      const scoreMap: Record<string, RiskScore> = {};
      (scores ?? []).forEach((s) => {
        scoreMap[s.location_id] = s;
      });
      setRiskScores(scoreMap);
      if (locs && locs.length > 0) setSelectedId(locs[0].id);
      setLoading(false);
    }
    fetchData();
  }, []);

  if (loading) return <LoadingSpinner />;

  const selected = locations.find((l) => l.id === selectedId);
  const score = selectedId ? riskScores[selectedId] : null;

  const radarData = score
    ? FACTOR_LABELS.map((f) => ({
        factor: f.label,
        value: score[f.key] as number,
        max: f.max,
      }))
    : [];

  return (
    <div className="animate-fade-in">
      <PageHeader title="Infrastructure Risk Intelligence" subtitle="Transparent priority scoring with factor breakdowns">
        <button onClick={() => setShowWeights(!showWeights)} className="btn-secondary flex items-center gap-2">
          <Sliders size={14} />
          Scoring Weights
        </button>
        <DemoBadge />
      </PageHeader>

      {showWeights && (
        <Card className="mb-4">
          <h3 className="text-sm font-semibold text-white mb-3">Priority Score Weight Configuration</h3>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
            {FACTOR_LABELS.map((f) => (
              <div key={f.key} className="p-3 rounded-lg bg-white/5">
                <p className="text-xs text-slate-500">{f.label}</p>
                <p className="text-lg font-bold text-accent-400">{f.weight}</p>
                <p className="text-xs text-slate-600">Max: {f.max} pts</p>
              </div>
            ))}
          </div>
          <Disclaimer text="Weight adjustments are available to administrators. Changes in the prototype are visual only — the scoring model is designed for configuration via the settings page." />
        </Card>
      )}

      <div className="grid lg:grid-cols-3 gap-4">
        {/* Location list */}
        <div className="space-y-2 lg:max-h-[calc(100vh-12rem)] lg:overflow-y-auto">
          {locations.map((loc) => (
            <button
              key={loc.id}
              onClick={() => setSelectedId(loc.id)}
              className={`w-full flex items-center gap-3 p-3 rounded-lg border transition-all text-left ${
                selectedId === loc.id
                  ? 'bg-accent-500/10 border-accent-500/30'
                  : 'bg-white/5 border-white/5 hover:bg-white/10'
              }`}
            >
              <div className="flex-shrink-0 w-10 text-center">
                <span className={`text-lg font-bold ${
                  loc.priority_score >= 80 ? 'text-red-400' :
                  loc.priority_score >= 65 ? 'text-orange-400' :
                  loc.priority_score >= 45 ? 'text-yellow-400' : 'text-green-400'
                }`}>
                  {Math.round(loc.priority_score)}
                </span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm text-white truncate">{loc.name}</p>
                <p className="text-xs text-slate-500">{loc.primary_problem}</p>
              </div>
              <ChevronRight size={16} className="text-slate-600" />
            </button>
          ))}
        </div>

        {/* Detail panel */}
        <div className="lg:col-span-2 space-y-4">
          {selected && score ? (
            <>
              <Card>
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h2 className="text-lg font-bold text-white">{selected.name}</h2>
                    <p className="text-sm text-slate-400 mt-1">{selected.description}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-3xl font-bold text-white">{Math.round(score.total_score)}<span className="text-lg text-slate-500">/100</span></p>
                    <RiskBadge level={selected.risk_level as 'Low' | 'Moderate' | 'High' | 'Critical'} />
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  {/* Radar chart */}
                  <div>
                    <h3 className="text-xs text-slate-500 uppercase tracking-wider mb-2">Factor Breakdown</h3>
                    <ResponsiveContainer width="100%" height={220}>
                      <RadarChart data={radarData}>
                        <PolarGrid stroke="rgba(255,255,255,0.1)" />
                        <PolarAngleAxis dataKey="factor" tick={{ fill: '#64748b', fontSize: 10 }} />
                        <PolarRadiusAxis domain={[0, 30]} tick={false} axisLine={false} />
                        <Radar dataKey="value" stroke="#22d3ee" fill="#22d3ee" fillOpacity={0.3} />
                      </RadarChart>
                    </ResponsiveContainer>
                  </div>

                  {/* Factor scores */}
                  <div>
                    <h3 className="text-xs text-slate-500 uppercase tracking-wider mb-2">Score Details</h3>
                    <div className="space-y-2">
                      {FACTOR_LABELS.map((f) => {
                        const val = score[f.key] as number;
                        const pct = (val / f.max) * 100;
                        return (
                          <div key={f.key}>
                            <div className="flex items-center justify-between text-xs">
                              <span className="text-slate-400">{f.label}</span>
                              <span className="text-slate-300">{val}/{f.max}</span>
                            </div>
                            <div className="h-1.5 rounded-full bg-white/5 mt-1 overflow-hidden">
                              <div
                                className="h-full rounded-full bg-accent-400"
                                style={{ width: `${pct}%` }}
                              />
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>

                <div className="mt-4 pt-4 border-t border-white/5">
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
                    <div>
                      <p className="text-xs text-slate-500">Confidence</p>
                      <p className="text-slate-300">{score.confidence}</p>
                    </div>
                    <div>
                      <p className="text-xs text-slate-500">Recurrences</p>
                      <p className="text-slate-300">{selected.recurrence_count}</p>
                    </div>
                    <div>
                      <p className="text-xs text-slate-500">Last Incident</p>
                      <p className="text-slate-300">{formatDate(selected.last_incident_date)}</p>
                    </div>
                    <div>
                      <p className="text-xs text-slate-500">Calculated</p>
                      <p className="text-slate-300">{formatDate(score.calculated_at)}</p>
                    </div>
                  </div>
                </div>

                <div className="mt-4 p-3 rounded-lg bg-navy-900/50 border border-white/5">
                  <p className="text-xs text-slate-500 mb-1">Interpretation</p>
                  <p className="text-sm text-slate-300">
                    {selected.priority_score >= 80
                      ? `This location is prioritised because ${selected.primary_problem.toLowerCase()} has repeatedly occurred at critical severity and may affect road accessibility during heavy rainfall.`
                      : selected.priority_score >= 65
                      ? `This location is flagged because ${selected.primary_problem.toLowerCase()} recurs frequently and requires monitoring during monsoon periods.`
                      : selected.priority_score >= 45
                      ? `This location has moderate recurrence of ${selected.primary_problem.toLowerCase()} and should be monitored for escalation.`
                      : `This location has limited recurrence but is tracked for potential future issues.`}
                  </p>
                </div>

                <div className="flex gap-2 mt-4">
                  <button
                    onClick={() => navigate(`/problem-memory/${selected.id}`)}
                    className="btn-secondary flex-1"
                  >
                    View Problem Memory
                  </button>
                  <button
                    onClick={() => navigate(`/analysis?location=${selected.id}`)}
                    className="btn-primary flex-1"
                  >
                    AI Analysis
                  </button>
                </div>
              </Card>

              <Disclaimer />
            </>
          ) : (
            <Card>
              <div className="flex flex-col items-center justify-center py-12 text-slate-500">
                <ShieldAlert size={32} className="mb-2 opacity-50" />
                <p className="text-sm">Select a location to view risk intelligence</p>
              </div>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
