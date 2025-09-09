import * as i from '@xentom/integration-framework';
import * as v from 'valibot';

import { type gmail_v1 } from 'googleapis';

export const item = i.pins.data<gmail_v1.Schema$Label>({
  description: 'A Gmail label for organizing emails',
});

export const items = i.pins.data<gmail_v1.Schema$Label[]>({
  description: 'A list of Gmail labels for organizing emails',
});

export const id = i.pins.data({
  displayName: 'Label ID',
  description:
    'Gmail label identifier (system labels like INBOX, SENT or custom label IDs)',
  schema: v.string(),
  control: i.controls.text({
    placeholder: 'INBOX or Label_123',
  }),
  examples: [
    {
      title: 'System Label',
      value: 'INBOX',
    },
    {
      title: 'Custom Label',
      value: 'Label_123',
    },
  ],
});

export const ids = i.pins.data({
  displayName: 'Label IDs',
  description: 'List of Gmail label identifiers',
  schema: v.array(v.string()),
  control: i.controls.expression({
    placeholder: '["INBOX", "IMPORTANT"]',
  }),
  examples: [
    {
      title: 'Multiple Labels',
      value: ['INBOX', 'IMPORTANT', 'Label_123'],
    },
  ],
});
