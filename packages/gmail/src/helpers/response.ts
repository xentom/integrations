import { type Common } from 'googleapis';

export function isGaxiosError(error: unknown): error is Common.GaxiosError {
  return error instanceof Error && 'code' in error;
}
