/**
 * Helpers for Vietnamese phone numbers.
 * Normalizes user input into 10-digit format starting with 0 and validates it.
 */
export function normalizeVNPhone(input: string): string {
  const digitsOnly = (input || "").replace(/\D/g, "")
  let normalized = digitsOnly

  // Remove international dialing prefix if present (e.g. 0084...)
  if (normalized.startsWith("00")) {
    normalized = normalized.slice(2)
  }

  // Convert country code prefix to local leading zero
  if (normalized.startsWith("84")) {
    normalized = `0${normalized.slice(2)}`
  } else if (normalized.length === 9 && !normalized.startsWith("0")) {
    // Handle inputs missing the leading zero
    normalized = `0${normalized}`
  }

  return normalized
}

export function isValidVNPhone(phone: string): boolean {
  const normalized = normalizeVNPhone(phone)
  return /^0\d{9}$/.test(normalized)
}
