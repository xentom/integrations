import { type GaxiosError } from 'gaxios'

export function isGaxiosError(error: unknown): error is GaxiosError {
  return error instanceof Error && 'code' in error
}
