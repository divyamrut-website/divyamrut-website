export function isValidIndianMobile(value: string): boolean {
  const cleaned = value.replace(/[\s-]/g, "").replace(/^\+?91/, "");
  return /^[6-9]\d{9}$/.test(cleaned);
}

export function isValidPincode(value: string): boolean {
  return /^[1-9][0-9]{5}$/.test(value.trim());
}

export function normalizeMobile(value: string): string {
  const cleaned = value.replace(/[\s-]/g, "").replace(/^\+?91/, "");
  return cleaned;
}

export function isNonEmpty(value: string): boolean {
  return value.trim().length > 0;
}
