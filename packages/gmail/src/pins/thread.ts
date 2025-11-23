import * as i from '@xentom/integration-framework'
import * as v from 'valibot'

import { type gmail_v1 } from 'googleapis/build/src/apis/gmail/v1'

export const item = i.pins.data<gmail_v1.Schema$Thread>({
  description: 'A Gmail conversation thread containing one or more messages',
})

export const id = i.pins.data({
  displayName: 'Thread ID',
  description: 'Gmail thread identifier',
  schema: v.string(),
  control: i.controls.text({
    placeholder: '18b2c3d4e5f6g7h8',
  }),
  examples: [
    {
      title: 'Thread ID',
      value: '18b2c3d4e5f6g7h8',
    },
  ],
})
