import * as i from '@xentom/integration-framework'

import {
  type ChatCompletion,
  type ChatCompletionMessageParam,
} from 'openai/resources/chat/completions'

export const completion = i.pins.data<ChatCompletion>({
  description: 'A chat completion object returned by the model.',
})

export const messages = i.pins.data<ChatCompletionMessageParam[]>({
  description: 'A list of messages representing the conversation history.',
  control: i.controls.expression<ChatCompletionMessageParam[]>({
    default: [
      { role: 'user', content: 'Hello!' },
    ] as ChatCompletionMessageParam[],
  }),
})
