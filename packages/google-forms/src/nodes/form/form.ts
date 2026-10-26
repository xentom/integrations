import * as i from '@xentom/integration-framework'

import * as pins from '@/pins'

const nodes = i.nodes.group('Forms')

export const getForm = nodes.action({
  description: 'Retrieve a Google Form by its ID.',
  inputs: {
    formId: pins.form.id,
  },
  outputs: {
    form: pins.form.item,
    formId: pins.form.id.with({ control: false }),
    title: pins.form.title.with({ control: false }),
    responderUri: pins.form.responderUri,
  },
  async run(opts) {
    const response = await opts.state.forms.forms.get({
      formId: opts.inputs.formId,
    })

    return opts.next({
      form: response.data,
      formId: response.data.formId ?? '',
      title: response.data.info?.title ?? '',
      responderUri: response.data.responderUri ?? '',
    })
  },
})

export const createForm = nodes.action({
  description: 'Create a new Google Form with a given title.',
  inputs: {
    title: pins.form.title,
    description: pins.form.description.with({ optional: true }),
  },
  outputs: {
    form: pins.form.item,
    formId: pins.form.id.with({ control: false }),
    responderUri: pins.form.responderUri,
  },
  async run(opts) {
    const response = await opts.state.forms.forms.create({
      requestBody: {
        info: {
          title: opts.inputs.title,
          description: opts.inputs.description,
        },
      },
    })

    return opts.next({
      form: response.data,
      formId: response.data.formId ?? '',
      responderUri: response.data.responderUri ?? '',
    })
  },
})
