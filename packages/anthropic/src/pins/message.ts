import * as i from '@xentom/integration-framework';
import * as v from 'valibot';

import type Anthropic from '@anthropic-ai/sdk';

export const item = i.pins.data<Anthropic.Messages.Message>({
  displayName: 'Message',
  description: 'A message object containing the conversation with Claude',
});

export const id = i.pins.data({
  displayName: 'Message ID',
  description: 'Unique identifier for the message',
  schema: v.string(),
  control: i.controls.text({
    placeholder: 'msg_01...',
  }),
});

export const content = i.pins.data({
  displayName: 'Content',
  description: 'The text content or message to send',
  schema: v.string(),
  control: i.controls.text({
    rows: 4,
    placeholder: 'Hello, Claude!',
  }),
});

export const model = i.pins.data({
  displayName: 'Model',
  description: 'The Claude model to use for completion',
  schema: v.string(),
  control: i.controls.select({
    async options(opts) {
      const models = await opts.state.client.models.list();
      return models.data.map((model) => ({
        value: model.id,
        label: model.display_name,
      }));
    },
    defaultValue: 'claude-sonnet-4-5',
  }),
});

export const maxTokens = i.pins.data({
  displayName: 'Max Tokens',
  description: 'Maximum number of tokens to generate',
  schema: v.number(),
  control: i.controls.expression(),
});

export const temperature = i.pins.data({
  displayName: 'Temperature',
  description: 'Amount of randomness in the response (0.0-1.0)',
  schema: v.pipe(v.number(), v.minValue(0), v.maxValue(1)),
  control: i.controls.expression(),
});

export const systemPrompt = i.pins.data({
  displayName: 'System Prompt',
  description: 'System instructions to guide Claude behavior',
  schema: v.string(),
  control: i.controls.text({
    rows: 3,
    placeholder: 'You are a helpful assistant...',
  }),
});

export const stopSequences = i.pins.data({
  displayName: 'Stop Sequences',
  description: 'Custom text sequences that will cause the model to stop',
  schema: v.array(v.string()),
  control: i.controls.expression(),
});

export const topK = i.pins.data({
  displayName: 'Top K',
  description: 'Sample from the top K options for each token',
  schema: v.number(),
  control: i.controls.expression(),
});

export const topP = i.pins.data({
  displayName: 'Top P',
  description: 'Use nucleus sampling with this probability threshold',
  schema: v.pipe(v.number(), v.minValue(0), v.maxValue(1)),
  control: i.controls.expression(),
});

export const thinking = i.pins.data({
  displayName: 'Thinking',
  description: 'Whether to enable thinking mode',
  schema: v.boolean(),
  control: i.controls.switch(),
});

export const thinkingBudgetTokens = i.pins.data({
  displayName: 'Thinking Budget Tokens',
  description:
    'Determines how many tokens Claude can use for its internal reasoning process. Larger budgets can enable more thorough analysis for complex problems, improving response quality.\nMust be ≥1024 and less than Max Tokens',
  schema: v.pipe(v.number(), v.minValue(1024)),
  control: i.controls.expression(),
});
