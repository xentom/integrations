import { describe, expect, test } from 'bun:test'

import * as email from './email'

async function validate(pin: { schema?: any }, value: unknown) {
  const schema = pin.schema
  if (!schema || typeof schema !== 'object' || !('~standard' in schema)) {
    throw new Error('Pin has no standard schema (may be a dynamic schema)')
  }
  return (await schema['~standard'].validate(value)) as {
    value?: unknown
    issues?: unknown[]
  }
}

describe('email.address', () => {
  test('accepts a valid email', async () => {
    const result = await validate(email.address, 'user@example.com')
    expect(result.issues).toBeUndefined()
    expect(result.value).toBe('user@example.com')
  })

  test('trims whitespace', async () => {
    const result = await validate(email.address, '  user@example.com  ')
    expect(result.issues).toBeUndefined()
    expect(result.value).toBe('user@example.com')
  })

  test('rejects an invalid email', async () => {
    const result = await validate(email.address, 'not-an-email')
    expect(result.issues).toBeDefined()
  })

  test('rejects an empty string', async () => {
    const result = await validate(email.address, '')
    expect(result.issues).toBeDefined()
  })
})

describe('email.addressWithDisplayName', () => {
  test('accepts "Name <email@domain.com>" format', async () => {
    const result = await validate(
      email.addressWithDisplayName,
      'John Doe <john@example.com>',
    )
    expect(result.issues).toBeUndefined()
  })

  test('rejects a plain email address', async () => {
    const result = await validate(
      email.addressWithDisplayName,
      'john@example.com',
    )
    expect(result.issues).toBeDefined()
  })
})

describe('email.addresses', () => {
  test('splits comma-separated emails into an array', async () => {
    const result = await validate(
      email.addresses,
      'a@example.com,b@example.com',
    )
    expect(result.issues).toBeUndefined()
    expect(result.value).toEqual(['a@example.com', 'b@example.com'])
  })

  test('accepts a single email as a string', async () => {
    const result = await validate(email.addresses, 'user@example.com')
    expect(result.issues).toBeUndefined()
    expect(result.value).toEqual(['user@example.com'])
  })
})

describe('email.subject', () => {
  test('accepts any string', async () => {
    const result = await validate(email.subject, 'Hello World')
    expect(result.issues).toBeUndefined()
    expect(result.value).toBe('Hello World')
  })
})

describe('email.tags', () => {
  test('accepts valid tag arrays', async () => {
    const result = await validate(email.tags, [
      { name: 'category', value: 'newsletter' },
    ])
    expect(result.issues).toBeUndefined()
  })

  test('rejects tags with invalid characters', async () => {
    const result = await validate(email.tags, [
      { name: 'invalid name!', value: 'ok' },
    ])
    expect(result.issues).toBeDefined()
  })
})
