import * as i from '@xentom/integration-framework';
import * as z from 'zod';

import {
  type ResponseInput,
  type Tool,
} from 'openai/resources/responses/responses';

import * as pins from '@/pins';

const category = {
  path: ['AI', 'Response'],
} satisfies i.NodeCategory;

export const createResponse = i.nodes.callable({
  category,
  inputs: {
    model: i.pins.data({
      schema: z.string().nonempty(),
      control: i.controls.select<string>({
        defaultValue: 'gpt-4o',
        options(opts) {
          return opts.state.models
            .sort((a, b) => b.created - a.created)
            .map((model) => ({
              value: model.id,
              label: model.id,
            }));
        },
      }),
    }),
    input: i.pins.data<string | ResponseInput>({
      control: i.controls.expression({
        placeholder: 'Enter your input here',
      }),
      examples: [
        {
          title: 'Simple Text Input',
          value: 'What is the weather like today?',
        },
        {
          title: 'Complex Input with Messages',
          value: [
            {
              role: 'user',
              content: 'What is the weather like today?',
            },
            {
              role: 'assistant',
              content: 'The weather is sunny with a high of 75°F.',
            },
          ],
        },
        {
          title: 'Input with File Reference',
          value: [
            {
              role: 'user',
              content: [
                {
                  type: 'input_text',
                  text: 'Please analyze this file.',
                },
                {
                  type: 'input_file',
                  file_id: '{{ fileId }}',
                },
              ],
            },
          ],
        },
      ],
    }),
    web: i.pins.data({
      schema: z.boolean(),
      control: i.controls.switch({
        label: 'Web Search',
        description: 'Enable web search for the response.',
        defaultValue: false,
      }),
    }),
  },
  outputs: {
    response: pins.response.item,
  },
  async run(opts) {
    const tools: Tool[] = [];

    if (opts.inputs.web) {
      tools.push({
        type: 'web_search_preview',
      });
    }

    return opts.next({
      response: await opts.state.client.responses.create({
        model: opts.inputs.model,
        instructions: `You are a helpful assistant for an workflow automation platform. You have following variables available: ${JSON.stringify(
          opts.variables,
        )}`,
        input: opts.inputs.input,
        tools,
      }),
    });
  },
});

export const getResponse = i.nodes.callable({
  category,
  inputs: {
    id: pins.response.id,
  },
  outputs: {
    response: pins.response.item,
  },
  async run(opts) {
    return opts.next({
      response: await opts.state.client.responses.retrieve(opts.inputs.id),
    });
  },
});

export const cancelResponse = i.nodes.callable({
  category,
  inputs: {
    id: pins.response.id,
  },
  outputs: {
    response: pins.response.item,
  },
  async run(opts) {
    return opts.next({
      response: await opts.state.client.responses.cancel(opts.inputs.id),
    });
  },
});

export const deleteResponse = i.nodes.callable({
  category,
  inputs: {
    id: pins.response.id,
  },
  async run(opts) {
    await opts.state.client.responses.delete(opts.inputs.id);
    return opts.next();
  },
});
