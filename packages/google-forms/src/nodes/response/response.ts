import * as i from '@xentom/integration-framework'
import * as v from 'valibot'

import * as pins from '@/pins'

const nodes = i.nodes.group('Responses')

export const getResponse = nodes.action({
  description: 'Retrieve a single form response by its ID.',
  inputs: {
    formId: pins.form.id,
    responseId: pins.response.id,
  },
  outputs: {
    response: pins.response.item,
    responseId: pins.response.id.with({ control: false }),
    respondentEmail: i.pins.data({
      displayName: 'Respondent Email',
      description: 'The email address of the respondent, if collected.',
      schema: v.string(),
    }),
    submittedAt: i.pins.data({
      displayName: 'Submitted At',
      description: 'The timestamp when the response was submitted.',
      schema: v.string(),
    }),
  },
  async run(opts) {
    const response = await opts.state.forms.forms.responses.get({
      formId: opts.inputs.formId,
      responseId: opts.inputs.responseId,
    })

    return opts.next({
      response: response.data,
      responseId: response.data.responseId ?? '',
      respondentEmail: response.data.respondentEmail ?? '',
      submittedAt: response.data.lastSubmittedTime ?? '',
    })
  },
})

export const listResponses = nodes.action({
  description: 'List all responses submitted to a Google Form.',
  inputs: {
    formId: pins.form.id,
    pageToken: pins.response.pageToken.with({ optional: true }),
    pageSize: i.pins.data({
      displayName: 'Page Size',
      description: 'Maximum number of responses to return per page.',
      schema: v.optional(
        v.pipe(v.number(), v.integer(), v.minValue(1), v.maxValue(5000)),
      ),
      control: i.controls.expression(),
    }),
  },
  outputs: {
    responses: pins.response.items,
    nextPageToken: pins.response.nextPageToken,
  },
  async run(opts) {
    const response = await opts.state.forms.forms.responses.list({
      formId: opts.inputs.formId,
      pageToken: opts.inputs.pageToken,
      pageSize: opts.inputs.pageSize,
    })

    return opts.next({
      responses: response.data.responses ?? [],
      nextPageToken: response.data.nextPageToken ?? '',
    })
  },
})
