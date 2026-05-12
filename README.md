# Alberta ER Wait Time Predictor

Full-stack ML system for collecting Edmonton emergency department wait times,
building a private historical dataset, and serving 2-hour and 4-hour wait-time
predictions through a public dashboard.

## How data collection works

The scraper runs every 30 minutes through GitHub Actions. Each run fetches the
current AHS wait-time page, parses hospital wait times and patient counts, pulls
current weather, and inserts raw snapshots into PostgreSQL.

That job should run while the rest of the app is being built. Early screens can
show current waits and simple history; the ML model becomes useful once enough
snapshots have accumulated.

For unattended collection, create a cloud PostgreSQL database such as Neon and
add its pooled connection string as a GitHub Actions repository secret named
`DATABASE_URL`. The scheduled workflow applies the schema and then runs the
scraper every 30 minutes.

## Local start

```bash
docker compose up -d postgres redis
python scripts/apply_migrations.py
python scripts/seed_hospitals.py
uvicorn api.main:app --reload
```

In another terminal:

```bash
cd frontend
npm install
npm run dev
```

## Project layers

- `scraper/`: AHS wait-time and weather collection
- `db/`: schema and seed data
- `features/`: lag, rolling, weather, holiday, and cyclical time features
- `models/`: LightGBM training, evaluation, versioning, and drift checks
- `api/`: FastAPI routes for hospitals, predictions, comparisons, and insights
- `workers/`: background jobs for prediction, outcome resolution, and drift
- `frontend/`: Next.js dashboard
