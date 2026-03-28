import { run } from '@xentom/integration-framework/testing'

import { describe, expect, type Mock, mock, test } from 'bun:test'
import { type Resend } from 'resend'

import { cancelEmail, getEmail, sendEmail, updateEmail } from './emails'

interface MockResend {
  emails: {
    send: Mock<Resend['emails']['send']>
    get: Mock<Resend['emails']['get']>
    update: Mock<Resend['emails']['update']>
    cancel: Mock<Resend['emails']['cancel']>
  }
}

function createMockResend(
  overrides: Partial<MockResend['emails']> = {},
): MockResend {
  return {
    emails: {
      send: mock<Resend['emails']['send']>(async () => ({
        data: { id: '49a3999c-0ce1-4ea6-ab68-afcd6dc2e794' },
        error: null,
        headers: null,
      })),
      get: mock<Resend['emails']['get']>(async () => ({
        data: {
          id: '49a3999c-0ce1-4ea6-ab68-afcd6dc2e794',
          object: 'email' as const,
          to: ['user@example.com'],
          from: 'Acme <onboarding@resend.dev>',
          created_at: '2023-04-03T22:13:42.000000+00:00',
          subject: 'Test email',
          html: '<p>Hello</p>',
          text: null,
          bcc: null,
          cc: null,
          reply_to: null,
          last_event: 'delivered' as const,
          scheduled_at: null,
        },
        error: null,
        headers: null,
      })),
      update: mock<Resend['emails']['update']>(async () => ({
        data: {
          id: '49a3999c-0ce1-4ea6-ab68-afcd6dc2e794',
          object: 'email' as const,
        },
        error: null,
        headers: null,
      })),
      cancel: mock<Resend['emails']['cancel']>(async () => ({
        data: {
          id: '49a3999c-0ce1-4ea6-ab68-afcd6dc2e794',
          object: 'email' as const,
        },
        error: null,
        headers: null,
      })),
      ...overrides,
    },
  }
}

describe('sendEmail', () => {
  test('sends an email with html content', async () => {
    const resend = createMockResend()

    const result = await run(sendEmail, {
      state: { resend: resend as unknown as Resend },
      inputs: {
        from: 'Acme <onboarding@resend.dev>',
        to: 'user@example.com, admin@example.com',
        subject: 'Hello World',
        html: '<h1>Welcome</h1>',
      },
    })

    expect(result.outputs.id).toBe('49a3999c-0ce1-4ea6-ab68-afcd6dc2e794')
    expect(resend.emails.send).toHaveBeenCalledTimes(1)
  })

  test('sends an email with plain text content', async () => {
    const resend = createMockResend()

    const result = await run(sendEmail, {
      state: { resend: resend as unknown as Resend },
      inputs: {
        from: 'Acme <onboarding@resend.dev>',
        to: 'user@example.com',
        subject: 'Hello World',
        text: 'Welcome to Acme',
      },
    })

    expect(result.outputs.id).toBe('49a3999c-0ce1-4ea6-ab68-afcd6dc2e794')
  })

  test('throws when neither html nor text is provided', async () => {
    const resend = createMockResend()

    await expect(
      run(sendEmail, {
        state: { resend: resend as unknown as Resend },
        inputs: {
          from: 'Acme <onboarding@resend.dev>',
          to: 'user@example.com',
          subject: 'Hello World',
        },
      }),
    ).rejects.toThrow('At least one of html or text must be provided')
  })

  test('throws when the API returns an error', async () => {
    const resend = createMockResend({
      send: mock<Resend['emails']['send']>(async () => ({
        data: null,
        error: {
          message: 'Invalid API key',
          statusCode: 401,
          name: 'invalid_api_key' as const,
        },
        headers: null,
      })),
    })

    await expect(
      run(sendEmail, {
        state: { resend: resend as unknown as Resend },
        inputs: {
          from: 'Acme <onboarding@resend.dev>',
          to: 'user@example.com',
          subject: 'Hello',
          html: '<p>Hello</p>',
        },
      }),
    ).rejects.toThrow('Invalid API key')
  })

  test('passes optional fields to the API', async () => {
    const resend = createMockResend()

    await run(sendEmail, {
      state: { resend: resend as unknown as Resend },
      inputs: {
        from: 'Acme <onboarding@resend.dev>',
        to: 'user@example.com',
        subject: 'Hello World',
        html: '<h1>Hello</h1>',
        cc: 'cc@example.com',
        bcc: 'bcc@example.com',
        replyTo: 'reply@example.com',
        tags: [{ name: 'category', value: 'newsletter' }],
      },
    })

    const callArgs = resend.emails.send.mock.calls[0]
    expect(callArgs?.[0]).toMatchObject({
      from: 'Acme <onboarding@resend.dev>',
      subject: 'Hello World',
      html: '<h1>Hello</h1>',
      tags: [{ name: 'category', value: 'newsletter' }],
    })
  })
})

