import { Week } from "./types";

const BIN_ID = process.env.NEXT_PUBLIC_JSONBIN_BIN_ID;
const API_KEY = process.env.NEXT_PUBLIC_JSONBIN_API_KEY;

function getBaseUrl(): string {
  if (!BIN_ID) {
    throw new Error("Missing NEXT_PUBLIC_JSONBIN_BIN_ID");
  }
  return `https://api.jsonbin.io/v3/b/${BIN_ID}`;
}

function getHeaders(includeContentType = false): HeadersInit {
  if (!API_KEY) {
    throw new Error("Missing NEXT_PUBLIC_JSONBIN_API_KEY");
  }

  return {
    ...(includeContentType ? { "Content-Type": "application/json" } : {}),
    "X-Master-Key": API_KEY,
  };
}

interface JsonBinRecord {
  weeks?: Week[];
}

interface JsonBinResponse {
  record?: JsonBinRecord;
}

export async function fetchData(): Promise<{ weeks: Week[] }> {
  const res = await fetch(`${getBaseUrl()}/latest`, {
    headers: getHeaders(),
    cache: "no-store",
  });

  if (!res.ok) {
    throw new Error(`JSONBin read failed: ${res.status}`);
  }

  const json = (await res.json()) as JsonBinResponse;
  return {
    weeks: Array.isArray(json.record?.weeks) ? json.record.weeks : [],
  };
}

export async function saveData(data: { weeks: Week[] }): Promise<void> {
  const res = await fetch(getBaseUrl(), {
    method: "PUT",
    headers: getHeaders(true),
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    throw new Error(`JSONBin write failed: ${res.status}`);
  }
}
