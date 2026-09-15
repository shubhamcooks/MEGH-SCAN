/*
# MEGH-SCAN Seed Data - Incidents, Timeline, Risk Scores, Observations, Rainfall, Datasets, AI Analyses
Inserts all related demo data using subqueries to resolve location IDs by name.
All data is demo/simulated for prototype demonstration.
*/

-- ============ INCIDENTS ============
INSERT INTO incidents (location_id, incident_code, category, description, severity, latitude, longitude, location_name, reported_date, source, verification_status, status, assigned_department)
VALUES
-- GS Road
((SELECT id FROM locations WHERE name = 'GS Road Near Police Bazar'), 'INC-2024-001', 'Waterlogging', 'Heavy waterlogging on GS Road near Police Bazar after 3 hours of continuous rainfall', 'High', 25.5788, 91.8933, 'GS Road Near Police Bazar', '2024-06-15', 'Citizen Report', 'Verified', 'Resolved', 'PWD'),
((SELECT id FROM locations WHERE name = 'GS Road Near Police Bazar'), 'INC-2024-014', 'Waterlogging', 'Recurring waterlogging at same GS Road segment, drainage overflow reported', 'High', 25.5788, 91.8933, 'GS Road Near Police Bazar', '2024-08-20', 'Field Survey', 'Verified', 'In Progress', 'PWD'),
((SELECT id FROM locations WHERE name = 'GS Road Near Police Bazar'), 'INC-2025-003', 'Waterlogging', 'Waterlogging reported again at GS Road after monsoon rain', 'High', 25.5788, 91.8933, 'GS Road Near Police Bazar', '2025-07-12', 'Citizen Report', 'Under Review', 'Reported', 'PWD'),
-- Mawpat
((SELECT id FROM locations WHERE name = 'Mawpat Junction'), 'INC-2023-008', 'Drainage Blockage', 'Major drain blockage at Mawpat junction causing road overflow', 'Critical', 25.6080, 91.8980, 'Mawpat Junction', '2023-07-10', 'Field Survey', 'Verified', 'Reopened', 'Municipal'),
((SELECT id FROM locations WHERE name = 'Mawpat Junction'), 'INC-2024-009', 'Road Damage', 'Potholes and surface damage at Mawpat junction after drain overflow', 'High', 25.6080, 91.8980, 'Mawpat Junction', '2024-07-15', 'Citizen Report', 'Verified', 'In Progress', 'PWD'),
((SELECT id FROM locations WHERE name = 'Mawpat Junction'), 'INC-2025-007', 'Drainage Blockage', 'Drain blockage recurring at Mawpat, same location as 2023', 'Critical', 25.6080, 91.8980, 'Mawpat Junction', '2025-08-01', 'Citizen Report', 'Verified', 'Under Review', 'Municipal'),
-- Laitumkhrah
((SELECT id FROM locations WHERE name = 'Laitumkhrah Main Road'), 'INC-2023-012', 'Road Damage', 'Potholes on Laitumkhrah main road near college area', 'Moderate', 25.5870, 91.8970, 'Laitumkhrah Main Road', '2023-06-20', 'Citizen Report', 'Verified', 'Resolved', 'PWD'),
((SELECT id FROM locations WHERE name = 'Laitumkhrah Main Road'), 'INC-2024-018', 'Road Damage', 'Potholes reappearing at same Laitumkhrah segment after repair', 'Moderate', 25.5870, 91.8970, 'Laitumkhrah Main Road', '2024-06-28', 'Citizen Report', 'Verified', 'In Progress', 'PWD'),
((SELECT id FROM locations WHERE name = 'Laitumkhrah Main Road'), 'INC-2025-011', 'Road Damage', 'Road surface deterioration again at Laitumkhrah', 'High', 25.5870, 91.8970, 'Laitumkhrah Main Road', '2025-06-28', 'Field Survey', 'Verified', 'Reported', 'PWD'),
-- Polo Hills
((SELECT id FROM locations WHERE name = 'Polo Hills Area'), 'INC-2022-005', 'Landslide', 'Minor landslide on Polo Hills slope after heavy rainfall', 'High', 25.5720, 91.8850, 'Polo Hills Area', '2022-07-10', 'Field Survey', 'Verified', 'Resolved', 'Disaster Mgmt'),
((SELECT id FROM locations WHERE name = 'Polo Hills Area'), 'INC-2024-021', 'Landslide', 'Soil erosion and partial slope collapse at Polo Hills', 'Critical', 25.5720, 91.8850, 'Polo Hills Area', '2024-07-20', 'Satellite Data', 'Verified', 'In Progress', 'Disaster Mgmt'),
-- Rilbong
((SELECT id FROM locations WHERE name = 'Rilbong Road Near Bridge'), 'INC-2023-003', 'Waterlogging', 'Severe flooding at Rilbong near bridge, water level rising', 'Critical', 25.5650, 91.8870, 'Rilbong Road Near Bridge', '2023-06-05', 'Citizen Report', 'Verified', 'Reopened', 'Disaster Mgmt'),
((SELECT id FROM locations WHERE name = 'Rilbong Road Near Bridge'), 'INC-2024-006', 'Waterlogging', 'Rilbong bridge area flooded again, traffic halted', 'Critical', 25.5650, 91.8870, 'Rilbong Road Near Bridge', '2024-06-18', 'Citizen Report', 'Verified', 'In Progress', 'PWD'),
((SELECT id FROM locations WHERE name = 'Rilbong Road Near Bridge'), 'INC-2025-009', 'Waterlogging', 'Chronic waterlogging at Rilbong, same recurring issue', 'Critical', 25.5650, 91.8870, 'Rilbong Road Near Bridge', '2025-08-05', 'Citizen Report', 'Verified', 'Reported', 'Disaster Mgmt'),
-- Mawprem
((SELECT id FROM locations WHERE name = 'Mawprem Low-Area'), 'INC-2023-015', 'Waterlogging', 'Mawprem low area flooded, residents affected', 'High', 25.5700, 91.8950, 'Mawprem Low-Area', '2023-07-01', 'Citizen Report', 'Verified', 'Resolved', 'Municipal'),
((SELECT id FROM locations WHERE name = 'Mawprem Low-Area'), 'INC-2024-022', 'Waterlogging', 'Mawprem flooded again, same recurring pattern', 'Critical', 25.5700, 91.8950, 'Mawprem Low-Area', '2024-07-10', 'Citizen Report', 'Verified', 'In Progress', 'Municipal'),
((SELECT id FROM locations WHERE name = 'Mawprem Low-Area'), 'INC-2025-012', 'Waterlogging', 'Mawprem area under water after monsoon rain', 'Critical', 25.5700, 91.8950, 'Mawprem Low-Area', '2025-08-03', 'Citizen Report', 'Under Review', 'Reported', 'Municipal'),
-- Dhankheti
((SELECT id FROM locations WHERE name = 'Dhankheti Market Road'), 'INC-2023-018', 'Drainage Blockage', 'Drain overflow at Dhankheti market road', 'Moderate', 25.5760, 91.8900, 'Dhankheti Market Road', '2023-08-15', 'Citizen Report', 'Verified', 'Resolved', 'Municipal'),
((SELECT id FROM locations WHERE name = 'Dhankheti Market Road'), 'INC-2024-025', 'Waste Accumulation', 'Waste accumulation blocking drain at Dhankheti', 'Moderate', 25.5760, 91.8900, 'Dhankheti Market Road', '2024-07-25', 'Field Survey', 'Verified', 'In Progress', 'Municipal'),
-- Barik
((SELECT id FROM locations WHERE name = 'Barik Junction'), 'INC-2024-011', 'Road Damage', 'Surface damage at Barik junction, multiple potholes', 'High', 25.5800, 91.8950, 'Barik Junction', '2024-07-18', 'Citizen Report', 'Verified', 'In Progress', 'PWD'),
((SELECT id FROM locations WHERE name = 'Barik Junction'), 'INC-2025-014', 'Road Damage', 'Barik junction road damage recurring after repair', 'High', 25.5800, 91.8950, 'Barik Junction', '2025-07-18', 'Citizen Report', 'Under Review', 'Reported', 'PWD'),
-- Lumpyngngad
((SELECT id FROM locations WHERE name = 'Lumpyngngad Bridge Approach'), 'INC-2023-020', 'Erosion', 'Soil erosion at bridge approach, road edge crumbling', 'High', 25.5550, 91.8780, 'Lumpyngngad Bridge Approach', '2023-07-25', 'Field Survey', 'Verified', 'Resolved', 'PWD'),
((SELECT id FROM locations WHERE name = 'Lumpyngngad Bridge Approach'), 'INC-2025-016', 'Erosion', 'Erosion recurring at Lumpyngngad bridge approach', 'High', 25.5550, 91.8780, 'Lumpyngngad Bridge Approach', '2025-07-08', 'Citizen Report', 'Verified', 'Reported', 'PWD'),
-- Additional incidents without specific location
(NULL, 'INC-2025-019', 'Power Disruption', 'Power outage in Laitumkhrah area after storm', 'Moderate', 25.5870, 91.8970, 'Laitumkhrah Area', '2025-07-22', 'Citizen Report', 'Under Review', 'Reported', 'Power Dept'),
(NULL, 'INC-2025-020', 'Waterlogging', 'Waterlogging reported near Ward Lake area', 'Moderate', 25.5730, 91.8910, 'Ward Lake Area', '2025-07-30', 'Citizen Report', 'Unverified', 'Reported', NULL),
(NULL, 'INC-2025-021', 'Drainage Blockage', 'Drain blockage near Motphran junction', 'High', 25.5770, 91.8920, 'Motphran Junction', '2025-08-02', 'Citizen Report', 'Unverified', 'Reported', NULL),
(NULL, 'INC-2025-022', 'Road Damage', 'Potholes on NH-6 near 7th Mile', 'High', 25.6200, 91.9100, 'NH-6 Near 7th Mile', '2025-07-05', 'Field Survey', 'Verified', 'Assigned', 'PWD'),
(NULL, 'INC-2025-023', 'Flooding', 'Flash flood near Umiam bridge area', 'Critical', 25.6300, 91.9200, 'Umiam Bridge Area', '2025-07-14', 'Citizen Report', 'Verified', 'In Progress', 'Disaster Mgmt'),
(NULL, 'INC-2025-024', 'Waste Accumulation', 'Illegal dumping near Mawbah riverside', 'Moderate', 25.5600, 91.8800, 'Mawbah Riverside', '2025-06-10', 'Citizen Report', 'Verified', 'Assigned', 'Municipal'),
(NULL, 'INC-2025-025', 'Water-Supply Disruption', 'Water supply disruption in Nongthymmai', 'Moderate', 25.6100, 91.9050, 'Nongthymmai Area', '2025-05-10', 'Citizen Report', 'Verified', 'Resolved', 'PHE'),
(NULL, 'INC-2025-026', 'Erosion', 'Riverbank erosion at Umshyrpi', 'High', 25.5680, 91.8830, 'Umshyrpi Riverbank', '2025-06-18', 'Field Survey', 'Verified', 'Under Review', 'Disaster Mgmt');

