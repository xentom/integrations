import * as i from '@xentom/integration-framework'
import * as v from 'valibot'

import { type ChatCompletionMessageParam } from 'openai/resources/chat/completions'

import * as pins from '@/pins'

const nodes = i.nodes.group('Chat')

export const createChatCompletion = nodes.callable({
  description: 'Send a conversation to a chat model and receive a completion.',
  inputs: {
    model: i.pins.data({
      description: 'The chat model to use for the completion.',
      schema: v.string(),
      control: i.controls.select<string>({
        defaultValue: 'gpt-4o',
        options(opts) {
          const chatPrefixes = ['gpt-', 'o1', 'o3', 'o4', 'chatgpt-', 'codex-']
          return {
            items: opts.state.models
              .filter((model) =>
                chatPrefixes.some((prefix) => model.id.startsWith(prefix)),
              )
              .sort((a, b) => b.created - a.created)
              .map((model) => ({
                value: model.id,
                label: model.id,
              })),
          }
        },
      }),
    }),
    messages: pins.chat.messages,
    temperature: i.pins.data({
      description:
        'Sampling temperature between 0 and 2. Higher values produce more random output.',
      schema: v.pipe(v.number(), v.minValue(0), v.maxValue(2)),
      control: i.controls.expression({ defaultValue: 1 }),
      optional: true,
    }),
    max_completion_tokens: i.pins.data({
      displayName: 'Max Completion Tokens',
      description:
        'The maximum number of tokens to generate in the completion.',
      schema: v.pipe(v.number(), v.integer(), v.minValue(1)),
      control: i.controls.expression({ defaultValue: 1024 }),
      optional: true,
    }),
    reasoning_effort: i.pins.data({
      displayName: 'Reasoning Effort',
      description:
        'Effort level for reasoning models (o1, o3, o4). Has no effect on other models.',
      schema: v.string(),
      control: i.controls.select({
        options: [
          {
            value: 'low',
            label: 'Low',
            description: 'Faster, less thorough reasoning.',
          },
          {
            value: 'medium',
            label: 'Medium',
            description: 'Balanced speed and thoroughness.',
          },
          {
            value: 'high',
            label: 'High',
            description: 'Slower, more thorough reasoning.',
          },
        ],
      }),
      optional: true,
    }),
  },
  outputs: {
    completion: pins.chat.completion,
    text: i.pins.data({
      description: 'The text content of the first completion choice.',
      schema: v.string(),
    }),
  },
  async run(opts) {
    const completion = await opts.state.client.chat.completions.create({
      model: opts.inputs.model,
      messages: opts.inputs.messages as ChatCompletionMessageParam[],
      temperature: opts.inputs.temperature,
      max_completion_tokens: opts.inputs.max_completion_tokens,
      reasoning_effort: opts.inputs.reasoning_effort as
        | 'none'
        | 'minimal'
        | 'low'
        | 'medium'
        | 'high'
        | 'xhigh'
        | null
        | undefined,
      stream: false,
    })

    const text = completion.choices[0]?.message.content ?? ''

    return opts.next({ completion, text })
  },
})
