import * as i from '@xentom/integration-framework'

import * as pins from '@/pins'

const nodes = i.nodes.group('Templates')

export const listTemplates = nodes.action({
  description: 'Get all email templates in the Mailchimp account.',
  inputs: {},
  outputs: {
    items: pins.template.items.with({ control: false }),
  },
  async run(opts) {
    const response = await opts.state.mailchimp.templates.list({ count: 1000 })
    return opts.next({ items: response.templates ?? [] })
  },
})

export const getTemplate = nodes.action({
  description: 'Get information about a specific Mailchimp email template.',
  inputs: {
    templateId: pins.template.id,
  },
  outputs: {
    item: pins.template.item.with({ control: false }),
  },
  async run(opts) {
    const item = await opts.state.mailchimp.templates.getTemplate(
      opts.inputs.templateId,
    )
    return opts.next({ item })
  },
})

export const createTemplate = nodes.action({
  description: 'Create a new Mailchimp email template.',
  inputs: {
    name: pins.template.name,
    htmlContent: pins.template.htmlContent,
  },
  outputs: {
    item: pins.template.item.with({ control: false }),
  },
  async run(opts) {
    const item = await opts.state.mailchimp.templates.create({
      name: opts.inputs.name,
      html: opts.inputs.htmlContent,
    })
    return opts.next({ item })
  },
})

export const updateTemplate = nodes.action({
  description: 'Update an existing Mailchimp email template.',
  inputs: {
    templateId: pins.template.id,
    name: pins.template.name.with({ optional: true }),
    htmlContent: pins.template.htmlContent.with({ optional: true }),
  },
  outputs: {
    item: pins.template.item.with({ control: false }),
  },
  async run(opts) {
    const body: { name?: string; html?: string } = {}
    if (opts.inputs.name !== undefined) body.name = opts.inputs.name
    if (opts.inputs.htmlContent !== undefined)
      body.html = opts.inputs.htmlContent
    const item = await opts.state.mailchimp.templates.updateTemplate(
      opts.inputs.templateId,
      body,
    )
    return opts.next({ item })
  },
})

export const deleteTemplate = nodes.action({
  description: 'Delete a Mailchimp email template.',
  inputs: {
    templateId: pins.template.id,
  },
  outputs: {},
  async run(opts) {
    await opts.state.mailchimp.templates.deleteTemplate(opts.inputs.templateId)
    return opts.next({})
  },
})