-- ============ LOCATION TIMELINE ============
INSERT INTO location_timeline (location_id, event_date, event_type, category, description, severity, intervention, result, status)
VALUES
-- GS Road timeline
((SELECT id FROM locations WHERE name = 'GS Road Near Police Bazar'), '2019-06-15', 'Observation', 'Waterlogging', 'Initial waterlogging observation recorded at GS Road', 'High', NULL, NULL, 'Recorded'),
((SELECT id FROM locations WHERE name = 'GS Road Near Police Bazar'), '2020-07-20', 'Incident', 'Waterlogging', 'Waterlogging reported again during monsoon', 'High', 'Temporary drainage clearing', 'Issue resolved temporarily', 'Resolved'),
((SELECT id FROM locations WHERE name = 'GS Road Near Police Bazar'), '2021-08-10', 'Incident', 'Drainage Blockage', 'Drain blockage reported at same location', 'Moderate', 'Drain cleaned by municipal team', 'Recurred within 6 months', 'Reopened'),
((SELECT id FROM locations WHERE name = 'GS Road Near Police Bazar'), '2022-06-05', 'Incident', 'Waterlogging', 'Waterlogging reported again after heavy rain', 'High', 'Drainage capacity assessed', 'No permanent fix implemented', 'Recorded'),
((SELECT id FROM locations WHERE name = 'GS Road Near Police Bazar'), '2023-07-15', 'Incident', 'Waterlogging', 'Recurring waterlogging, road partially submerged', 'High', 'Temporary repair', 'Issue recurred in 2024', 'Reopened'),
((SELECT id FROM locations WHERE name = 'GS Road Near Police Bazar'), '2024-06-15', 'Incident', 'Waterlogging', 'Waterlogging at GS Road after 3 hours of rain', 'High', 'Drainage clearing', 'Resolved temporarily', 'Resolved'),
((SELECT id FROM locations WHERE name = 'GS Road Near Police Bazar'), '2024-08-20', 'Incident', 'Waterlogging', 'Drainage overflow reported again', 'High', 'Under assessment', 'In progress', 'In Progress'),
((SELECT id FROM locations WHERE name = 'GS Road Near Police Bazar'), '2025-07-12', 'Observation', 'Waterlogging', 'New waterlogging observation submitted', 'High', NULL, NULL, 'Recorded'),
-- Mawpat timeline
((SELECT id FROM locations WHERE name = 'Mawpat Junction'), '2019-08-03', 'Observation', 'Drainage Blockage', 'Initial drain blockage observation at Mawpat junction', 'High', NULL, NULL, 'Recorded'),
((SELECT id FROM locations WHERE name = 'Mawpat Junction'), '2020-06-15', 'Incident', 'Drainage Blockage', 'Drain blockage recurring at same junction', 'High', 'Drain cleaned', 'Recurred within 1 year', 'Reopened'),
((SELECT id FROM locations WHERE name = 'Mawpat Junction'), '2021-07-20', 'Incident', 'Road Damage', 'Road surface damage from drain overflow', 'Moderate', 'Surface repair', 'Lasted 2 years', 'Resolved'),
((SELECT id FROM locations WHERE name = 'Mawpat Junction'), '2022-08-05', 'Incident', 'Drainage Blockage', 'Drain blockage again at Mawpat', 'Critical', 'Drain reconstruction', 'Partial improvement', 'Reopened'),
((SELECT id FROM locations WHERE name = 'Mawpat Junction'), '2023-07-10', 'Incident', 'Drainage Blockage', 'Major drain blockage causing road overflow', 'Critical', 'Emergency clearing', 'Temporary fix', 'Reopened'),
((SELECT id FROM locations WHERE name = 'Mawpat Junction'), '2024-07-15', 'Incident', 'Road Damage', 'Potholes from drain overflow', 'High', 'Road patching', 'In progress', 'In Progress'),
((SELECT id FROM locations WHERE name = 'Mawpat Junction'), '2025-08-01', 'Incident', 'Drainage Blockage', 'Drain blockage recurring again', 'Critical', NULL, NULL, 'Recorded'),
-- Rilbong timeline
((SELECT id FROM locations WHERE name = 'Rilbong Road Near Bridge'), '2019-06-01', 'Observation', 'Waterlogging', 'Initial waterlogging observation at Rilbong bridge', 'Critical', NULL, NULL, 'Recorded'),
((SELECT id FROM locations WHERE name = 'Rilbong Road Near Bridge'), '2020-06-10', 'Incident', 'Waterlogging', 'Severe flooding at Rilbong bridge', 'Critical', 'Temporary pump deployment', 'Water receded', 'Resolved'),
((SELECT id FROM locations WHERE name = 'Rilbong Road Near Bridge'), '2021-07-05', 'Incident', 'Waterlogging', 'Flooding again at same location', 'Critical', 'Drainage assessment', 'No permanent fix', 'Recorded'),
((SELECT id FROM locations WHERE name = 'Rilbong Road Near Bridge'), '2022-06-20', 'Incident', 'Waterlogging', 'Rilbong under water during monsoon', 'Critical', 'Emergency response', 'Temporary', 'Resolved'),
((SELECT id FROM locations WHERE name = 'Rilbong Road Near Bridge'), '2023-06-05', 'Incident', 'Waterlogging', 'Severe flooding, water level rising', 'Critical', 'Pump deployment', 'Temporary', 'Reopened'),
((SELECT id FROM locations WHERE name = 'Rilbong Road Near Bridge'), '2024-06-18', 'Incident', 'Waterlogging', 'Rilbong bridge area flooded again', 'Critical', 'Under review', 'In progress', 'In Progress'),
((SELECT id FROM locations WHERE name = 'Rilbong Road Near Bridge'), '2025-08-05', 'Incident', 'Waterlogging', 'Chronic waterlogging continues', 'Critical', NULL, NULL, 'Recorded'),
-- Mawprem timeline
((SELECT id FROM locations WHERE name = 'Mawprem Low-Area'), '2019-07-01', 'Observation', 'Waterlogging', 'Initial flooding observation at Mawprem', 'High', NULL, NULL, 'Recorded'),
((SELECT id FROM locations WHERE name = 'Mawprem Low-Area'), '2020-07-10', 'Incident', 'Waterlogging', 'Mawprem flooded during monsoon', 'High', 'Temporary drainage', 'Recurred', 'Reopened'),
((SELECT id FROM locations WHERE name = 'Mawprem Low-Area'), '2021-08-15', 'Incident', 'Waterlogging', 'Flooding again at Mawprem', 'Critical', 'Drainage improvement planned', 'Not implemented', 'Recorded'),
((SELECT id FROM locations WHERE name = 'Mawprem Low-Area'), '2022-07-20', 'Incident', 'Waterlogging', 'Mawprem under water', 'Critical', 'Emergency response', 'Temporary', 'Resolved'),
((SELECT id FROM locations WHERE name = 'Mawprem Low-Area'), '2023-07-01', 'Incident', 'Waterlogging', 'Mawprem flooded, residents affected', 'High', 'Relief provided', 'Temporary', 'Resolved'),
((SELECT id FROM locations WHERE name = 'Mawprem Low-Area'), '2024-07-10', 'Incident', 'Waterlogging', 'Mawprem flooded again, same pattern', 'Critical', 'Under assessment', 'In progress', 'In Progress'),
((SELECT id FROM locations WHERE name = 'Mawprem Low-Area'), '2025-08-03', 'Incident', 'Waterlogging', 'Mawprem area under water', 'Critical', NULL, NULL, 'Recorded'),
-- Polo Hills timeline
((SELECT id FROM locations WHERE name = 'Polo Hills Area'), '2020-07-10', 'Observation', 'Landslide Exposure', 'Initial slope instability observation', 'High', NULL, NULL, 'Recorded'),
((SELECT id FROM locations WHERE name = 'Polo Hills Area'), '2021-08-05', 'Incident', 'Landslide', 'Minor landslide on Polo Hills slope', 'High', 'Slope stabilization', 'Partial improvement', 'Resolved'),
((SELECT id FROM locations WHERE name = 'Polo Hills Area'), '2022-07-10', 'Incident', 'Landslide', 'Minor landslide recurring', 'High', 'Retaining wall assessment', 'Not built', 'Recorded'),
((SELECT id FROM locations WHERE name = 'Polo Hills Area'), '2023-07-25', 'Incident', 'Erosion', 'Soil erosion on slope', 'Moderate', 'Surface protection', 'Temporary', 'Resolved'),
((SELECT id FROM locations WHERE name = 'Polo Hills Area'), '2024-07-20', 'Incident', 'Landslide', 'Soil erosion and partial slope collapse', 'Critical', 'Emergency stabilization', 'In progress', 'In Progress'),
-- Laitumkhrah timeline
((SELECT id FROM locations WHERE name = 'Laitumkhrah Main Road'), '2020-05-20', 'Observation', 'Road Damage', 'Initial pothole observation on Laitumkhrah road', 'Moderate', NULL, NULL, 'Recorded'),
((SELECT id FROM locations WHERE name = 'Laitumkhrah Main Road'), '2021-06-10', 'Incident', 'Road Damage', 'Potholes forming on main road', 'Moderate', 'Surface repair', 'Lasted 1 year', 'Resolved'),
((SELECT id FROM locations WHERE name = 'Laitumkhrah Main Road'), '2022-07-15', 'Incident', 'Road Damage', 'Potholes reappearing', 'Moderate', 'Resurfacing', 'Lasted 1 year', 'Resolved'),
((SELECT id FROM locations WHERE name = 'Laitumkhrah Main Road'), '2023-06-20', 'Incident', 'Road Damage', 'Potholes near college area', 'Moderate', 'Patch repair', 'Temporary', 'Resolved'),
((SELECT id FROM locations WHERE name = 'Laitumkhrah Main Road'), '2024-06-28', 'Incident', 'Road Damage', 'Potholes reappearing after repair', 'Moderate', 'Under assessment', 'In progress', 'In Progress'),
((SELECT id FROM locations WHERE name = 'Laitumkhrah Main Road'), '2025-06-28', 'Incident', 'Road Damage', 'Road surface deterioration again', 'High', NULL, NULL, 'Recorded');

