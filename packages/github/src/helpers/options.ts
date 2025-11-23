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
