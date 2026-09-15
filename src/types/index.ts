export type UserRole = 'admin' | 'planner' | 'public' | 'disaster';

export interface DemoUser {
  name: string;
  role: UserRole;
}

export type RiskLevel = 'Low' | 'Moderate' | 'High' | 'Critical';

export interface Location {
  id: string;
  name: string;
  district: string;
  latitude: number;
  longitude: number;
  description: string | null;
  primary_problem: string;
  priority_score: number;
  risk_level: RiskLevel;
  recurrence_count: number;
  first_recorded: string | null;
  last_incident_date: string | null;
  inspection_status: string;
  created_at: string;
  updated_at: string;
}

export interface Incident {
  id: string;
  location_id: string | null;
  incident_code: string | null;
  category: string;
  description: string | null;
  severity: string;
  latitude: number | null;
  longitude: number | null;
  location_name: string | null;
  reported_date: string;
  source: string;
  verification_status: string;
  status: string;
  assigned_department: string | null;
  notes: string | null;
  created_at: string;
  updated_at: string;
}

export interface TimelineEvent {
  id: string;
  location_id: string;
  incident_id: string | null;
  event_date: string;
  event_type: string;
  category: string | null;
  description: string | null;
  severity: string | null;
  intervention: string | null;
  result: string | null;
  status: string;
  created_at: string;
}

export interface RiskScore {
  id: string;
  location_id: string;
  recurrence_score: number;
  severity_score: number;
  exposure_score: number;
  recent_activity_score: number;
  environmental_score: number;
  accessibility_score: number;
  total_score: number;
  confidence: string;
  calculated_at: string;
}

export interface Observation {
  id: string;
  location_id: string | null;
  reference_code: string | null;
  submitted_by: string;
  email: string | null;
  category: string;
  description: string | null;
  latitude: number | null;
  longitude: number | null;
  location_name: string | null;
  severity: string;
  observed_date: string;
  photo_url: string | null;
  verification_status: string;
  consent_given: boolean;
  created_at: string;
}

export interface RainfallRecord {
  id: string;
  date: string;
  location_name: string;
  rainfall_mm: number;
  source: string;
  created_at: string;
}

export interface Dataset {
  id: string;
  name: string;
  type: string;
  source: string | null;
  uploaded_by: string;
  record_count: number;
  data_freshness: string;
  is_demo: boolean;
  created_at: string;
}

export interface AiAnalysis {
  id: string;
  location_id: string;
  summary: string | null;
  contributing_factors: string | null;
  suggested_action: string | null;
  confidence: string;
  limitations: string | null;
  created_at: string;
}

export const RISK_COLORS: Record<RiskLevel, string> = {
  Low: '#22c55e',
  Moderate: '#eab308',
  High: '#f97316',
  Critical: '#ef4444',
};

export const RISK_BG: Record<RiskLevel, string> = {
  Low: 'bg-green-500/15 text-green-400 border-green-500/30',
  Moderate: 'bg-yellow-500/15 text-yellow-400 border-yellow-500/30',
  High: 'bg-orange-500/15 text-orange-400 border-orange-500/30',
  Critical: 'bg-red-500/15 text-red-400 border-red-500/30',
};

export const INCIDENT_CATEGORIES = [
  'Waterlogging',
  'Drainage Blockage',
  'Road Damage',
  'Landslide',
  'Waste Accumulation',
  'Water-Supply Disruption',
  'Power Disruption',
  'Flooding',
  'Erosion',
  'Other',
] as const;

export const OBSERVATION_CATEGORIES = [
  'Pothole/Road Damage',
  'Waterlogging',
  'Drainage Blockage',
  'Garbage Hotspot',
  'Landslide or Soil Erosion',
  'Water-Supply Problem',
  'Streetlight/Power Issue',
  'Other',
] as const;

export const INCIDENT_STATUSES = [
  'Reported',
  'Under Review',
  'Verified',
  'Assigned',
  'In Progress',
  'Resolved',
  'Reopened',
  'Rejected',
] as const;

export const SEVERITIES = ['Low', 'Moderate', 'High', 'Critical'] as const;
