import type * as i from '@xentom/integration-framework'

export function hasRepositoryNameInput(
  opts: i.SelectControlOptionsCallbackOptions,
): opts is i.SelectControlOptionsCallbackOptions & {
  node: { inputs: { repository: string } }
} {
  return (
    !!opts.node.inputs.repository &&
    typeof opts.node.inputs.repository === 'string'
  )
}

export function extractOwnerAndRepo(repository: string): {
  owner: string
  repo: string
} {
  const [owner, repo] = repository.split('/') as [string, string]
  return { owner, repo }
}

export function hasMoreData(response: { headers: { link?: string } }): boolean {
  return response.headers.link?.includes('next') ?? false
}

export function getPagination(opts: i.SelectControlOptionsCallbackOptions) {
  return {
    per_page: opts.pagination.limit,
    page: opts.pagination.page + 1,
  }
}
