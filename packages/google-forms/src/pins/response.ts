import * as i from '@xentom/integration-framework'
import * as v from 'valibot'

import { type forms_v1 } from 'googleapis/build/src/apis/forms/v1'

export const item = i.pins.data<forms_v1.Schema$FormResponse>({
  displayName: 'Response',
  description: 'A Google Form response object.',
})

export const items = i.pins.data<forms_v1.Schema$FormResponse[]>({
  displayName: 'Responses',
  description: 'A list of Google Form response objects.',
})

export const id = i.pins.data({
  displayName: 'Response ID',
  description: 'The unique identifier of the form response.',
  schema: v.pipe(v.string(), v.nonEmpty()),
  control: i.controls.text(),
})

export const pageToken = i.pins.data({
  displayName: 'Page Token',
  description: 'A token for retrieving the next page of results.',
  schema: v.string(),
})

export const nextPageToken = i.pins.data({
  displayName: 'Next Page Token',
  description: 'A token to retrieve the next page of responses, if any.',
  schema: v.string(),
})
