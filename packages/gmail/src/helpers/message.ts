export function decodeGmailNotification(data: string) {
  return JSON.parse(Buffer.from(data, 'base64').toString('utf-8')) as {
    historyId: string
    emailAddress?: string
  }
}
