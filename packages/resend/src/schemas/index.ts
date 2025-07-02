import * as v from 'valibot';

export const uuid = v.pipe(v.string(), v.uuid());

export const email = v.pipe(v.string(), v.trim(), v.email());

export const emailWithDisplayName = v.pipe(
  v.string(),
  v.trim(),
  v.regex(
    /^(.+?)\s*<([^<>]+@[^<>]+)>$/,
    'Must be in format "Display Name <email@domain.com>"',
  ),
);
