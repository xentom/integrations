import type * as i from '@xentom/integration-framework'

import { type PaginationOptions } from 'resend'

export function getPagination(
  pagination: i.SelectControlOptionsPagination,
): PaginationOptions {
  return {
    limit: pagination.limit,
    after: pagination.after?.toString(),
    before: pagination.before?.toString(),
  } as PaginationOptions
}