-- ============ RISK SCORES ============
INSERT INTO risk_scores (location_id, recurrence_score, severity_score, exposure_score, recent_activity_score, environmental_score, accessibility_score, total_score, confidence)
VALUES
((SELECT id FROM locations WHERE name = 'GS Road Near Police Bazar'), 26, 16, 13, 13, 8, 6, 82, 'Medium'),
((SELECT id FROM locations WHERE name = 'Mawpat Junction'), 28, 18, 12, 14, 8, 8, 88, 'High'),
((SELECT id FROM locations WHERE name = 'Laitumkhrah Main Road'), 22, 12, 10, 13, 4, 4, 65, 'Medium'),
((SELECT id FROM locations WHERE name = 'Polo Hills Area'), 18, 16, 8, 12, 10, 10, 74, 'Medium'),
((SELECT id FROM locations WHERE name = 'Nongthymmai Stretch'), 12, 10, 10, 8, 6, 12, 58, 'Low'),
((SELECT id FROM locations WHERE name = 'Rilbong Road Near Bridge'), 30, 20, 14, 14, 7, 5, 90, 'High'),
((SELECT id FROM locations WHERE name = 'Malki Point Junction'), 16, 8, 10, 6, 5, 7, 52, 'Low'),
((SELECT id FROM locations WHERE name = 'Lumpyngngad Bridge Approach'), 20, 14, 10, 12, 8, 6, 70, 'Medium'),
((SELECT id FROM locations WHERE name = 'Oakland Road'), 12, 12, 10, 7, 6, 14, 61, 'Low'),
((SELECT id FROM locations WHERE name = 'Mawprem Low-Area'), 27, 18, 14, 14, 7, 5, 85, 'High'),
((SELECT id FROM locations WHERE name = 'Dhankheti Market Road'), 22, 12, 12, 9, 6, 6, 67, 'Medium'),
((SELECT id FROM locations WHERE name = 'Barik Junction'), 20, 14, 12, 12, 5, 9, 72, 'Medium');

