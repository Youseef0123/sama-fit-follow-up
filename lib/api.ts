import { Week } from "./types";

interface DataResponse {
  weeks?: Week[];
}

export async function fetchData(): Promise<{ weeks: Week[] }> {
  const res = await fetch("/api/data", {
    cache: "no-store",
  });

  if (!res.ok) {
    throw new Error(`Data read failed: ${res.status}`);
  }

  const json = (await res.json()) as DataResponse;
  return {
    weeks: Array.isArray(json.weeks) ? json.weeks : [],
  };
}

export async function saveData(data: { weeks: Week[] }): Promise<void> {
  const res = await fetch("/api/data", {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    throw new Error(`Data write failed: ${res.status}`);
  }
}
