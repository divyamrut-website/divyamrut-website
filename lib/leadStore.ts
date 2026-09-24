import fs from "fs";
import path from "path";
import type { Lead } from "./types";

/**
 * DEMO STORAGE ONLY.
 *
 * This writes leads to a JSON file on disk so the flow works out of the box
 * on `next dev` / a single long-running server. Vercel's serverless functions
 * have an EPHEMERAL, READ-ONLY (outside /tmp) filesystem — data written here
 * will NOT persist reliably in production and will not survive across
 * function instances.
 *
 * Before going live, replace the two functions below with calls to a real
 * database, e.g.:
 *   - Vercel Postgres / Neon / Supabase (recommended — relational, easy dashboard queries)
 *   - PlanetScale (MySQL)
 *   - MongoDB Atlas
 *
 * Keep the exact function signatures (`saveLead`, `getNextLeadNumber`) so the
 * rest of the app doesn't need to change.
 */

const DATA_DIR = path.join(process.cwd(), "data");
const DATA_FILE = path.join(DATA_DIR, "leads.json");

function readAll(): Lead[] {
  try {
    if (!fs.existsSync(DATA_FILE)) return [];
    const raw = fs.readFileSync(DATA_FILE, "utf-8");
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function writeAll(leads: Lead[]) {
  if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });
  fs.writeFileSync(DATA_FILE, JSON.stringify(leads, null, 2), "utf-8");
}

export function getNextLeadNumber(): number {
  const leads = readAll();
  return leads.length + 1;
}

export function saveLead(lead: Lead): Lead {
  const leads = readAll();
  leads.push(lead);
  writeAll(leads);
  return lead;
}

export function formatLeadId(n: number): string {
  return `DV${String(n).padStart(6, "0")}`;
}