-- ============ OBSERVATIONS ============
INSERT INTO observations (location_id, reference_code, submitted_by, email, category, description, latitude, longitude, location_name, severity, observed_date, verification_status, consent_given)
VALUES
((SELECT id FROM locations WHERE name = 'GS Road Near Police Bazar'), 'OBS-2025-001', 'Anonymous', NULL, 'Waterlogging', 'Waterlogging on GS Road after 2 hours of rain, water knee-deep', 25.5788, 91.8933, 'GS Road Near Police Bazar', 'High', '2025-07-12', 'Under Review', true),
((SELECT id FROM locations WHERE name = 'Rilbong Road Near Bridge'), 'OBS-2025-002', 'Anonymous', NULL, 'Waterlogging', 'Rilbong bridge area completely flooded, traffic stopped', 25.5650, 91.8870, 'Rilbong Road Near Bridge', 'Critical', '2025-08-05', 'Verified', true),
((SELECT id FROM locations WHERE name = 'Mawpat Junction'), 'OBS-2025-003', 'Anonymous', NULL, 'Drainage Blockage', 'Drain at Mawpat junction is completely blocked with debris', 25.6080, 91.8980, 'Mawpat Junction', 'Critical', '2025-08-01', 'Verified', true),
((SELECT id FROM locations WHERE name = 'Mawprem Low-Area'), 'OBS-2025-004', 'Anonymous', NULL, 'Waterlogging', 'Mawprem area under water, houses affected', 25.5700, 91.8950, 'Mawprem Low-Area', 'Critical', '2025-08-03', 'Under Review', true),
(NULL, 'OBS-2025-005', 'Anonymous', NULL, 'Road Damage', 'Large potholes on NH-6 near 7th Mile, dangerous for two-wheelers', 25.6200, 91.9100, 'NH-6 Near 7th Mile', 'High', '2025-07-05', 'Verified', true),
(NULL, 'OBS-2025-006', 'Anonymous', NULL, 'Waste Accumulation', 'Garbage piling up near Mawbah riverside, smell is terrible', 25.5600, 91.8800, 'Mawbah Riverside', 'Moderate', '2025-06-10', 'Verified', true),
(NULL, 'OBS-2025-007', 'Anonymous', NULL, 'Waterlogging', 'Waterlogging near Ward Lake after rain', 25.5730, 91.8910, 'Ward Lake Area', 'Moderate', '2025-07-30', 'Unverified', true),
(NULL, 'OBS-2025-008', 'Anonymous', NULL, 'Drainage Blockage', 'Drain near Motphran is overflowing', 25.5770, 91.8920, 'Motphran Junction', 'High', '2025-08-02', 'Unverified', true);

