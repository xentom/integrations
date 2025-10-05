import * as i from '@xentom/integration-framework';
import * as v from 'valibot';

import * as pins from '@/pins';

const nodes = i.nodes.group('Messages');

export const createMessage = nodes.callable({
  description:
    'Send a message to Claude and receive a response. Supports text generation, multi-turn conversations, and various model parameters.',
  inputs: {
    content: pins.message.content,
    model: pins.message.model,
    maxTokens: pins.message.maxTokens,
    systemPrompt: pins.message.systemPrompt.with({
      optional: true,
    }),
    thinking: pins.message.thinking.with({
      optional: true,
    }),
    thinkingBudgetTokens: pins.message.thinkingBudgetTokens.with({
      optional: true,
    }),
    temperature: pins.message.temperature.with({
      optional: true,
    }),
    topK: pins.message.topK.with({
      optional: true,
    }),
    topP: pins.message.topP.with({
      optional: true,
    }),
    stopSequences: pins.message.stopSequences.with({
      optional: true,
    }),
  },
  outputs: {
    message: pins.message.item,
  },
  async run({ inputs, state, next }) {
    const message = await state.client.messages.create({
      model: inputs.model,
      max_tokens: inputs.maxTokens,
      messages: [
        {
          role: 'user',
          content: inputs.content,
        },
      ],

      thinking: inputs.thinking
        ? {
            type: 'enabled',
            budget_tokens: inputs.thinkingBudgetTokens ?? 1024,
          }
        : {
            type: 'disabled',
          },

      system: inputs.systemPrompt,
      temperature: inputs.temperature,
      top_k: inputs.topK,
      top_p: inputs.topP,
      stop_sequences: inputs.stopSequences,
    });

    return await next({
      message,
    });
  },
});

export const countMessageTokens = nodes.callable({
  description:
    'Count the number of tokens in a message without creating it. Useful for estimating costs.',
  inputs: {
    content: pins.message.content,
    model: pins.message.model,
    systemPrompt: pins.message.systemPrompt.with({
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
    inputTokens: i.pins.data({
      displayName: 'Input Tokens',
      description: 'Total number of tokens in the message',
      schema: v.number(),
    }),
  },
  async run({ inputs, state, next }) {
    const tokenCount = await state.client.messages.countTokens({
      model: inputs.model,
      messages: [
        {
          role: 'user',
          content: inputs.content,
        },
      ],
      system: inputs.systemPrompt,
      thinking: inputs.thinking
        ? {
            type: 'enabled',
            budget_tokens: inputs.thinkingBudgetTokens ?? 1024,
          }
        : { type: 'disabled' },
    });

    await next({
      inputTokens: tokenCount.input_tokens,
    });
  },
});

export const messageText = nodes.pure({
  description: 'Get the text content of a message',
  inputs: {
    message: pins.message.item,
  },
  outputs: {
    text: i.pins.data({
      displayName: 'Text',
      description: 'The text content of the message',
      schema: v.string(),
    }),
  },
  run({ inputs, outputs }) {
    outputs.text =
      inputs.message.content.find((block) => block.type === 'text')?.text ?? '';
  },
});
