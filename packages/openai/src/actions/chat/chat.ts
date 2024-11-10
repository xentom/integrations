import { IconBrain, IconInputAi, IconWand } from '@tabler/icons-react';
import { type ChatCompletionMessageParam } from 'openai/resources/index.mjs';
import { createAction, pin } from '@xentom/integration';

const group = 'Chat';

const history: ChatCompletionMessageParam[] = [];
export const sendPrompt = createAction({
  group,
  icon: IconInputAi,
  description: 'Send a prompt to an OpenAI model and generate a completion.',
  inputs: {
    exec: pin.exec({
      async run({ inputs, state, next }) {
        if (inputs.memory) {
          history.push({ role: 'user', content: inputs.prompt });
        }

        // Implement the action logic here and invoke 'next' to trigger the connected actions.
        const completion = await state.client.chat.completions.create({
          model: inputs.model,
          messages: inputs.memory
            ? history
            : [{ role: 'user', content: inputs.prompt }],
        });

        if (inputs.memory) {
          history.push(completion.choices[0].message);
        }

        next('exec', {
          completion: completion.choices[0].message.content,
        });
      },
    }),
    prompt: pin.string({
      icon: IconInputAi,
      description:
        'The input text to generate a completion for. The model will generate a completion based on the provided text.',
    }),
    model: pin.enum({
      icon: IconWand,
      description:
        'Select the model that will generate the completion. Certain models are optimized for natural language tasks, while others are tailored for coding or specific technical applications.',
      options: [
        { value: 'gpt-4o', label: 'GPT-4o' },
        { value: 'gpt-4o-mini', label: 'GPT-4o Mini' },
        { value: 'o1-preview', label: 'o1-preview' },
        { value: 'o1-mini', label: 'o1-mini' },
        { value: 'gpt-3.5-turbo', label: 'GPT-3.5 Turbo' },
      ],
      defaultValue: 'gpt-4o',
    }),
    memory: pin.boolean({
      icon: IconBrain,
      description:
        'Whether to include the conversation history in the completion. This can help the model generate more contextually relevant completions.',
      defaultValue: false,
    }),
  },
  outputs: {
    exec: pin.exec(),
    completion: pin.string({
      description:
        'The generated completion text. This is the output of the model based on the input prompt.',
      isEditable: false,
    }),
  },
});
