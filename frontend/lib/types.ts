export type Hospital = {
  id: string;
  name: string;
  city: string;
  latitude: string | null;
  longitude: string | null;
  wait_minutes: number | null;
  patients_waiting: number | null;
  scraped_at: string | null;
  previous_wait_minutes?: number | null;
  recent_waits?: number[] | null;
};

export type WaitHistoryPoint = {
  wait_minutes: number;
  patients_waiting: number | null;
  scraped_at: string;
};

export type BestTimeCell = {
  day_index: number;
  hour_bucket: number;
  average_wait: number | null;
  samples: number;
  source?: "exact" | "hour_fallback" | "overall_fallback" | "no_data";
};
