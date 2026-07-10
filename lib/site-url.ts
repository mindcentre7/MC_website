/** Primary site URL — mindcentre.sg ranks #1 on Google for Serangoon tuition. */
export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ||
  process.env.URL ||
  process.env.DEPLOY_PRIME_URL ||
  'https://www.mindcentre.sg'

/** Wix mirror site — keep linked for cross-domain authority. */
export const MIRROR_SITE_URL = 'https://www.mindcentre.com.sg'

export function absoluteUrl(path = ''): string {
  const base = SITE_URL.replace(/\/$/, '')
  if (!path) return base
  return `${base}${path.startsWith('/') ? path : `/${path}`}`
}