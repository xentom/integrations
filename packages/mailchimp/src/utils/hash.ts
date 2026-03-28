import { createHash } from 'node:crypto'

/**
 * Returns the MD5 hash of a lowercased email address.
 * This is used as the subscriber hash for Mailchimp member API calls.
 */
export function subscriberHash(email: string): string {
  return createHash('md5').update(email.toLowerCase()).digest('hex')
}
