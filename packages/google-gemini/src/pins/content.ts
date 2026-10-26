import * as i from '@xentom/integration-framework'

import {
  type ContentListUnion,
  type GenerateContentResponse,
} from '@google/genai'

export const response = i.pins.data<GenerateContentResponse>({
  description: 'The full response object returned by the Gemini model.',
})

export const contents = i.pins.data<ContentListUnion>({
  description:
    'The content to send to the model. Accepts a plain string or a structured Content array.',
  control: i.controls.expression({
    default: '"Why is the sky blue?"',
  }),
})
