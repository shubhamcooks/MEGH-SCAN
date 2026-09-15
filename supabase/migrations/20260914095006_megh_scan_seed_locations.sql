/*
# MEGH-SCAN Seed Data - Locations
Inserts 12 monitored locations across Shillong with realistic coordinates.
All data is demo/simulated for prototype demonstration.
*/

INSERT INTO locations (name, district, latitude, longitude, description, primary_problem, priority_score, risk_level, recurrence_count, first_recorded, last_incident_date, inspection_status)
VALUES
('GS Road Near Police Bazar', 'East Khasi Hills', 25.5788, 91.8933, 'Major commercial road segment prone to waterlogging during monsoon', 'Waterlogging', 82, 'High', 7, '2019-06-15', '2025-07-12', 'Inspection Recommended'),
('Mawpat Junction', 'East Khasi Hills', 25.6080, 91.8980, 'Junction with recurring drainage blockage and road damage', 'Drainage Blockage', 88, 'Critical', 9, '2019-08-03', '2025-08-01', 'Inspection Required'),
('Laitumkhrah Main Road', 'East Khasi Hills', 25.5870, 91.8970, 'Road segment with repeated pothole formation', 'Road Damage', 65, 'High', 5, '2020-05-20', '2025-06-28', 'Pending'),
('Polo Hills Area', 'East Khasi Hills', 25.5720, 91.8850, 'Slope area with landslide exposure during heavy rainfall', 'Landslide Exposure', 74, 'High', 4, '2020-07-10', '2025-07-20', 'Monitoring'),
('Nongthymmai Stretch', 'East Khasi Hills', 25.6100, 91.9050, 'Road stretch with water-supply disruption issues', 'Water-Supply Disruption', 58, 'Moderate', 3, '2021-03-15', '2025-05-10', 'Pending'),
('Rilbong Road Near Bridge', 'East Khasi Hills', 25.5650, 91.8870, 'Low-lying area near bridge with chronic waterlogging', 'Waterlogging', 90, 'Critical', 11, '2019-06-01', '2025-08-05', 'Inspection Required'),
('Malki Point Junction', 'East Khasi Hills', 25.5750, 91.9000, 'Junction with waste accumulation and drainage issues', 'Waste Accumulation', 52, 'Moderate', 4, '2020-09-12', '2025-07-15', 'Pending'),
('Lumpyngngad Bridge Approach', 'East Khasi Hills', 25.5550, 91.8780, 'Bridge approach road with erosion and surface damage', 'Erosion', 70, 'High', 5, '2020-06-20', '2025-07-08', 'Inspection Recommended'),
('Oakland Road', 'East Khasi Hills', 25.5900, 91.9020, 'Residential road with drainage and waterlogging problems', 'Drainage Blockage', 61, 'Moderate', 3, '2021-07-05', '2025-06-15', 'Pending'),
('Mawprem Low-Area', 'East Khasi Hills', 25.5700, 91.8950, 'Low-lying residential area with chronic flooding', 'Waterlogging', 85, 'Critical', 8, '2019-07-01', '2025-08-03', 'Inspection Required'),
('Dhankheti Market Road', 'East Khasi Hills', 25.5760, 91.8900, 'Market road with recurring drainage and waste issues', 'Drainage Blockage', 67, 'High', 6, '2019-09-15', '2025-07-25', 'Monitoring'),
('Barik Junction', 'East Khasi Hills', 25.5800, 91.8950, 'Major junction with multiple recurring problems', 'Road Damage', 72, 'High', 5, '2020-04-10', '2025-07-18', 'Inspection Recommended');