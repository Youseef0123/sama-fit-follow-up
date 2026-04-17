import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

const DB_PATH = path.join(process.cwd(), "db.json");

function readDb(): { weeks: unknown[] } {
  try {
    const raw = fs.readFileSync(DB_PATH, "utf-8");
    return JSON.parse(raw);
  } catch {
    return { weeks: [] };
  }
}

function writeDb(data: { weeks: unknown[] }): void {
  fs.writeFileSync(DB_PATH, JSON.stringify(data, null, 2), "utf-8");
}

export async function GET() {
  const data = readDb();
  return NextResponse.json(data);
}

export async function PUT(request: Request) {
  const body = await request.json();
  writeDb(body);
  return NextResponse.json({ ok: true });
}
