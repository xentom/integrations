import * as i from '@xentom/integration-framework';
import * as v from 'valibot';

import { HTTP_REQUEST_METHODS } from '@/helpers/web';

export const method = i.pins.data({
  schema: v.picklist(HTTP_REQUEST_METHODS),
  control: i.controls.select({
    options: HTTP_REQUEST_METHODS.map((method) => ({
      value: method,
    })),
    defaultValue: 'GET',
  }),
});

export const url = i.pins.data({
  displayName: 'URL',
  schema: v.pipe(v.string(), v.url()),
  control: i.controls.text({
    placeholder: 'https://example.com',
  }),
});

export const headers = i.pins.data({
  schema: v.union([
    v.array(v.tuple([v.string(), v.string()])),
    v.record(v.string(), v.string()),
  ]),
  control: i.controls.expression({
    placeholder: `{\n  'Authorization': 'Bearer token',\n}`,
  }),
});

export const body = i.pins.data({
  schema: v.union([v.any(), v.blob(), v.file()]),
  control: i.controls.expression({
    placeholder: `{\n  name: 'John Doe',\n  email: 'john.doe@example.com',\n}`,
  }),
});

export const response = i.pins.data({
  schema: v.object({
    status: v.number(),
    headers: v.record(v.string(), v.string()),
    body: v.union([v.any(), v.blob(), v.file()]),
  }),
});

export const request = i.pins.data({
  schema: v.object({
    method: v.picklist(HTTP_REQUEST_METHODS),
    url: v.string(),
    body: v.union([v.any(), v.blob(), v.file()]),
    headers: v.record(v.string(), v.string()),
  }),
});
