import * as i from '@xentom/integration-framework'
import * as z from 'zod'

import { type FilePurpose } from 'openai/resources'

import * as pins from '@/pins'

const nodes = i.nodes.group('Files')

export const createFile = nodes.callable({
  inputs: {
    file: i.pins.data<File>(),
    purpose: i.pins.data<FilePurpose>({
      schema: z.enum([
        'assistants',
        'batch',
        'fine-tune',
        'vision',
        'user_data',
        'evals',
      ]),
      control: i.controls.select({
        defaultValue: 'user_data',
        options: [
          {
            label: 'Assistants',
            value: 'assistants',
            description: 'Used in the Assistants API',
          },
          {
            label: 'Batch',
            value: 'batch',
            description: 'Used in the Batch API',
          },
          {
            label: 'Fine-tune',
            value: 'fine-tune',
            description: 'Used for fine-tuning',
          },
          {
            label: 'Vision',
            value: 'vision',
            description: 'Images used for vision fine-tuning',
          },
          {
            label: 'User Data',
            value: 'user_data',
            description: 'Flexible file type for any purpose',
          },
          {
            label: 'Evals',
            value: 'evals',
            description: 'Used for eval data sets',
          },
        ],
      }),
    }),
  },
  outputs: {
    file: pins.file.item,
  },
  async run(opts) {
    const file = await opts.state.client.files.create({
      file: opts.inputs.file,
      purpose: opts.inputs.purpose,
    })

    return opts.next({
      file,
    })
  },
})

export const deleteFile = nodes.callable({
  inputs: {
    fileId: pins.file.id,
  },
  async run(opts) {
    const file = await opts.state.client.files.delete(opts.inputs.fileId)
    if (!file.deleted) {
      throw new Error(`Failed to delete file with ID: ${opts.inputs.fileId}`)
    }
  },
})

export const listFiles = nodes.callable({
  inputs: {
    limit: i.pins.data({
      description: 'The maximum number of files to return. Defaults to 10000.',
      schema: z.number().min(1).max(10000),
      control: i.controls.expression({
        defaultValue: 10000,
      }),
    }),
    after: pins.file.id.with({
      description:
        'The cursor for pagination, used to fetch the next set of files.',
      optional: true,
    }),
  },
  outputs: {
    files: pins.file.items,
    hasMore: i.pins.data({
      schema: z.boolean(),
      description: 'Indicates if there are more files to fetch.',
    }),
  },
  async run(opts) {
    const files = await opts.state.client.files.list({
      limit: opts.inputs.limit,
      after: opts.inputs.after,
    })

    return opts.next({
      files: files.data,
      hasMore: files.has_more,
    })
  },
})

export const getFile = nodes.callable({
  inputs: {
    fileId: pins.file.id,
  },
  outputs: {
    file: pins.file.item,
  },
  async run(opts) {
    const file = await opts.state.client.files.retrieve(opts.inputs.fileId)
    return opts.next({
      file,
    })
  },
})

export const fileContent = nodes.callable({
  inputs: {
    fileId: pins.file.id,
  },
  outputs: {
    content: i.pins.data({
      schema: z.instanceof(Response),
      description: 'The raw content of the file.',
    }),
  },
  async run(opts) {
    const content = await opts.state.client.files.content(opts.inputs.fileId)
    return opts.next({
      content,
    })
  },
})

export const waitForFileProcessing = nodes.callable({
  inputs: {
    fileId: pins.file.id,
    pollInterval: i.pins.data({
      schema: z.number().min(1000).default(5000),
      description: 'Polling interval in milliseconds.',
    }),
    maxWait: i.pins.data({
      schema: z
        .number()
        .min(60000)
        .default(30 * 60 * 1000),
      description: 'Maximum wait time in milliseconds.',
    }),
  },
  outputs: {
    file: pins.file.item,
  },
  async run(opts) {
    const file = await opts.state.client.files.waitForProcessing(
      opts.inputs.fileId,
      {
        pollInterval: opts.inputs.pollInterval,
        maxWait: opts.inputs.maxWait,
      },
    )

    return opts.next({
      file,
    })
  },
})
