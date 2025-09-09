import * as i from '@xentom/integration-framework';
import * as z from 'zod';

import { type FileObject } from 'openai/resources';

export const item = i.pins.data<FileObject>({
  description: 'A file object representing a document uploaded to OpenAI.',
});

export const items = i.pins.data<FileObject[]>({
  description:
    'A list of file objects representing documents uploaded to OpenAI.',
});

export const id = i.pins.data({
  displayName: 'File ID',
  description: 'The unique identifier of the file.',
  schema: z.string(),
  control: i.controls.text({
    placeholder: 'file-...',
  }),
});
