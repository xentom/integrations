import * as i from '@xentom/integration-framework'
import * as v from 'valibot'

import { type forms_v1 } from 'googleapis/build/src/apis/forms/v1'

export const item = i.pins.data<forms_v1.Schema$Form>({
  displayName: 'Form',
  description: 'A Google Form object.',
})

export const id = i.pins.data({
  displayName: 'Form ID',
  description: 'The unique identifier of the Google Form.',
  schema: v.pipe(v.string(), v.nonEmpty()),
  control: i.controls.text({
    placeholder: '1FAIpQLSe...',
  }),
})

export const title = i.pins.data({
  displayName: 'Form Title',
  description: 'The title of the Google Form.',
  schema: v.pipe(v.string(), v.nonEmpty()),
  control: i.controls.text({
    placeholder: 'Customer Feedback Survey',
  }),
})

export const description = i.pins.data({
  displayName: 'Form Description',
  description: 'The description of the Google Form.',
  schema: v.string(),
  control: i.controls.text({
    placeholder: 'Please share your thoughts.',
  }),
})

export const responderUri = i.pins.data({
  displayName: 'Responder URL',
  description: 'The URL to share with respondents to fill out the form.',
  schema: v.pipe(v.string(), v.url()),
})
