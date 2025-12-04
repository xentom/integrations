import * as i from '@xentom/integration-framework'
import * as v from 'valibot'

import { type UserObjectResponse } from '@notionhq/client/build/src/api-endpoints'

export const item = i.pins.data<UserObjectResponse>({
  displayName: 'User',
  description: 'A Notion user object.',
})

export const items = i.pins.data<UserObjectResponse[]>({
  displayName: 'Users',
  description: 'A list of Notion user objects.',
})

export const id = i.pins.data({
  displayName: 'User ID',
  description: 'The unique identifier of a Notion user.',
  schema: v.pipe(v.string(), v.nonEmpty()),
  control: i.controls.text({
    placeholder: 'xxxxxxxx...',
  }),
})
