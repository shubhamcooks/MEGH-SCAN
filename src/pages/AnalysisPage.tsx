import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Brain, Sparkles, AlertTriangle, CheckCircle, Info, Loader2 } from 'lucide-react';
import { Card, LoadingSpinner, PageHeader, DemoBadge, Disclaimer, RiskBadge } from '@/components/ui';
import { supabase } from '@/lib/supabase';
import type { Location, TimelineEvent, Incident, RiskScore, AiAnalysis } from '@/types';
import { formatDate } from '@/lib/utils';

export function AnalysisPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const initialLoc = searchParams.get('location');
  const [loading, setLoading] = useState(true);
  const [locations, setLocations] = useState<Location[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(initialLoc ?? null);
  const [analyzing, setAnalyzing] = useState(false);
  const [analysis, setAnalysis] = useState<AiAnalysis | null>(null);
  const [timeline, setTimeline] = useState<TimelineEvent[]>([]);
  const [incidents, setIncidents] = useState<Incident[]>([]);
  const [riskScore, setRiskScore] = useState<RiskScore | null>(null);
  const [showScoreExplanation, setShowScoreExplanation] = useState(false);

  useEffect(() => {
    async function fetchData() {
      const { data: locs } = await supabase.from('locations').select('*').order('priority_score', { ascending: false });
      setLocations(locs ?? []);
      if (!initialLoc && locs && locs.length > 0) setSelectedId(locs[0].id);
      setLoading(false);
    }
    fetchData();
  }, []);

  useEffect(() => {
    if (!selectedId) return;
    async function loadLocationData() {
      const [{ data: tl }, { data: incs }, { data: rs }, { data: existing }] = await Promise.all([
        supabase.from('location_timeline').select('*').eq('location_id', selectedId).order('event_date', { ascending: false }),
        supabase.from('incidents').select('*').eq('location_id', selectedId).order('reported_date', { ascending: false }),
        supabase.from('risk_scores').select('*').eq('location_id', selectedId).order('calculated_at', { ascending: false }).limit(1).maybeSingle(),
        supabase.from('ai_analyses').select('*').eq('location_id', selectedId).order('created_at', { ascending: false }).limit(1).maybeSingle(),
      ]);
      setTimeline(tl ?? []);
      setIncidents(incs ?? []);
      setRiskScore(rs as RiskScore | null);
      setAnalysis(existing as AiAnalysis | null);
    }
    loadLocationData();
  }, [selectedId]);

  const selected = locations.find((l) => l.id === selectedId);

  const generateAnalysis = async () => {
    if (!selected || !selectedId) return;
    setAnalyzing(true);
    // Simulate AI processing delay
    await new Promise((r) => setTimeout(r, 1200));

    const recurrenceCount = timeline.length;
    const categories = [...new Set(timeline.map((t) => t.category).filter(Boolean))] as string[];
    const criticalCount = timeline.filter((t) => t.severity === 'Critical').length;
    const highCount = timeline.filter((t) => t.severity === 'High').length;
    const interventions = timeline.filter((t) => t.intervention).length;
    const resolvedCount = timeline.filter((t) => t.status === 'Resolved').length;
    const reopenedCount = timeline.filter((t) => t.status === 'Reopened').length;

    const isWaterRelated = selected.primary_problem.toLowerCase().includes('water') || selected.primary_problem.toLowerCase().includes('drain');
    const isLandslide = selected.primary_problem.toLowerCase().includes('landslide') || selected.primary_problem.toLowerCase().includes('erosion');

    const summary = `This location has a repeated history of ${selected.primary_problem.toLowerCase()} observations spanning ${recurrenceCount} recorded events. ` +
      `The issue appears to be concentrated during periods of heavy rainfall${criticalCount > 0 ? `, with ${criticalCount} critical-severity events recorded` : ''}. ` +
      (isWaterRelated
        ? 'The available data suggests that drainage capacity, surface runoff and road elevation may be relevant factors. '
        : isLandslide
        ? 'The available data suggests that slope stability, soil composition and rainfall intensity may be relevant factors. '
        : 'The available data suggests that surface conditions and maintenance frequency may be relevant factors. ') +
      (interventions > 0
        ? `${interventions} interventions have been recorded, but ${reopenedCount} issues were reopened after temporary resolution. `
        : 'No interventions have been recorded. ') +
      'A field inspection is recommended.';

    const factors = [
      `${recurrenceCount} events recorded at this location`,
      categories.length > 1 ? `Multiple issue types: ${categories.join(', ')}` : `Consistent issue type: ${categories[0] ?? selected.primary_problem}`,
      criticalCount > 0 ? `${criticalCount} critical-severity events` : `${highCount} high-severity events`,
      isWaterRelated ? 'Low-lying terrain or drainage infrastructure may be insufficient' : '',
      isLandslide ? 'Slope instability and soil erosion indicators present' : '',
      reopenedCount > 0 ? `${reopenedCount} issues reopened after intervention` : 'No issues have been reopened yet',
      'Recent rainfall-related reports in the surrounding area',
    ].filter(Boolean).join('; ');

    const action = isWaterRelated
      ? 'Conduct a comprehensive field inspection of drainage infrastructure. Assess drainage capacity against peak rainfall data. Consider permanent drainage upgrade or pump installation for monsoon preparedness.'
      : isLandslide
      ? 'Conduct a geological survey of the slope. Assess soil stability and consider retaining wall construction or slope stabilization measures.'
      : 'Conduct a field inspection of the road surface and drainage. Assess whether temporary repairs have addressed the root cause.';

    const confidence = selected.priority_score >= 80 ? 'High' : selected.priority_score >= 60 ? 'Medium' : 'Low';

    const result: AiAnalysis = {
      id: crypto.randomUUID(),
      location_id: selectedId,
      summary,
      contributing_factors: factors,
      suggested_action: action,
      confidence,
      limitations: 'Analysis based on simulated demo data. Requires field verification. Does not constitute an official warning or prediction. Rainfall data is simulated.',
      created_at: new Date().toISOString(),
    };

    await supabase.from('ai_analyses').insert({
      location_id: selectedId,
      summary,
      contributing_factors: factors,
      suggested_action: action,
      confidence,
      limitations: result.limitations,
    });

    setAnalysis(result);
    setAnalyzing(false);
  };

  if (loading) return <LoadingSpinner />;

  return (
    <div className="animate-fade-in">
      <PageHeader title="AI-Assisted Analysis" subtitle="Deterministic local analysis — connect OpenAI, Gemini or other models later">
        <DemoBadge />
      </PageHeader>

      <div className="grid lg:grid-cols-3 gap-4">
        {/* Location selector */}
        <div className="space-y-2 lg:max-h-[calc(100vh-12rem)] lg:overflow-y-auto">
          {locations.map((loc) => (
            <button
              key={loc.id}
              onClick={() => setSelectedId(loc.id)}
              className={`w-full flex items-center gap-3 p-3 rounded-lg border transition-all text-left ${
                selectedId === loc.id ? 'bg-accent-500/10 border-accent-500/30' : 'bg-white/5 border-white/5 hover:bg-white/10'
              }`}
            >
              <div className="flex-1 min-w-0">
                <p className="text-sm text-white truncate">{loc.name}</p>
                <p className="text-xs text-slate-500">{loc.primary_problem}</p>
              </div>
              <RiskBadge level={loc.risk_level as 'Low' | 'Moderate' | 'High' | 'Critical'} />
            </button>
          ))}
        </div>

        {/* Analysis output */}
        <div className="lg:col-span-2 space-y-4">
          {selected && (
            <>
              <Card>
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h2 className="text-base font-bold text-white">{selected.name}</h2>
                    <p className="text-xs text-slate-500 mt-1">{selected.primary_problem} · Score: {Math.round(selected.priority_score)}/100</p>
                  </div>
                  <button
                    onClick={generateAnalysis}
                    disabled={analyzing}
                    className="btn-primary flex items-center gap-2 disabled:opacity-50"
                  >
                    {analyzing ? <Loader2 size={16} className="animate-spin" /> : <Sparkles size={16} />}
                    {analyzing ? 'Analyzing...' : 'Generate Analysis'}
                  </button>
                </div>
              </Card>

              {analysis ? (
                <>
                  <Card>
                    <div className="flex items-center gap-2 mb-3">
                      <Brain size={18} className="text-accent-400" />
                      <h3 className="text-sm font-semibold text-white">Analysis Summary</h3>
                      <span className={`badge ml-auto ${
                        analysis.confidence === 'High' ? 'bg-green-500/15 text-green-400 border-green-500/30' :
                        analysis.confidence === 'Medium' ? 'bg-yellow-500/15 text-yellow-400 border-yellow-500/30' :
                        'bg-slate-500/15 text-slate-400 border-slate-500/30'
                      }`}>Confidence: {analysis.confidence}</span>
                    </div>
                    <p className="text-sm text-slate-300 leading-relaxed">{analysis.summary}</p>
                  </Card>

                  <Card>
                    <h3 className="text-sm font-semibold text-white mb-3 flex items-center gap-2">
                      <AlertTriangle size={16} className="text-amber-400" />
                      Possible Contributing Factors
                    </h3>
                    <ul className="space-y-2">
                      {analysis.contributing_factors?.split('; ').filter(Boolean).map((f, i) => (
                        <li key={i} className="flex items-start gap-2 text-sm text-slate-300">
                          <span className="text-accent-400 mt-0.5">•</span>
                          <span>{f}</span>
                        </li>
                      ))}
                    </ul>
                    <p className="text-xs text-slate-500 mt-3 italic">Possible contributing factors — not confirmed causation. Requires field verification.</p>
                  </Card>

                  <Card>
                    <h3 className="text-sm font-semibold text-white mb-3 flex items-center gap-2">
                      <CheckCircle size={16} className="text-green-400" />
                      Recommended Next Action
                    </h3>
                    <p className="text-sm text-slate-300">{analysis.suggested_action}</p>
                  </Card>

                  <Card>
                    <h3 className="text-sm font-semibold text-white mb-3 flex items-center gap-2">
                      <Info size={16} className="text-slate-400" />
                      Limitations & Disclaimer
                    </h3>
                    <p className="text-xs text-slate-400">{analysis.limitations}</p>
                  </Card>
                </>
              ) : (
                <Card>
                  <div className="flex flex-col items-center justify-center py-12 text-slate-500">
                    <Brain size={32} className="mb-3 opacity-30" />
                    <p className="text-sm">Click "Generate Analysis" to produce an AI-assisted summary</p>
                    <p className="text-xs mt-2 text-slate-600">Uses a deterministic local analysis function based on historical data</p>
                  </div>
                </Card>
              )}

              {/* Explain Score */}
              {riskScore && (
                <Card>
                  <button
                    onClick={() => setShowScoreExplanation(!showScoreExplanation)}
                    className="w-full flex items-center justify-between"
                  >
                    <h3 className="text-sm font-semibold text-white">Explain Priority Score</h3>
                    <span className="text-xs text-accent-400">{showScoreExplanation ? 'Hide' : 'Show'}</span>
                  </button>
                  {showScoreExplanation && (
                    <div className="mt-4 space-y-2">
                      {[
                        { label: 'Recurrence', val: riskScore.recurrence_score, max: 30, weight: '30%' },
                        { label: 'Severity', val: riskScore.severity_score, max: 20, weight: '20%' },
                        { label: 'Recent Activity', val: riskScore.recent_activity_score, max: 15, weight: '15%' },
                        { label: 'Exposure', val: riskScore.exposure_score, max: 15, weight: '15%' },
                        { label: 'Environmental', val: riskScore.environmental_score, max: 10, weight: '10%' },
                        { label: 'Accessibility', val: riskScore.accessibility_score, max: 10, weight: '10%' },
                      ].map((f) => (
                        <div key={f.label}>
                          <div className="flex items-center justify-between text-xs">
                            <span className="text-slate-400">{f.label} ({f.weight})</span>
                            <span className="text-slate-300">{f.val}/{f.max}</span>
                          </div>
                          <div className="h-1.5 rounded-full bg-white/5 mt-1 overflow-hidden">
                            <div className="h-full rounded-full bg-accent-400" style={{ width: `${(f.val / f.max) * 100}%` }} />
                          </div>
                        </div>
                      ))}
                      <div className="pt-2 border-t border-white/5">
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-white font-semibold">Total Priority Score</span>
                          <span className="text-white font-bold">{Math.round(riskScore.total_score)}/100</span>
                        </div>
                      </div>
                    </div>
                  )}
                </Card>
              )}

              <Disclaimer />
            </>
          )}
        </div>
      </div>
    </div>
  );
}
