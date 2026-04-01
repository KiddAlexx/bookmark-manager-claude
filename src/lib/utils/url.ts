/**
 * Normalizes a URL for duplicate detection.
 * Rules: lowercase, strip protocol, strip www., strip trailing slash.
 */
export function normalizeUrl(url: string): string {
  let normalized = url.trim().toLowerCase()

  // Strip protocol
  normalized = normalized.replace(/^https?:\/\//, "")

  // Strip www.
  normalized = normalized.replace(/^www\./, "")

  // Strip trailing slash
  normalized = normalized.replace(/\/$/, "")

  return normalized
}

/**
 * Returns true if two URLs resolve to the same normalized form.
 */
export function isSameUrl(a: string, b: string): boolean {
  return normalizeUrl(a) === normalizeUrl(b)
}
