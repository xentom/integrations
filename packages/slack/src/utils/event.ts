import { type SlackEvent } from '@slack/web-api'

export interface EventPayload<Event extends SlackEvent> {
  event: Event
  envelope_id: string
  retry_attempt?: number // type: events_api
  retry_reason?: string // type: events_api
  accepts_response_payload?: boolean // type: events_api, slash_commands, interactive
  ack: () => Promise<void>
}
