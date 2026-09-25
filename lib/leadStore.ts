/**
 * Lead ID formatter.
 *
 * Leads are not stored in a database.
 * The website sends lead information directly
 * to the business WhatsApp notification system.
 */

export function formatLeadId(n: number): string {
  return `DV${String(n).padStart(6, "0")}`;
}