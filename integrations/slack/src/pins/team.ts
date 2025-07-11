import {
  type TeamAccessLogsResponse,
  type TeamBillableInfoResponse,
  type TeamInfoResponse,
} from '@slack/web-api';
import * as v from 'valibot';

import * as i from '@acme/integration-framework';

// Team ID
export const teamId = i.pins.data({
  description: 'Slack team/workspace ID.',
  control: i.controls.text({
    placeholder: 'T1234567890',
  }),
  schema: v.pipe(v.string(), v.trim()),
});

// Before timestamp for access logs
export const before = i.pins.data({
  description: 'End of time range for access logs.',
  control: i.controls.text({
    placeholder: '1234567890',
  }),
  schema: v.pipe(v.string(), v.transform(Number)),
});

// Team responses
export const teamInfoResponse = i.pins.data<TeamInfoResponse>({
  description: 'Response containing team information.',
});

export const accessLogsResponse = i.pins.data<TeamAccessLogsResponse>({
  description: 'Response containing team access logs.',
});

export const billableInfoResponse = i.pins.data<TeamBillableInfoResponse>({
  description: 'Response containing billable information.',
});
