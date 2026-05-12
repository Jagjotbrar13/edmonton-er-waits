INSERT INTO hospitals (name, city, address, latitude, longitude, type, total_beds)
VALUES
    ('Royal Alexandra Hospital', 'Edmonton', '10240 Kingsway NW, Edmonton, AB', 53.557600, -113.496100, 'major', 869),
    ('University of Alberta Hospital', 'Edmonton', '8440 112 St NW, Edmonton, AB', 53.520000, -113.525600, 'major', 885),
    ('Misericordia Community Hospital', 'Edmonton', '16940 87 Ave NW, Edmonton, AB', 53.520900, -113.612700, 'community', 309),
    ('Grey Nuns Community Hospital', 'Edmonton', '1100 Youville Dr W NW, Edmonton, AB', 53.462300, -113.428900, 'community', 332),
    ('Northeast Community Health Centre', 'Edmonton', '14007 50 St NW, Edmonton, AB', 53.602400, -113.417100, 'urgent_care', NULL)
ON CONFLICT (name) DO NOTHING;
