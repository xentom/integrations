import * as i from '@xentom/integration-framework'
import * as v from 'valibot'

import { type ToolUseBlock } from '@anthropic-ai/sdk/resources'

import * as pins from '@/pins'

const nodes = i.nodes.group('Flow')

export const branch = nodes.callable({
  inputs: {
    condition: i.pins.data({
      schema: v.pipe(v.string(), v.minLength(1)),
      control: i.controls.text({
        rows: 2,
        placeholder: 'Enter your condition prompt...',
      }),
      examples: [
        {
          title: 'Check if the text contains a phone number',
          value: 'Does the text "{{ variable }}" contain a phone number?',
        },
        {
          title: 'Check if the number is greater than 10',
          value: 'Is the number {{ variable }} greater than 10?',
        },
      ],
    }),
    model: pins.message.model.with({
      optional: true,
    }),
    maxTokens: pins.message.maxTokens.with({
      optional: true,
    }),
    thinking: pins.message.thinking.with({
      optional: true,
    }),
    thinkingBudgetTokens: pins.message.thinkingBudgetTokens.with({
      optional: true,
    }),
  },
  outputs: {
    true: i.pins.exec(),
    false: i.pins.exec(),
    reason: i.pins.data({
      schema: v.string(),
      optional: true,
    }),
  },
  async run(opts) {
    const message = await opts.state.client.messages.create({
      model: opts.inputs.model ?? 'claude-sonnet-4-5',
      max_tokens: opts.inputs.maxTokens ?? (opts.inputs.thinking ? 6000 : 256),
      messages: [
        {
          role: 'user',
          content: opts.inputs.condition,
        },
      ],
      tool_choice: opts.inputs.thinking
        ? {
            type: 'auto',
          }
        : {
            type: 'tool',
            name: 'evaluate_condition',
          },
      tools: [
        {
          name: 'evaluate_condition',
          description:
            'Evaluates a condition and returns true or false with an optional reason',
          input_schema: {
            type: 'object',
            properties: {
              condition: {
                type: 'boolean',
                description: 'The boolean result of the condition evaluation',
              },
              reason: {
                type: 'string',
                description:
                  'Explanation for why the condition is true or false in the same language as the condition',
              },
            },
            required: ['condition'],
          },
        },
      ],
      thinking: opts.inputs.thinking
        ? {
            type: 'enabled',
            budget_tokens: opts.inputs.thinkingBudgetTokens ?? 5000,
          }
        : {
            type: 'disabled',
          },
    })

    const tool = message.content.find((block): block is ToolUseBlock => {
      return block.type === 'tool_use' && block.name === 'evaluate_condition'
    })

    if (!tool) {
      throw new Error('No tool use block found in response')
    }

    const result = tool.input as {
      condition: boolean
      reason?: string
    }

    return await opts.next(`${result.condition}`, {
      reason: result.reason,
    })
  },
})
