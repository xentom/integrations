import { type campaigns, type lists } from '@mailchimp/mailchimp_marketing'

/**
 * Extended Mailchimp list type for API methods not covered by the community @types package.
 */
export type MailchimpListApi = typeof lists & {
  getList(listId: string): Promise<lists.List>
  createList(body: {
    name: string
    permission_reminder: string
    email_type_option: boolean
    contact: {
      company: string
      address1: string
      city: string
      state: string
      zip: string
      country: string
    }
    campaign_defaults: {
      from_name: string
      from_email: string
      subject: string
      language: string
    }
  }): Promise<lists.List>
  updateList(listId: string, body: Record<string, unknown>): Promise<lists.List>
  deleteList(listId: string): Promise<void>
  listSegments(
    listId: string,
    opts?: { count?: number; offset?: number },
  ): Promise<{
    segments: MailchimpSegment[]
    total_items: number
  }>
  createSegment(
    listId: string,
    body: { name: string; static_segment?: string[] },
  ): Promise<MailchimpSegment>
  getSegment(listId: string, segmentId: number): Promise<MailchimpSegment>
  updateSegment(
    listId: string,
    segmentId: number,
    body: { name?: string },
  ): Promise<MailchimpSegment>
  deleteSegment(listId: string, segmentId: number): Promise<void>
}

export type MailchimpCampaignsApi = typeof campaigns & {
  get(campaignId: string): Promise<campaigns.Campaigns>
  update(
    campaignId: string,
    body: {
      settings?: {
        subject_line?: string
        title?: string
        from_name?: string
        reply_to?: string
      }
      recipients?: {
        list_id?: string
        segment_opts?: { saved_segment_id?: number }
      }
    },
  ): Promise<campaigns.Campaigns>
  remove(campaignId: string): Promise<void>
  schedule(campaignId: string, body: { schedule_time: string }): Promise<void>
}

export type MailchimpTemplatesApi = {
  list(opts?: { count?: number; offset?: number }): Promise<{
    templates: MailchimpTemplate[]
    total_items: number
  }>
  getTemplate(templateId: number): Promise<MailchimpTemplate>
  create(body: { name: string; html: string }): Promise<MailchimpTemplate>
  updateTemplate(
    templateId: number,
    body: { name?: string; html?: string },
  ): Promise<MailchimpTemplate>
  deleteTemplate(templateId: number): Promise<void>
}

export type MailchimpSegment = {
  id: number
  name: string
  member_count: number
  type: string
  created_at: string
  updated_at: string
  list_id: string
}

export type MailchimpTemplate = {
  id: number
  type: string
  name: string
  drag_and_drop: boolean
  responsive: boolean
  category: string
  date_created: string
  date_edited: string
  created_by: string
  edited_by: string
  active: boolean
  folder_id: string
  thumbnail: string
  share_url: string
  content_type: string
}

export type MailchimpClient = {
  lists: MailchimpListApi
  campaigns: MailchimpCampaignsApi
  templates: MailchimpTemplatesApi
  ping: { get(): Promise<{ health_status: string }> }
}
