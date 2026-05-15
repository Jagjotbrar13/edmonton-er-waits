import type { BestTimeCell, Hospital, WaitHistoryPoint } from "@/lib/types";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:8000";

async function fetchJson<T>(path: string, revalidate = 60): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${path}`, { next: { revalidate } });
  if (!response.ok) {
    throw new Error(`API request failed: ${path} returned ${response.status}`);
  }
  return response.json() as Promise<T>;
}

export async function getHospitals(): Promise<Hospital[]> {
  return fetchJson<Hospital[]>("/hospitals");
}

export async function getComparison(): Promise<Hospital[]> {
  return fetchJson<Hospital[]>("/compare");
}

export async function getHospital(id: string): Promise<Hospital> {
  return fetchJson<Hospital>(`/hospitals/${id}`);
}

export async function getHospitalHistory(id: string): Promise<WaitHistoryPoint[]> {
  return fetchJson<WaitHistoryPoint[]>(`/hospitals/${id}/history`);
}

export async function getBestTimeHeatmap(id: string): Promise<BestTimeCell[]> {
  const payload = await fetchJson<{ heatmap: BestTimeCell[] }>(`/best-time/${id}`, 300);
  return payload.heatmap;
}
