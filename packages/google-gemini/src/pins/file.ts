import * as i from '@xentom/integration-framework'
import * as v from 'valibot'

import { type File as GeminiFile } from '@google/genai'

export const item = i.pins.data<GeminiFile>({
  description: 'A file object stored in the Gemini Files API.',
})

export const items = i.pins.data<GeminiFile[]>({
  description: 'A list of file objects stored in the Gemini Files API.',
})

export const input = i.pins.data<GeminiFile | GeminiFile[]>({
  displayName: 'Files',
  description:
    'One or more files to include in the request. Supports images, audio, video, PDFs, and documents. Connect the output of Upload File, Get File, or List Files.',
})

export const name = i.pins.data({
  displayName: 'File Name',
  description: 'The resource name of the file (e.g. "files/abc-123").',
  schema: v.string(),
  control: i.controls.text({
    placeholder: 'files/abc-123',
  }),
})
