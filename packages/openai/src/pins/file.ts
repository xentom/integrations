import { type FileObject } from 'openai/resources';
import * as z from 'zod';

import * as i from '@xentom/integration-framework';

export const fileId = i.pins.data({
  displayName: 'File ID',
  description: 'The unique identifier of the file.',
  schema: z.string(),
  control: i.controls.text({
    placeholder: 'file-...',
  }),
});

export const file = i.pins.data<FileObject>({
  description: 'A file object representing a document uploaded to OpenAI.',
});

export const files = i.pins.data<FileObject[]>({
  description:
    'A list of file objects representing documents uploaded to OpenAI.',
});
