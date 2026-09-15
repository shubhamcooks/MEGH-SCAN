/*
# MEGH-SCAN Database Schema

## Overview
Creates the complete database schema for MEGH-SCAN, a geospatial intelligence platform for Meghalaya.
This is a demo/prototype application with demo authentication (no real Supabase Auth).
All tables use anon+authenticated policies so the demo frontend can read/write data.

## Tables Created
1. **locations** - Monitored geographic locations with problem tracking
2. **incidents** - Infrastructure incident records linked to locations
3. **location_timeline** - Historical timeline events per location (Problem Memory)
4. **risk_scores** - Computed risk/priority scores with factor breakdowns
5. **observations** - Citizen-submitted infrastructure observations
6. **rainfall_records** - Rainfall data by location and date
7. **datasets** - Uploaded dataset metadata
8. **ai_analyses** - AI-assisted analysis results per location

## Security
- RLS enabled on all tables
- All tables allow anon+authenticated CRUD (demo app, no real auth)
- Data is intentionally public/shared for the prototype
*/

-- ============ LOCATIONS ============
CREATE TABLE IF NOT EXISTS locations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  district text NOT NULL DEFAULT 'East Khasi Hills',
  latitude double precision NOT NULL,
  longitude double precision NOT NULL,
  description text,
  primary_problem text NOT NULL DEFAULT 'Other',
  priority_score double precision NOT NULL DEFAULT 0,
  risk_level text NOT NULL DEFAULT 'Low',
  recurrence_count integer NOT NULL DEFAULT 0,
  first_recorded date,
  last_incident_date date,
  inspection_status text NOT NULL DEFAULT 'Pending',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE locations ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "anon_select_locations" ON locations;
CREATE POLICY "anon_select_locations" ON locations FOR SELECT
  TO anon, authenticated USING (true);
DROP POLICY IF EXISTS "anon_insert_locations" ON locations;
CREATE POLICY "anon_insert_locations" ON locations FOR INSERT
  TO anon, authenticated WITH CHECK (true);
DROP POLICY IF EXISTS "anon_update_locations" ON locations;
CREATE POLICY "anon_update_locations" ON locations FOR UPDATE
  TO anon, authenticated USING (true) WITH CHECK (true);
DROP POLICY IF EXISTS "anon_delete_locations" ON locations;
CREATE POLICY "anon_delete_locations" ON locations FOR DELETE
  TO anon, authenticated USING (true);

