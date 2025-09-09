import * as i from '@xentom/integration-framework';
import * as v from 'valibot';

export const searchQuery = i.pins.data({
  displayName: 'Search Query',
  description: 'search query using Gmail search syntax',
  schema: v.string(),
  control: i.controls.text({
    placeholder: 'from:sender@example.com subject:urgent',
    rows: 2,
  }),
  examples: [
    {
      title: 'Basic Search',
      value: 'from:john@example.com',
    },
    {
      title: 'Complex Search',
      value: 'from:notifications@github.com is:unread after:2024/01/01',
    },
    {
      title: 'Search with Labels',
      value: 'label:inbox has:attachment older_than:30d',
    },
    {
      title: 'Search by Size',
      value: 'larger:10M subject:reports',
    },
  ],
});

export const messageFormat = i.pins.data({
  displayName: 'Message Format',
  description: 'The format to return message payload in',
  schema: v.picklist(['minimal', 'full', 'raw', 'metadata']),
  control: i.controls.select({
    options: [
      { value: 'minimal', label: 'Minimal (ID and labels only)' },
      { value: 'full', label: 'Full (Complete message data)' },
      { value: 'raw', label: 'Raw (RFC 2822 format)' },
      { value: 'metadata', label: 'Metadata (Headers and metadata only)' },
    ],
  }),
  examples: [
    {
      title: 'Full Format',
      value: 'full',
    },
  ],
});

export const maxResults = i.pins.data({
  displayName: 'Max Results',
  description: 'Maximum number of results to return',
  schema: v.pipe(v.number(), v.integer(), v.minValue(1), v.maxValue(500)),
  control: i.controls.expression({
    placeholder: '100',
    defaultValue: 100,
  }),
  examples: [
    {
      title: 'Small Batch',
      value: 10,
    },
    {
      title: 'Large Batch',
      value: 100,
    },
  ],
});