-- ============ RAINFALL RECORDS ============
INSERT INTO rainfall_records (date, location_name, rainfall_mm, source)
VALUES
('2025-01-15', 'Shillong', 12.5, 'IMD (Simulated)'),
('2025-02-15', 'Shillong', 25.3, 'IMD (Simulated)'),
('2025-03-15', 'Shillong', 45.8, 'IMD (Simulated)'),
('2025-04-15', 'Shillong', 85.2, 'IMD (Simulated)'),
('2025-05-15', 'Shillong', 152.7, 'IMD (Simulated)'),
('2025-06-15', 'Shillong', 310.5, 'IMD (Simulated)'),
('2025-07-15', 'Shillong', 425.3, 'IMD (Simulated)'),
('2025-08-15', 'Shillong', 380.1, 'IMD (Simulated)'),
('2025-09-15', 'Shillong', 195.6, 'IMD (Simulated)'),
('2024-06-15', 'Shillong', 285.4, 'IMD (Simulated)'),
('2024-07-15', 'Shillong', 390.2, 'IMD (Simulated)'),
('2024-08-15', 'Shillong', 350.8, 'IMD (Simulated)'),
('2023-06-15', 'Shillong', 270.3, 'IMD (Simulated)'),
('2023-07-15', 'Shillong', 410.5, 'IMD (Simulated)'),
('2023-08-15', 'Shillong', 365.2, 'IMD (Simulated)'),
('2022-06-15', 'Shillong', 260.1, 'IMD (Simulated)'),
('2022-07-15', 'Shillong', 380.7, 'IMD (Simulated)'),
('2022-08-15', 'Shillong', 340.5, 'IMD (Simulated)');

