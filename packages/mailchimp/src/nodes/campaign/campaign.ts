import * as i from '@xentom/integration-framework'

import * as pins from '@/pins'

const nodes = i.nodes.group('Campaigns')

export const listCampaigns = nodes.callable({
  description: 'Get all campaigns in the Mailchimp account.',
  inputs: {},
  outputs: {
    items: pins.campaign.items.with({ control: false }),
  },
  async run(opts) {
    const response = await opts.state.mailchimp.campaigns.list({ count: 1000 })
    if (!('campaigns' in response))
      throw new Error('Failed to fetch campaigns.')
    return opts.next({ items: response.campaigns })
  },
})

export const getCampaign = nodes.callable({
  description: 'Get information about a specific Mailchimp campaign.',
  inputs: {
    campaignId: pins.campaign.id,
  },
  outputs: {
    item: pins.campaign.item.with({ control: false }),
  },
  async run(opts) {
    const item = await opts.state.mailchimp.campaigns.get(
      opts.inputs.campaignId,
    )
    return opts.next({ item })
  },
})

export const createCampaign = nodes.callable({
  description: 'Create a new Mailchimp campaign.',
  inputs: {
    type: pins.campaign.type,
    listId: pins.list.id,
    subject: pins.campaign.subject,
    title: pins.campaign.title.with({ optional: true }),
    fromName: pins.campaign.fromName,
    replyTo: pins.campaign.replyTo,
    htmlContent: pins.campaign.htmlContent.with({ optional: true }),
    plainText: pins.campaign.plainText.with({ optional: true }),
  },
  outputs: {
    item: pins.campaign.item.with({ control: false }),
  },
  async run(opts) {
    const campaign = await opts.state.mailchimp.campaigns.create({
      type: opts.inputs.type,
      recipients: { list_id: opts.inputs.listId },
      settings: {
        subject_line: opts.inputs.subject,
        title: opts.inputs.title,
        from_name: opts.inputs.fromName,
        reply_to: opts.inputs.replyTo,
      },
    })

    if (!('id' in campaign)) throw new Error('Failed to create campaign.')

    if (
      opts.inputs.htmlContent !== undefined ||
      opts.inputs.plainText !== undefined
    ) {
      await opts.state.mailchimp.campaigns.setContent(campaign.id, {
        html: opts.inputs.htmlContent,
        plain_text: opts.inputs.plainText,
      })
    }

    return opts.next({ item: campaign })
  },
})

export const updateCampaign = nodes.callable({
  description: 'Update settings for a Mailchimp campaign.',
  inputs: {
    campaignId: pins.campaign.id,
    subject: pins.campaign.subject.with({ optional: true }),
    title: pins.campaign.title.with({ optional: true }),
    fromName: pins.campaign.fromName.with({ optional: true }),
    replyTo: pins.campaign.replyTo.with({ optional: true }),
  },
  outputs: {
    item: pins.campaign.item.with({ control: false }),
  },
  async run(opts) {
    const settings: Record<string, string> = {}
    if (opts.inputs.subject !== undefined)
      settings.subject_line = opts.inputs.subject
    if (opts.inputs.title !== undefined) settings.title = opts.inputs.title
    if (opts.inputs.fromName !== undefined)
      settings.from_name = opts.inputs.fromName
    if (opts.inputs.replyTo !== undefined)
      settings.reply_to = opts.inputs.replyTo
    const item = await opts.state.mailchimp.campaigns.update(
      opts.inputs.campaignId,
      { settings },
    )
    return opts.next({ item })
  },
})

export const sendCampaign = nodes.callable({
  description: 'Send a Mailchimp campaign immediately.',
  inputs: {
    campaignId: pins.campaign.id,
  },
  outputs: {},
  async run(opts) {
    await opts.state.mailchimp.campaigns.send(opts.inputs.campaignId)
    return opts.next({})
  },
})

export const scheduleCampaign = nodes.callable({
  description: 'Schedule a Mailchimp campaign for delivery at a specific time.',
  inputs: {
    campaignId: pins.campaign.id,
    scheduleTime: pins.campaign.scheduleTime,
  },
  outputs: {},
  async run(opts) {
    await opts.state.mailchimp.campaigns.schedule(opts.inputs.campaignId, {
      schedule_time: opts.inputs.scheduleTime,
    })
    return opts.next({})
  },
})

export const deleteCampaign = nodes.callable({
  description: 'Delete a Mailchimp campaign.',
  inputs: {
    campaignId: pins.campaign.id,
  },
  outputs: {},
  async run(opts) {
    await opts.state.mailchimp.campaigns.remove(opts.inputs.campaignId)
    return opts.next({})
  },
})
