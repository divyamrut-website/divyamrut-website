import postgres from "postgres";
import type { Lead } from "./types";

/**
 * Persistent lead storage using PostgreSQL.
 *
 * Required environment variable:
 *
 * DATABASE_URL
 */

const databaseUrl = process.env.DATABASE_URL;

if (!databaseUrl) {
  console.warn(
    "[Lead Store] DATABASE_URL is not configured."
  );
}

const sql = databaseUrl
  ? postgres(databaseUrl, {
      prepare: false,
      max: 1,
    })
  : null;

let tableReady: Promise<void> | null = null;

/**
 * Create the database table and sequence if they don't exist.
 */
async function ensureDatabase(): Promise<void> {
  if (!sql) {
    throw new Error(
      "DATABASE_URL is not configured."
    );
  }

  if (!tableReady) {
    tableReady = (async () => {
      // Lead number sequence.
      // Starts at 0 because the API adds +1.
      await sql`
        CREATE SEQUENCE IF NOT EXISTS lead_number_seq
        MINVALUE 0
        START 0
      `;

      // Leads table.
      await sql`
        CREATE TABLE IF NOT EXISTS leads (
          id BIGSERIAL PRIMARY KEY,

          lead_id VARCHAR(20) NOT NULL UNIQUE,

          name TEXT NOT NULL,

          mobile VARCHAR(20) NOT NULL,

          house_building TEXT NOT NULL,

          street_area TEXT NOT NULL,

          locality TEXT NOT NULL,

          district TEXT NOT NULL,

          state TEXT NOT NULL,

          pincode VARCHAR(10) NOT NULL,

          quantity INTEGER NOT NULL,

          product TEXT NOT NULL,

          source TEXT,

          campaign TEXT,

          utm_source TEXT,

          utm_medium TEXT,

          created_at TIMESTAMPTZ NOT NULL,

          status TEXT NOT NULL,

          created_at_db TIMESTAMPTZ NOT NULL DEFAULT NOW()
        )
      `;
    })().catch((error) => {
      tableReady = null;
      throw error;
    });
  }

  await tableReady;
}

/**
 * Get the next lead number.
 */
export async function getNextLeadNumber(): Promise<number> {
  await ensureDatabase();

  if (!sql) {
    throw new Error(
      "DATABASE_URL is not configured."
    );
  }

  const result = await sql`
    SELECT nextval('lead_number_seq') AS number
  `;

  return Number(result[0].number);
}

/**
 * Save a lead permanently to PostgreSQL.
 */
export async function saveLead(
  lead: Lead
): Promise<Lead> {
  await ensureDatabase();

  if (!sql) {
    throw new Error(
      "DATABASE_URL is not configured."
    );
  }

  await sql`
    INSERT INTO leads (
      lead_id,
      name,
      mobile,
      house_building,
      street_area,
      locality,
      district,
      state,
      pincode,
      quantity,
      product,
      source,
      campaign,
      utm_source,
      utm_medium,
      created_at,
      status
    )
    VALUES (
      ${lead.leadId},
      ${lead.name},
      ${lead.mobile},
      ${lead.houseBuilding},
      ${lead.streetArea},
      ${lead.locality},
      ${lead.district},
      ${lead.state},
      ${lead.pincode},
      ${lead.quantity},
      ${lead.product},
      ${lead.source ?? null},
      ${lead.campaign ?? null},
      ${lead.utmSource ?? null},
      ${lead.utmMedium ?? null},
      ${lead.createdAt},
      ${lead.status}
    )
  `;

  console.log(
    `[Lead Store] Lead ${lead.leadId} saved successfully.`
  );

  return lead;
}

/**
 * Format lead ID.
 *
 * Example:
 * DV000001
 * DV000002
 * DV000003
 */
export function formatLeadId(
  n: number
): string {
  return `DV${String(n).padStart(6, "0")}`;
}