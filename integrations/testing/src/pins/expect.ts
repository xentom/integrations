import * as v from 'valibot';

import * as i from '@acme/integration-framework';

export const actual = i.pins.data<unknown>({
  description: 'The actual value to assert',
  control: i.controls.expression(),
});

export const expected = i.pins.data<unknown>({
  description: 'The expected value to compare against',
  control: i.controls.expression(),
});

export const not = i.pins.data({
  description: 'Whether to negate the assertion',
  control: i.controls.switch(),
  schema: v.boolean(),
  optional: true,
});

export const message = i.pins.data<string>({
  description: 'Custom error message for the assertion',
  control: i.controls.text(),
});

export const predicate = i.pins.data<(value: unknown) => boolean>({
  description: 'Custom predicate function to test the value',
  control: i.controls.expression(),
});

export const start = i.pins.data<number>({
  description: 'Start value for range assertions',
  control: i.controls.expression(),
});

export const end = i.pins.data<number>({
  description: 'End value for range assertions',
  control: i.controls.expression(),
});

export const numDigits = i.pins.data<number>({
  description:
    'Number of digits to check after decimal point for floating point comparisons',
  control: i.controls.expression(),
});

export const length = i.pins.data<number>({
  description: 'Expected length for length assertions',
  control: i.controls.expression(),
});

export const keyPath = i.pins.data<string | number | (string | number)[]>({
  description:
    'Property path to check (string, number, or array of strings/numbers)',
  control: i.controls.expression(),
});

export const propertyValue = i.pins.data<unknown>({
  description: 'Expected property value',
  control: i.controls.expression(),
});

export const type = i.pins.data<
  | 'bigint'
  | 'boolean'
  | 'function'
  | 'number'
  | 'object'
  | 'string'
  | 'symbol'
  | 'undefined'
>({
  description: 'Expected type for type assertions',
  control: i.controls.select({
    options: [
      { label: 'BigInt', value: 'bigint' },
      { label: 'Boolean', value: 'boolean' },
      { label: 'Function', value: 'function' },
      { label: 'Number', value: 'number' },
      { label: 'Object', value: 'object' },
      { label: 'String', value: 'string' },
      { label: 'Symbol', value: 'symbol' },
      { label: 'Undefined', value: 'undefined' },
    ],
  }),
});

export const error = i.pins.data<unknown>({
  description: 'Expected error, error message, or error pattern',
  control: i.controls.expression(),
});

export const pattern = i.pins.data<string | RegExp>({
  description: 'String or RegExp pattern to match against',
  control: i.controls.expression(),
});

export const subset = i.pins.data<object>({
  description: 'Subset of properties to match against',
  control: i.controls.expression(),
});

export const constructor = i.pins.data<
  ((...args: unknown[]) => unknown) | (new (...args: unknown[]) => unknown)
>({
  description: 'Constructor function or class to check instance of',
  control: i.controls.expression(),
});

export const times = i.pins.data<number>({
  description: 'Number of times something should occur',
  control: i.controls.expression(),
});

export const size = i.pins.data<number>({
  description: 'Expected size for array size assertions',
  control: i.controls.expression(),
});

export const min = i.pins.data<number>({
  description: 'Minimum value for range assertions',
  control: i.controls.expression(),
});

export const max = i.pins.data<number>({
  description: 'Maximum value for range assertions',
  control: i.controls.expression(),
});

export const array = i.pins.data<readonly unknown[]>({
  description: 'Array to check against',
  control: i.controls.expression(),
});

export const object = i.pins.data<object>({
  description: 'Object to check against',
  control: i.controls.expression(),
});

export const string = i.pins.data<string>({
  description: 'String to check against',
  control: i.controls.expression(),
});

export const number = i.pins.data<number>({
  description: 'Number to check against',
  control: i.controls.expression(),
});

export const numDigitsForCloseTo = i.pins.data<number>({
  description: 'Number of digits to check after decimal point for toBeCloseTo',
  control: i.controls.expression(),
});
