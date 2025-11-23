import * as i from '@xentom/integration-framework'
import * as v from 'valibot'

import { type gmail_v1 } from 'googleapis/build/src/apis/gmail/v1'

export const item = i.pins.data<gmail_v1.Schema$Draft>({
  description: 'A Gmail draft message',
})

export const id = i.pins.data({
  displayName: 'Draft ID',
  description: 'ID of the draft to send',
  schema: v.string(),
  control: i.controls.text({
    placeholder: 'd123456789',
  }),
})
