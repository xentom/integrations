import type * as i from '@xentom/integration-framework'

export function getPagination(pagination: i.SelectControlOptionsPagination) {
  return {
    limit: pagination.limit,
    starting_after: pagination.after?.toString(),
    ending_before: pagination.before?.toString(),
  }
}
