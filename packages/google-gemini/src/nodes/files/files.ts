import * as i from '@xentom/integration-framework'
import * as v from 'valibot'

import { type File as GeminiFile } from '@google/genai'

import * as pins from '@/pins'

const nodes = i.nodes.group('Files')

export const uploadFile = nodes.action({
  description: 'Upload a file to the Gemini Files API for use in prompts.',
  inputs: {
    file: i.pins.data<Blob>({
      description: 'The file to upload. Accepts a Blob or File object.',
    }),
    mimeType: i.pins.data({
      displayName: 'MIME Type',
      description:
        'The MIME type of the file (e.g. "text/plain", "image/png"). Inferred from the file if omitted.',
      schema: v.string(),
      control: i.controls.text({
        placeholder: 'image/png',
      }),
      optional: true,
    }),
    displayName: i.pins.data({
      displayName: 'Display Name',
      description: 'Optional human-readable name for the file.',
      schema: v.string(),
      control: i.controls.text({
        placeholder: 'My uploaded file',
      }),
      optional: true,
    }),
  },
  outputs: {
    file: pins.file.item,
  },
  async run(opts) {
    const file = await opts.state.client.files.upload({
      file: opts.inputs.file,
      config: {
        mimeType: opts.inputs.mimeType,
        displayName: opts.inputs.displayName,
      },
    })

    return opts.next({ file })
  },
})

export const getFile = nodes.action({
  description: 'Retrieve metadata for a file stored in the Gemini Files API.',
  inputs: {
    name: pins.file.name,
  },
  outputs: {
    file: pins.file.item,
  },
  async run(opts) {
    const file = await opts.state.client.files.get({ name: opts.inputs.name })
    return opts.next({ file })
  },
})

export const listFiles = nodes.action({
  description: 'List files stored in the Gemini Files API.',
  inputs: {
    pageSize: i.pins.data({
      displayName: 'Page Size',
      description: 'Maximum number of files to return per request.',
      schema: v.pipe(v.number(), v.integer(), v.minValue(1), v.maxValue(100)),
      control: i.controls.expression({
        default: 100,
      }),
      optional: true,
    }),
  },
  outputs: {
    files: pins.file.items,
  },
  async run(opts) {
    const files: GeminiFile[] = []
    const pager = await opts.state.client.files.list({
      config: { pageSize: opts.inputs.pageSize },
    })
    for await (const file of pager) {
      files.push(file)
    }
    return opts.next({ files })
  },
})

export const deleteFile = nodes.action({
  description: 'Delete a file from the Gemini Files API.',
  inputs: {
    name: pins.file.name,
  },
  async run(opts) {
    await opts.state.client.files.delete({ name: opts.inputs.name })
    return opts.next()
  },
})