describe('getEmail', () => {
  test('retrieves an email by ID', async () => {
    const resend = createMockResend()

    const result = await run(getEmail, {
      state: { resend: resend as unknown as Resend },
      inputs: {
        id: '49a3999c-0ce1-4ea6-ab68-afcd6dc2e794',
      },
    })

    expect(result.outputs.email).toMatchObject({
      id: '49a3999c-0ce1-4ea6-ab68-afcd6dc2e794',
      subject: 'Test email',
    })
    expect(resend.emails.get).toHaveBeenCalledWith(
      '49a3999c-0ce1-4ea6-ab68-afcd6dc2e794',
    )
  })

  test('throws when the API returns an error', async () => {
    const resend = createMockResend({
      get: mock<Resend['emails']['get']>(async () => ({
        data: null,
        error: {
          message: 'Email not found',
          statusCode: 404,
          name: 'not_found' as const,
        },
        headers: null,
      })),
    })

    await expect(
      run(getEmail, {
        state: { resend: resend as unknown as Resend },
        inputs: {
          id: '49a3999c-0ce1-4ea6-ab68-afcd6dc2e794',
        },
      }),
    ).rejects.toThrow('Email not found')
  })
})

describe('updateEmail', () => {
  test('updates a scheduled email', async () => {
    const resend = createMockResend()

    const result = await run(updateEmail, {
      state: { resend: resend as unknown as Resend },
      inputs: {
        id: '49a3999c-0ce1-4ea6-ab68-afcd6dc2e794',
        scheduledAt: '2024-10-01T12:00',
      },
    })

    expect(result.outputs.id).toBe('49a3999c-0ce1-4ea6-ab68-afcd6dc2e794')
    expect(resend.emails.update).toHaveBeenCalledWith({
      id: '49a3999c-0ce1-4ea6-ab68-afcd6dc2e794',
      scheduledAt: '2024-10-01T12:00',
    })
  })

  test('throws when the API returns an error', async () => {
    const resend = createMockResend({
      update: mock<Resend['emails']['update']>(async () => ({
        data: null,
        error: {
          message: 'Email cannot be updated',
          statusCode: 422,
          name: 'validation_error' as const,
        },
        headers: null,
      })),
    })

    await expect(
      run(updateEmail, {
        state: { resend: resend as unknown as Resend },
        inputs: {
          id: '49a3999c-0ce1-4ea6-ab68-afcd6dc2e794',
          scheduledAt: '2024-10-01T12:00',
        },
      }),
    ).rejects.toThrow('Email cannot be updated')
  })
})

describe('cancelEmail', () => {
  test('cancels an email by ID', async () => {
    const resend = createMockResend()

    const result = await run(cancelEmail, {
      state: { resend: resend as unknown as Resend },
      inputs: {
        id: '49a3999c-0ce1-4ea6-ab68-afcd6dc2e794',
      },
    })

    expect(result.outputs.id).toBe('49a3999c-0ce1-4ea6-ab68-afcd6dc2e794')
    expect(resend.emails.cancel).toHaveBeenCalledWith(
      '49a3999c-0ce1-4ea6-ab68-afcd6dc2e794',
    )
  })

  test('throws when the API returns an error', async () => {
    const resend = createMockResend({
      cancel: mock<Resend['emails']['cancel']>(async () => ({
        data: null,
        error: {
          message: 'Email not found',
          statusCode: 404,
          name: 'not_found' as const,
        },
        headers: null,
      })),
    })

    await expect(
      run(cancelEmail, {
        state: { resend: resend as unknown as Resend },
        inputs: {
          id: '49a3999c-0ce1-4ea6-ab68-afcd6dc2e794',
        },
      }),
    ).rejects.toThrow('Email not found')
  })
})