-- ============ DATASETS ============
INSERT INTO datasets (name, type, source, uploaded_by, record_count, data_freshness, is_demo)
VALUES
('Shillong Incident Records 2019-2025', 'Incident Records', 'Demo Data', 'Demo Admin', 30, 'Current', true),
('Shillong Road Network', 'Road Network', 'OpenStreetMap', 'Demo Admin', 450, 'Current', true),
('Shillong Drainage Points', 'Drainage Points', 'Field Survey (Demo)', 'Demo Admin', 85, 'Stale', true),
('Meghalaya Rainfall 2022-2025', 'Rainfall Records', 'IMD (Simulated)', 'Demo Admin', 18, 'Current', true),
('Shillong Elevation Data', 'Elevation/Slope', 'SRTM (Demo)', 'Demo Admin', 1, 'Current', true),
('Citizen Observations 2025', 'Citizen Observations', 'MEGH-SCAN Portal', 'Demo Admin', 8, 'Current', true);

-- ============ AI ANALYSES ============
INSERT INTO ai_analyses (location_id, summary, contributing_factors, suggested_action, confidence, limitations)
VALUES
((SELECT id FROM locations WHERE name = 'Rilbong Road Near Bridge'), 'This location has a repeated history of critical waterlogging observations spanning 6 years. The issue is concentrated during monsoon months and appears to worsen with higher rainfall. The low-lying terrain near the bridge approach likely contributes to water accumulation. Previous temporary interventions have not permanently resolved the issue.', 'Low-lying terrain near bridge approach; Insufficient drainage capacity; High rainfall concentration during monsoon; Previous interventions were temporary only; No permanent drainage infrastructure upgrade recorded', 'Conduct a comprehensive field inspection of drainage infrastructure near the bridge. Assess drainage capacity against peak rainfall data. Consider permanent drainage upgrade or pump installation for monsoon preparedness.', 'High', 'Analysis based on simulated demo data. Requires field verification. Does not constitute an official warning or prediction. Rainfall data is simulated.');