-- ============ INCIDENTS ============
CREATE TABLE IF NOT EXISTS incidents (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  location_id uuid REFERENCES locations(id) ON DELETE SET NULL,
  incident_code text UNIQUE,
  category text NOT NULL,
  description text,
  severity text NOT NULL DEFAULT 'Moderate',
  latitude double precision,
  longitude double precision,
  location_name text,
  reported_date date NOT NULL DEFAULT CURRENT_DATE,
  source text NOT NULL DEFAULT 'Citizen Report',
  verification_status text NOT NULL DEFAULT 'Unverified',
  status text NOT NULL DEFAULT 'Reported',
  assigned_department text,
  notes text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE incidents ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "anon_select_incidents" ON incidents;
CREATE POLICY "anon_select_incidents" ON incidents FOR SELECT
  TO anon, authenticated USING (true);
DROP POLICY IF EXISTS "anon_insert_incidents" ON incidents;
CREATE POLICY "anon_insert_incidents" ON incidents FOR INSERT
  TO anon, authenticated WITH CHECK (true);
DROP POLICY IF EXISTS "anon_update_incidents" ON incidents;
CREATE POLICY "anon_update_incidents" ON incidents FOR UPDATE
  TO anon, authenticated USING (true) WITH CHECK (true);
DROP POLICY IF EXISTS "anon_delete_incidents" ON incidents;
CREATE POLICY "anon_delete_incidents" ON incidents FOR DELETE
  TO anon, authenticated USING (true);

-- ============ LOCATION TIMELINE ============
CREATE TABLE IF NOT EXISTS location_timeline (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  location_id uuid NOT NULL REFERENCES locations(id) ON DELETE CASCADE,
  incident_id uuid REFERENCES incidents(id) ON DELETE SET NULL,
  event_date date NOT NULL,
  event_type text NOT NULL,
  category text,
  description text,
  severity text,
  intervention text,
  result text,
  status text DEFAULT 'Recorded',
  created_at timestamptz DEFAULT now()
);

ALTER TABLE location_timeline ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "anon_select_timeline" ON location_timeline;
CREATE POLICY "anon_select_timeline" ON location_timeline FOR SELECT
  TO anon, authenticated USING (true);
DROP POLICY IF EXISTS "anon_insert_timeline" ON location_timeline;
CREATE POLICY "anon_insert_timeline" ON location_timeline FOR INSERT
  TO anon, authenticated WITH CHECK (true);
DROP POLICY IF EXISTS "anon_update_timeline" ON location_timeline;
CREATE POLICY "anon_update_timeline" ON location_timeline FOR UPDATE
  TO anon, authenticated USING (true) WITH CHECK (true);
DROP POLICY IF EXISTS "anon_delete_timeline" ON location_timeline;
CREATE POLICY "anon_delete_timeline" ON location_timeline FOR DELETE
  TO anon, authenticated USING (true);

-- ============ RISK SCORES ============
CREATE TABLE IF NOT EXISTS risk_scores (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  location_id uuid NOT NULL REFERENCES locations(id) ON DELETE CASCADE,
  recurrence_score double precision NOT NULL DEFAULT 0,
  severity_score double precision NOT NULL DEFAULT 0,
  exposure_score double precision NOT NULL DEFAULT 0,
  recent_activity_score double precision NOT NULL DEFAULT 0,
  environmental_score double precision NOT NULL DEFAULT 0,
  accessibility_score double precision NOT NULL DEFAULT 0,
  total_score double precision NOT NULL DEFAULT 0,
  confidence text NOT NULL DEFAULT 'Medium',
  calculated_at timestamptz DEFAULT now()
);

ALTER TABLE risk_scores ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "anon_select_risk_scores" ON risk_scores;
CREATE POLICY "anon_select_risk_scores" ON risk_scores FOR SELECT
  TO anon, authenticated USING (true);
DROP POLICY IF EXISTS "anon_insert_risk_scores" ON risk_scores;
CREATE POLICY "anon_insert_risk_scores" ON risk_scores FOR INSERT
  TO anon, authenticated WITH CHECK (true);
DROP POLICY IF EXISTS "anon_update_risk_scores" ON risk_scores;
CREATE POLICY "anon_update_risk_scores" ON risk_scores FOR UPDATE
  TO anon, authenticated USING (true) WITH CHECK (true);
DROP POLICY IF EXISTS "anon_delete_risk_scores" ON risk_scores;
CREATE POLICY "anon_delete_risk_scores" ON risk_scores FOR DELETE
  TO anon, authenticated USING (true);

-- ============ OBSERVATIONS ============
CREATE TABLE IF NOT EXISTS observations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  location_id uuid REFERENCES locations(id) ON DELETE SET NULL,
  reference_code text UNIQUE,
  submitted_by text DEFAULT 'Anonymous',
  email text,
  category text NOT NULL,
  description text,
  latitude double precision,
  longitude double precision,
  location_name text,
  severity text NOT NULL DEFAULT 'Moderate',
  observed_date date DEFAULT CURRENT_DATE,
  photo_url text,
  verification_status text NOT NULL DEFAULT 'Unverified',
  consent_given boolean NOT NULL DEFAULT false,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE observations ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "anon_select_observations" ON observations;
CREATE POLICY "anon_select_observations" ON observations FOR SELECT
  TO anon, authenticated USING (true);
DROP POLICY IF EXISTS "anon_insert_observations" ON observations;
CREATE POLICY "anon_insert_observations" ON observations FOR INSERT
  TO anon, authenticated WITH CHECK (true);
DROP POLICY IF EXISTS "anon_update_observations" ON observations;
CREATE POLICY "anon_update_observations" ON observations FOR UPDATE
  TO anon, authenticated USING (true) WITH CHECK (true);
DROP POLICY IF EXISTS "anon_delete_observations" ON observations;
CREATE POLICY "anon_delete_observations" ON observations FOR DELETE
  TO anon, authenticated USING (true);

-- ============ RAINFALL RECORDS ============
CREATE TABLE IF NOT EXISTS rainfall_records (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  date date NOT NULL,
  location_name text NOT NULL,
  rainfall_mm double precision NOT NULL,
  source text NOT NULL DEFAULT 'IMD (Simulated)',
  created_at timestamptz DEFAULT now()
);

ALTER TABLE rainfall_records ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "anon_select_rainfall" ON rainfall_records;
CREATE POLICY "anon_select_rainfall" ON rainfall_records FOR SELECT
  TO anon, authenticated USING (true);
DROP POLICY IF EXISTS "anon_insert_rainfall" ON rainfall_records;
CREATE POLICY "anon_insert_rainfall" ON rainfall_records FOR INSERT
  TO anon, authenticated WITH CHECK (true);
DROP POLICY IF EXISTS "anon_delete_rainfall" ON rainfall_records;
CREATE POLICY "anon_delete_rainfall" ON rainfall_records FOR DELETE
  TO anon, authenticated USING (true);

-- ============ DATASETS ============
CREATE TABLE IF NOT EXISTS datasets (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  type text NOT NULL,
  source text,
  uploaded_by text DEFAULT 'Demo Admin',
  record_count integer DEFAULT 0,
  data_freshness text DEFAULT 'Current',
  is_demo boolean DEFAULT true,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE datasets ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "anon_select_datasets" ON datasets;
CREATE POLICY "anon_select_datasets" ON datasets FOR SELECT
  TO anon, authenticated USING (true);
DROP POLICY IF EXISTS "anon_insert_datasets" ON datasets;
CREATE POLICY "anon_insert_datasets" ON datasets FOR INSERT
  TO anon, authenticated WITH CHECK (true);
DROP POLICY IF EXISTS "anon_update_datasets" ON datasets;
CREATE POLICY "anon_update_datasets" ON datasets FOR UPDATE
  TO anon, authenticated USING (true) WITH CHECK (true);
DROP POLICY IF EXISTS "anon_delete_datasets" ON datasets;
CREATE POLICY "anon_delete_datasets" ON datasets FOR DELETE
  TO anon, authenticated USING (true);

-- ============ AI ANALYSES ============
CREATE TABLE IF NOT EXISTS ai_analyses (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  location_id uuid NOT NULL REFERENCES locations(id) ON DELETE CASCADE,
  summary text,
  contributing_factors text,
  suggested_action text,
  confidence text DEFAULT 'Medium',
  limitations text,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE ai_analyses ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "anon_select_ai_analyses" ON ai_analyses;
CREATE POLICY "anon_select_ai_analyses" ON ai_analyses FOR SELECT
  TO anon, authenticated USING (true);
DROP POLICY IF EXISTS "anon_insert_ai_analyses" ON ai_analyses;
CREATE POLICY "anon_insert_ai_analyses" ON ai_analyses FOR INSERT
  TO anon, authenticated WITH CHECK (true);
DROP POLICY IF EXISTS "anon_delete_ai_analyses" ON ai_analyses;
CREATE POLICY "anon_delete_ai_analyses" ON ai_analyses FOR DELETE
  TO anon, authenticated USING (true);

-- ============ INDEXES ============
CREATE INDEX IF NOT EXISTS idx_incidents_location_id ON incidents(location_id);
CREATE INDEX IF NOT EXISTS idx_incidents_category ON incidents(category);
CREATE INDEX IF NOT EXISTS idx_incidents_status ON incidents(status);
CREATE INDEX IF NOT EXISTS idx_timeline_location_id ON location_timeline(location_id);
CREATE INDEX IF NOT EXISTS idx_risk_scores_location_id ON risk_scores(location_id);
CREATE INDEX IF NOT EXISTS idx_observations_location_id ON observations(location_id);
CREATE INDEX IF NOT EXISTS idx_rainfall_date ON rainfall_records(date);
