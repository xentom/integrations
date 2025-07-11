import {
  type UsersInfoResponse,
  type UsersListResponse,
  type UsersLookupByEmailResponse,
} from '@slack/web-api';
import * as v from 'valibot';

import * as i from '@acme/integration-framework';

// User ID
export const userId = i.pins.data({
  description: 'A Slack user ID (e.g., U1234567890).',
  control: i.controls.text({
    placeholder: 'U1234567890',
  }),
  schema: v.pipe(v.string(), v.trim(), v.minLength(1)),
});

// User email
export const email = i.pins.data({
  description: 'User email address.',
  control: i.controls.text({
    placeholder: 'user@example.com',
  }),
  schema: v.pipe(v.string(), v.trim(), v.email()),
});

// User presence status
export const presence = i.pins.data({
  description: 'User presence status.',
  control: i.controls.select({
    options: [
      { label: 'Active', value: 'active' },
      { label: 'Away', value: 'away' },
    ],
  }),
  schema: v.picklist(['active', 'away']),
});

// Include deactivated users in lists
export const includeDeactivated = i.pins.data({
  description: 'Include deactivated users in the results.',
  control: i.controls.switch(),
  optional: true,
  schema: v.optional(v.boolean()),
});

// Include deleted users in lists
export const includeDeleted = i.pins.data({
  description: 'Include deleted users in the results.',
  control: i.controls.switch(),
  optional: true,
  schema: v.optional(v.boolean()),
});

// Team ID for Enterprise Grid
export const teamId = i.pins.data({
  description: 'Team ID for Enterprise Grid workspaces.',
  control: i.controls.text({
    placeholder: 'T1234567890',
  }),
  optional: true,
  schema: v.optional(v.pipe(v.string(), v.trim())),
});

// Include locale in user profiles
export const includeLocale = i.pins.data({
  description: 'Include locale information in user profiles.',
  control: i.controls.switch(),
  optional: true,
  schema: v.optional(v.boolean()),
});

// Users list response
export const usersListResponse = i.pins.data<UsersListResponse>({
  description: 'List of users from Slack workspace.',
});

// Single user info response
export const userInfoResponse = i.pins.data<UsersInfoResponse>({
  description: 'Detailed information about a user.',
});

// User lookup by email response
export const userLookupResponse = i.pins.data<UsersLookupByEmailResponse>({
  description: 'User information from email lookup.',
});
