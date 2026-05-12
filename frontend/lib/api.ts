export type Hospital = {
  id: string;
  name: string;
  city: string;
  latitude: string | null;
  longitude: string | null;
  wait_minutes: number | null;
  patients_waiting: number | null;
  scraped_at: string | null;
};

export type WaitHistoryPoint = {
  wait_minutes: number;
  patients_waiting: number | null;
  scraped_at: string;
};

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:8000";

export async function getHospitals(): Promise<Hospital[]> {
  try {
    const response = await fetch(`${API_BASE_URL}/hospitals`, { next: { revalidate: 60 } });
    if (!response.ok) {
      return [];
    }
    return response.json();
  } catch {
    return [];
  }
}

export async function getComparison(): Promise<Hospital[]> {
  try {
    const response = await fetch(`${API_BASE_URL}/compare`, { next: { revalidate: 60 } });
    if (!response.ok) {
      return [];
    }
    return response.json();
  } catch {
    return [];
  }
}

export async function getHospital(id: string): Promise<Hospital | null> {
  try {
    const response = await fetch(`${API_BASE_URL}/hospitals/${id}`, { next: { revalidate: 60 } });
    if (!response.ok) {
      return null;
    }
    return response.json();
  } catch {
    return null;
  }
}

export async function getHospitalHistory(id: string): Promise<WaitHistoryPoint[]> {
  try {
    const response = await fetch(`${API_BASE_URL}/hospitals/${id}/history`, { next: { revalidate: 60 } });
    if (!response.ok) {
      return [];
    }
    return response.json();
  } catch {
    return [];
  }
}
