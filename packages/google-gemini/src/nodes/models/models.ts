import * as i from '@xentom/integration-framework'
import * as v from 'valibot'

import { type ContentListUnion, type Part, type PartUnion } from '@google/genai'

import * as pins from '@/pins'

function toPartList(contents: ContentListUnion): PartUnion[] {
  if (typeof contents === 'string') {
    return [{ text: contents }]
  }
  return Array.isArray(contents)
    ? (contents as PartUnion[])
    : [contents as PartUnion]
}

const nodes = i.nodes.group('Models')

export const generateContent = nodes.action({
  description: 'Generate text or multimodal content using a Gemini model.',
  inputs: {
    model: pins.model.id,
    contents: pins.content.contents,
    systemInstruction: i.pins.data({
      displayName: 'System Instruction',
      description: 'System instructions to guide the model behavior.',
      schema: v.string(),
      control: i.controls.text({
        placeholder: 'You are a helpful assistant.',
        rows: 3,
      }),
      optional: true,
    }),
    temperature: i.pins.data({
      description:
        'Controls randomness in the output. Values between 0 and 2. Lower values produce more deterministic output.',
      schema: v.pipe(v.number(), v.minValue(0), v.maxValue(2)),
      control: i.controls.number({ default: 1 }),
      optional: true,
    }),
    maxOutputTokens: i.pins.data({
      displayName: 'Max Output Tokens',
      description: 'The maximum number of tokens to include in the response.',
      schema: v.pipe(v.number(), v.integer(), v.minValue(1)),
      control: i.controls.number({ default: 8192 }),
      optional: true,
    }),
    topP: i.pins.data({
      displayName: 'Top P',
      description:
        'Nucleus sampling threshold. Tokens are selected until their cumulative probability reaches this value.',
      schema: v.pipe(v.number(), v.minValue(0), v.maxValue(1)),
      control: i.controls.number({ default: 0.95 }),
      optional: true,
    }),
    stopSequences: i.pins.data({
      displayName: 'Stop Sequences',
      description: 'Sequences that stop output generation when encountered.',
      schema: v.array(v.string()),
      control: i.controls.expression({ default: [] }),
      optional: true,
    }),
    files: pins.file.input.with({ optional: true }),
  },
  outputs: {
    response: pins.content.response,
    text: i.pins.data({
      description: 'The generated text from the model response.',
      schema: v.string(),
    }),
  },
  async run(opts) {
    let contents: ContentListUnion = opts.inputs.contents

    if (opts.inputs.files !== undefined) {
      const files = Array.isArray(opts.inputs.files)
        ? opts.inputs.files
        : [opts.inputs.files]
      const fileParts: Part[] = files.map((f) => ({
        fileData: { fileUri: f.uri, mimeType: f.mimeType },
      }))
      contents = [...fileParts, ...toPartList(contents)]
    }

    const response = await opts.state.client.models.generateContent({
      model: opts.inputs.model,
      contents,
      config: {
        systemInstruction: opts.inputs.systemInstruction,
        temperature: opts.inputs.temperature,
        maxOutputTokens: opts.inputs.maxOutputTokens,
        topP: opts.inputs.topP,
        stopSequences: opts.inputs.stopSequences,
      },
    })

    return opts.next({ response, text: response.text ?? '' })
  },
})
