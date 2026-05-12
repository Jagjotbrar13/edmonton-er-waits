CREATE EXTENSION IF NOT EXISTS pgcrypto;

CREATE TABLE IF NOT EXISTS hospitals (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL UNIQUE,
    city TEXT NOT NULL DEFAULT 'Edmonton',
    address TEXT,
    latitude NUMERIC(9,6),
    longitude NUMERIC(9,6),
    type TEXT CHECK (type IN ('major', 'community', 'urgent_care')),
    total_beds INT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS wait_snapshots (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    hospital_id UUID NOT NULL REFERENCES hospitals(id) ON DELETE CASCADE,
    wait_minutes INT NOT NULL CHECK (wait_minutes >= 0),
    patients_waiting INT CHECK (patients_waiting >= 0),
    scraped_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_wait_snapshots_hospital_time
    ON wait_snapshots (hospital_id, scraped_at DESC);

CREATE TABLE IF NOT EXISTS weather_snapshots (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    city TEXT NOT NULL DEFAULT 'Edmonton',
    temperature_c NUMERIC(5,2),
    precipitation_mm NUMERIC(5,2),
    wind_kph NUMERIC(5,2),
    condition TEXT,
    recorded_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_weather_snapshots_city_time
    ON weather_snapshots (city, recorded_at DESC);

CREATE TABLE IF NOT EXISTS predictions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    hospital_id UUID NOT NULL REFERENCES hospitals(id) ON DELETE CASCADE,
    predicted_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    target_time TIMESTAMPTZ NOT NULL,
    horizon_hours INT NOT NULL CHECK (horizon_hours IN (2, 4)),
    predicted_wait INT NOT NULL CHECK (predicted_wait >= 0),
    lower_bound INT CHECK (lower_bound >= 0),
    upper_bound INT CHECK (upper_bound >= 0),
    model_version TEXT NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_predictions_hospital_target
    ON predictions (hospital_id, target_time DESC);

CREATE TABLE IF NOT EXISTS prediction_outcomes (
    prediction_id UUID PRIMARY KEY REFERENCES predictions(id) ON DELETE CASCADE,
    actual_wait INT NOT NULL CHECK (actual_wait >= 0),
    error_minutes INT NOT NULL,
    abs_error_minutes INT NOT NULL CHECK (abs_error_minutes >= 0),
    resolved_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS model_metrics (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    model_version TEXT NOT NULL,
    horizon_hours INT NOT NULL CHECK (horizon_hours IN (2, 4)),
    evaluated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    rmse NUMERIC(8,4),
    mae NUMERIC(8,4),
    mape NUMERIC(8,4),
    sample_size INT NOT NULL CHECK (sample_size >= 0)
);
