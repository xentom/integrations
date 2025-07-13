import * as pins from '@/pins';
import { expect } from 'bun:test';

import * as i from '@acme/integration-framework';

const category = {
  path: ['Testing', 'Expect'],
} satisfies i.NodeCategory;

// Basic equality assertions
export const toBe = i.nodes.pure({
  category,
  description:
    'Assert that a value equals the expected value (strict equality)',
  inputs: {
    actual: pins.expect.actual,
    expected: pins.expect.expected,
    not: pins.expect.not,
  },
  run(opts) {
    if (opts.inputs.not) {
      expect(opts.inputs.actual).not.toBe(opts.inputs.expected);
    } else {
      expect(opts.inputs.actual).toBe(opts.inputs.expected);
    }
  },
});

export const toEqual = i.nodes.pure({
  category,
  description: 'Assert that a value is deeply equal to the expected value',
  inputs: {
    actual: pins.expect.actual,
    expected: pins.expect.expected,
    not: pins.expect.not,
  },
  run(opts) {
    if (opts.inputs.not) {
      expect(opts.inputs.actual).not.toEqual(opts.inputs.expected);
    } else {
      expect(opts.inputs.actual).toEqual(opts.inputs.expected);
    }
  },
});

export const toStrictEqual = i.nodes.pure({
  category,
  description:
    'Assert that a value is deeply and strictly equal to the expected value',
  inputs: {
    actual: pins.expect.actual,
    expected: pins.expect.expected,
    not: pins.expect.not,
  },
  run(opts) {
    if (opts.inputs.not) {
      expect(opts.inputs.actual).not.toStrictEqual(opts.inputs.expected);
    } else {
      expect(opts.inputs.actual).toStrictEqual(opts.inputs.expected);
    }
  },
});

// Null/undefined assertions
export const toBeNull = i.nodes.pure({
  category,
  description: 'Assert that a value is null',
  inputs: {
    actual: pins.expect.actual,
    not: pins.expect.not,
  },
  run(opts) {
    if (opts.inputs.not) {
      expect(opts.inputs.actual).not.toBeNull();
    } else {
      expect(opts.inputs.actual).toBeNull();
    }
  },
});

export const toBeUndefined = i.nodes.pure({
  category,
  description: 'Assert that a value is undefined',
  inputs: {
    actual: pins.expect.actual,
    not: pins.expect.not,
  },
  run(opts) {
    if (opts.inputs.not) {
      expect(opts.inputs.actual).not.toBeUndefined();
    } else {
      expect(opts.inputs.actual).toBeUndefined();
    }
  },
});

export const toBeDefined = i.nodes.pure({
  category,
  description: 'Assert that a value is defined (not undefined)',
  inputs: {
    actual: pins.expect.actual,
    not: pins.expect.not,
  },
  run(opts) {
    if (opts.inputs.not) {
      expect(opts.inputs.actual).not.toBeDefined();
    } else {
      expect(opts.inputs.actual).toBeDefined();
    }
  },
});

export const toBeNil = i.nodes.pure({
  category,
  description: 'Assert that a value is null or undefined',
  inputs: {
    actual: pins.expect.actual,
    not: pins.expect.not,
  },
  run(opts) {
    if (opts.inputs.not) {
      expect(opts.inputs.actual).not.toBeNil();
    } else {
      expect(opts.inputs.actual).toBeNil();
    }
  },
});

// Truthiness assertions
export const toBeTruthy = i.nodes.pure({
  category,
  description: 'Assert that a value is truthy',
  inputs: {
    actual: pins.expect.actual,
    not: pins.expect.not,
  },
  run(opts) {
    if (opts.inputs.not) {
      expect(opts.inputs.actual).not.toBeTruthy();
    } else {
      expect(opts.inputs.actual).toBeTruthy();
    }
  },
});

export const toBeFalsy = i.nodes.pure({
  category,
  description: 'Assert that a value is falsy',
  inputs: {
    actual: pins.expect.actual,
    not: pins.expect.not,
  },
  run(opts) {
    if (opts.inputs.not) {
      expect(opts.inputs.actual).not.toBeFalsy();
    } else {
      expect(opts.inputs.actual).toBeFalsy();
    }
  },
});

export const toBeTrue = i.nodes.pure({
  category,
  description: 'Assert that a value is true',
  inputs: {
    actual: pins.expect.actual,
    not: pins.expect.not,
  },
  run(opts) {
    if (opts.inputs.not) {
      expect(opts.inputs.actual).not.toBeTrue();
    } else {
      expect(opts.inputs.actual).toBeTrue();
    }
  },
});

export const toBeFalse = i.nodes.pure({
  category,
  description: 'Assert that a value is false',
  inputs: {
    actual: pins.expect.actual,
    not: pins.expect.not,
  },
  run(opts) {
    if (opts.inputs.not) {
      expect(opts.inputs.actual).not.toBeFalse();
    } else {
      expect(opts.inputs.actual).toBeFalse();
    }
  },
});

// Type assertions
export const toBeTypeOf = i.nodes.pure({
  category,
  description: 'Assert that a value matches a specific type',
  inputs: {
    actual: pins.expect.actual,
    type: pins.expect.type,
    not: pins.expect.not,
  },
  run(opts) {
    if (opts.inputs.not) {
      expect(opts.inputs.actual).not.toBeTypeOf(opts.inputs.type);
    } else {
      expect(opts.inputs.actual).toBeTypeOf(opts.inputs.type);
    }
  },
});

// Number assertions
export const toBeNumber = i.nodes.pure({
  category,
  description: 'Assert that a value is a number',
  inputs: {
    actual: pins.expect.actual,
    not: pins.expect.not,
  },
  run(opts) {
    if (opts.inputs.not) {
      expect(opts.inputs.actual).not.toBeNumber();
    } else {
      expect(opts.inputs.actual).toBeNumber();
    }
  },
});

export const toBeInteger = i.nodes.pure({
  category,
  description: 'Assert that a value is an integer',
  inputs: {
    actual: pins.expect.actual,
    not: pins.expect.not,
  },
  run(opts) {
    if (opts.inputs.not) {
      expect(opts.inputs.actual).not.toBeInteger();
    } else {
      expect(opts.inputs.actual).toBeInteger();
    }
  },
});

export const toBeFinite = i.nodes.pure({
  category,
  description: 'Assert that a value is a finite number',
  inputs: {
    actual: pins.expect.actual,
    not: pins.expect.not,
  },
  run(opts) {
    if (opts.inputs.not) {
      expect(opts.inputs.actual).not.toBeFinite();
    } else {
      expect(opts.inputs.actual).toBeFinite();
    }
  },
});

export const toBeNaN = i.nodes.pure({
  category,
  displayName: 'To Be NaN',
  description: 'Assert that a value is NaN',
  inputs: {
    actual: pins.expect.actual,
    not: pins.expect.not,
  },
  run(opts) {
    if (opts.inputs.not) {
      expect(opts.inputs.actual).not.toBeNaN();
    } else {
      expect(opts.inputs.actual).toBeNaN();
    }
  },
});

export const toBePositive = i.nodes.pure({
  category,
  description: 'Assert that a value is a positive number',
  inputs: {
    actual: pins.expect.actual,
    not: pins.expect.not,
  },
  run(opts) {
    if (opts.inputs.not) {
      expect(opts.inputs.actual).not.toBePositive();
    } else {
      expect(opts.inputs.actual).toBePositive();
    }
  },
});

export const toBeNegative = i.nodes.pure({
  category,
  description: 'Assert that a value is a negative number',
  inputs: {
    actual: pins.expect.actual,
    not: pins.expect.not,
  },
  run(opts) {
    if (opts.inputs.not) {
      expect(opts.inputs.actual).not.toBeNegative();
    } else {
      expect(opts.inputs.actual).toBeNegative();
    }
  },
});

export const toBeOdd = i.nodes.pure({
  category,
  description: 'Assert that a value is an odd number',
  inputs: {
    actual: pins.expect.actual,
    not: pins.expect.not,
  },
  run(opts) {
    if (opts.inputs.not) {
      expect(opts.inputs.actual).not.toBeOdd();
    } else {
      expect(opts.inputs.actual).toBeOdd();
    }
  },
});

export const toBeEven = i.nodes.pure({
  category,
  description: 'Assert that a value is an even number',
  inputs: {
    actual: pins.expect.actual,
    not: pins.expect.not,
  },
  run(opts) {
    if (opts.inputs.not) {
      expect(opts.inputs.actual).not.toBeEven();
    } else {
      expect(opts.inputs.actual).toBeEven();
    }
  },
});

// Number comparison assertions
export const toBeGreaterThan = i.nodes.pure({
  category,
  description: 'Assert that a value is greater than the expected number',
  inputs: {
    actual: pins.expect.actual,
    expected: pins.expect.number,
    not: pins.expect.not,
  },
  run(opts) {
    if (opts.inputs.not) {
      expect(opts.inputs.actual).not.toBeGreaterThan(opts.inputs.expected);
    } else {
      expect(opts.inputs.actual).toBeGreaterThan(opts.inputs.expected);
    }
  },
});

export const toBeGreaterThanOrEqual = i.nodes.pure({
  category,
  description:
    'Assert that a value is greater than or equal to the expected number',
  inputs: {
    actual: pins.expect.actual,
    expected: pins.expect.number,
    not: pins.expect.not,
  },
  run(opts) {
    if (opts.inputs.not) {
      expect(opts.inputs.actual).not.toBeGreaterThanOrEqual(
        opts.inputs.expected,
      );
    } else {
      expect(opts.inputs.actual).toBeGreaterThanOrEqual(opts.inputs.expected);
    }
  },
});

export const toBeLessThan = i.nodes.pure({
  category,
  description: 'Assert that a value is less than the expected number',
  inputs: {
    actual: pins.expect.actual,
    expected: pins.expect.number,
    not: pins.expect.not,
  },
  run(opts) {
    if (opts.inputs.not) {
      expect(opts.inputs.actual).not.toBeLessThan(opts.inputs.expected);
    } else {
      expect(opts.inputs.actual).toBeLessThan(opts.inputs.expected);
    }
  },
});

export const toBeLessThanOrEqual = i.nodes.pure({
  category,
  description:
    'Assert that a value is less than or equal to the expected number',
  inputs: {
    actual: pins.expect.actual,
    expected: pins.expect.number,
    not: pins.expect.not,
  },
  run(opts) {
    if (opts.inputs.not) {
      expect(opts.inputs.actual).not.toBeLessThanOrEqual(opts.inputs.expected);
    } else {
      expect(opts.inputs.actual).toBeLessThanOrEqual(opts.inputs.expected);
    }
  },
});

export const toBeCloseTo = i.nodes.pure({
  category,
  description:
    'Assert that a value is close to the expected number by floating point precision',
  inputs: {
    actual: pins.expect.actual,
    expected: pins.expect.number,
    numDigits: pins.expect.numDigitsForCloseTo.with({
      optional: true,
    }),
    not: pins.expect.not,
  },
  run(opts) {
    if (opts.inputs.not) {
      if (opts.inputs.numDigits !== undefined) {
        expect(opts.inputs.actual).not.toBeCloseTo(
          opts.inputs.expected,
          opts.inputs.numDigits,
        );
      } else {
        expect(opts.inputs.actual).not.toBeCloseTo(opts.inputs.expected);
      }
    } else {
      if (opts.inputs.numDigits !== undefined) {
        expect(opts.inputs.actual).toBeCloseTo(
          opts.inputs.expected,
          opts.inputs.numDigits,
        );
      } else {
        expect(opts.inputs.actual).toBeCloseTo(opts.inputs.expected);
      }
    }
  },
});

export const toBeWithin = i.nodes.pure({
  category,
  description: 'Assert that a value is a number between a start and end value',
  inputs: {
    actual: pins.expect.actual,
    start: pins.expect.start,
    end: pins.expect.end,
    not: pins.expect.not,
  },
  run(opts) {
    if (opts.inputs.not) {
      expect(opts.inputs.actual).not.toBeWithin(
        opts.inputs.start,
        opts.inputs.end,
      );
    } else {
      expect(opts.inputs.actual).toBeWithin(opts.inputs.start, opts.inputs.end);
    }
  },
});

// String assertions
export const toBeString = i.nodes.pure({
  category,
  description: 'Assert that a value is a string',
  inputs: {
    actual: pins.expect.actual,
    not: pins.expect.not,
  },
  run(opts) {
    if (opts.inputs.not) {
      expect(opts.inputs.actual).not.toBeString();
    } else {
      expect(opts.inputs.actual).toBeString();
    }
  },
});

export const toMatch = i.nodes.pure({
  category,
  description:
    'Assert that a value matches a regular expression or includes a substring',
  inputs: {
    actual: pins.expect.actual,
    pattern: pins.expect.pattern,
    not: pins.expect.not,
  },
  run(opts) {
    if (opts.inputs.not) {
      expect(opts.inputs.actual).not.toMatch(opts.inputs.pattern);
    } else {
      expect(opts.inputs.actual).toMatch(opts.inputs.pattern);
    }
  },
});

export const toInclude = i.nodes.pure({
  category,
  description: 'Assert that a value includes a string',
  inputs: {
    actual: pins.expect.actual,
    string: pins.expect.string,
    not: pins.expect.not,
  },
  run(opts) {
    if (opts.inputs.not) {
      expect(opts.inputs.actual).not.toInclude(opts.inputs.string);
    } else {
      expect(opts.inputs.actual).toInclude(opts.inputs.string);
    }
  },
});

export const toIncludeRepeated = i.nodes.pure({
  category,
  description:
    'Assert that a value includes a string a specific number of times',
  inputs: {
    actual: pins.expect.actual,
    string: pins.expect.string,
    times: pins.expect.times,
    not: pins.expect.not,
  },
  run(opts) {
    if (opts.inputs.not) {
      expect(opts.inputs.actual).not.toIncludeRepeated(
        opts.inputs.string,
        opts.inputs.times,
      );
    } else {
      expect(opts.inputs.actual).toIncludeRepeated(
        opts.inputs.string,
        opts.inputs.times,
      );
    }
  },
});

export const toStartWith = i.nodes.pure({
  category,
  description: 'Assert that a value starts with a string',
  inputs: {
    actual: pins.expect.actual,
    string: pins.expect.string,
    not: pins.expect.not,
  },
  run(opts) {
    if (opts.inputs.not) {
      expect(opts.inputs.actual).not.toStartWith(opts.inputs.string);
    } else {
      expect(opts.inputs.actual).toStartWith(opts.inputs.string);
    }
  },
});

export const toEndWith = i.nodes.pure({
  category,
  description: 'Assert that a value ends with a string',
  inputs: {
    actual: pins.expect.actual,
    string: pins.expect.string,
    not: pins.expect.not,
  },
  run(opts) {
    if (opts.inputs.not) {
      expect(opts.inputs.actual).not.toEndWith(opts.inputs.string);
    } else {
      expect(opts.inputs.actual).toEndWith(opts.inputs.string);
    }
  },
});

export const toEqualIgnoringWhitespace = i.nodes.pure({
  category,
  description:
    'Assert that a value is equal to the expected string, ignoring any whitespace',
  inputs: {
    actual: pins.expect.actual,
    expected: pins.expect.string,
    not: pins.expect.not,
  },
  run(opts) {
    if (opts.inputs.not) {
      expect(opts.inputs.actual).not.toEqualIgnoringWhitespace(
        opts.inputs.expected,
      );
    } else {
      expect(opts.inputs.actual).toEqualIgnoringWhitespace(
        opts.inputs.expected,
      );
    }
  },
});

// Array assertions
export const toBeArray = i.nodes.pure({
  category,
  description: 'Assert that a value is an array',
  inputs: {
    actual: pins.expect.actual,
    not: pins.expect.not,
  },
  run(opts) {
    if (opts.inputs.not) {
      expect(opts.inputs.actual).not.toBeArray();
    } else {
      expect(opts.inputs.actual).toBeArray();
    }
  },
});

export const toBeArrayOfSize = i.nodes.pure({
  category,
  description: 'Assert that a value is an array of a certain size',
  inputs: {
    actual: pins.expect.actual,
    size: pins.expect.size,
    not: pins.expect.not,
  },
  run(opts) {
    if (opts.inputs.not) {
      expect(opts.inputs.actual).not.toBeArrayOfSize(opts.inputs.size);
    } else {
      expect(opts.inputs.actual).toBeArrayOfSize(opts.inputs.size);
    }
  },
});

export const toContain = i.nodes.pure({
  category,
  description: 'Assert that a value contains the expected value',
  inputs: {
    actual: pins.expect.actual,
    expected: pins.expect.expected,
    not: pins.expect.not,
  },
  run(opts) {
    if (opts.inputs.not) {
      expect(opts.inputs.actual).not.toContain(opts.inputs.expected);
    } else {
      expect(opts.inputs.actual).toContain(opts.inputs.expected);
    }
  },
});

export const toContainEqual = i.nodes.pure({
  category,
  description: 'Assert that a value contains and equals what is expected',
  inputs: {
    actual: pins.expect.actual,
    expected: pins.expect.expected,
    not: pins.expect.not,
  },
  run(opts) {
    if (opts.inputs.not) {
      expect(opts.inputs.actual).not.toContainEqual(opts.inputs.expected);
    } else {
      expect(opts.inputs.actual).toContainEqual(opts.inputs.expected);
    }
  },
});

export const toBeOneOf = i.nodes.pure({
  category,
  description:
    'Assert that a value is deep equal to an element in the expected array',
  inputs: {
    actual: pins.expect.actual,
    array: pins.expect.array,
    not: pins.expect.not,
  },
  run(opts) {
    if (opts.inputs.not) {
      expect(opts.inputs.actual).not.toBeOneOf(opts.inputs.array);
    } else {
      expect(opts.inputs.actual).toBeOneOf(opts.inputs.array);
    }
  },
});

// Object assertions
export const toBeObject = i.nodes.pure({
  category,
  description: 'Assert that a value is an object',
  inputs: {
    actual: pins.expect.actual,
    not: pins.expect.not,
  },
  run(opts) {
    if (opts.inputs.not) {
      expect(opts.inputs.actual).not.toBeObject();
    } else {
      expect(opts.inputs.actual).toBeObject();
    }
  },
});

export const toBeEmptyObject = i.nodes.pure({
  category,
  description: 'Assert that a value is an empty object',
  inputs: {
    actual: pins.expect.actual,
    not: pins.expect.not,
  },
  run(opts) {
    if (opts.inputs.not) {
      expect(opts.inputs.actual).not.toBeEmptyObject();
    } else {
      expect(opts.inputs.actual).toBeEmptyObject();
    }
  },
});

export const toMatchObject = i.nodes.pure({
  category,
  description: 'Assert that an object matches a subset of properties',
  inputs: {
    actual: pins.expect.actual,
    subset: pins.expect.subset,
    not: pins.expect.not,
  },
  run(opts) {
    if (opts.inputs.not) {
      expect(opts.inputs.actual).not.toMatchObject(opts.inputs.subset);
    } else {
      expect(opts.inputs.actual).toMatchObject(opts.inputs.subset);
    }
  },
});

export const toHaveProperty = i.nodes.pure({
  category,
  description:
    'Assert that a value has a property with the expected name and value',
  inputs: {
    actual: pins.expect.actual,
    keyPath: pins.expect.keyPath,
    propertyValue: pins.expect.propertyValue.with({
      optional: true,
    }),
    not: pins.expect.not,
  },
  run(opts) {
    if (opts.inputs.not) {
      if (opts.inputs.propertyValue !== undefined) {
        expect(opts.inputs.actual).not.toHaveProperty(
          opts.inputs.keyPath,
          opts.inputs.propertyValue,
        );
      } else {
        expect(opts.inputs.actual).not.toHaveProperty(opts.inputs.keyPath);
      }
    } else {
      if (opts.inputs.propertyValue !== undefined) {
        expect(opts.inputs.actual).toHaveProperty(
          opts.inputs.keyPath,
          opts.inputs.propertyValue,
        );
      } else {
        expect(opts.inputs.actual).toHaveProperty(opts.inputs.keyPath);
      }
    }
  },
});

// Object key/value assertions
export const toContainKey = i.nodes.pure({
  category,
  description: 'Assert that an object contains a key',
  inputs: {
    actual: pins.expect.actual,
    expected: pins.expect.expected,
    not: pins.expect.not,
  },
  run(opts) {
    if (opts.inputs.not) {
      expect(opts.inputs.actual).not.toContainKey(opts.inputs.expected);
    } else {
      expect(opts.inputs.actual).toContainKey(opts.inputs.expected);
    }
  },
});

export const toContainKeys = i.nodes.pure({
  category,
  description: 'Assert that an object contains all the provided keys',
  inputs: {
    actual: pins.expect.actual,
    expected: pins.expect.expected,
    not: pins.expect.not,
  },
  run(opts) {
    if (opts.inputs.not) {
      expect(opts.inputs.actual).not.toContainKeys(opts.inputs.expected);
    } else {
      expect(opts.inputs.actual).toContainKeys(opts.inputs.expected);
    }
  },
});

export const toContainAllKeys = i.nodes.pure({
  category,
  description: 'Assert that an object contains all the provided keys',
  inputs: {
    actual: pins.expect.actual,
    expected: pins.expect.expected,
    not: pins.expect.not,
  },
  run(opts) {
    if (opts.inputs.not) {
      expect(opts.inputs.actual).not.toContainAllKeys(opts.inputs.expected);
    } else {
      expect(opts.inputs.actual).toContainAllKeys(opts.inputs.expected);
    }
  },
});

export const toContainAnyKeys = i.nodes.pure({
  category,
  description:
    'Assert that an object contains at least one of the provided keys',
  inputs: {
    actual: pins.expect.actual,
    expected: pins.expect.expected,
    not: pins.expect.not,
  },
  run(opts) {
    if (opts.inputs.not) {
      expect(opts.inputs.actual).not.toContainAnyKeys(opts.inputs.expected);
    } else {
      expect(opts.inputs.actual).toContainAnyKeys(opts.inputs.expected);
    }
  },
});

export const toContainValue = i.nodes.pure({
  category,
  description: 'Assert that an object contains the provided value',
  inputs: {
    actual: pins.expect.actual,
    expected: pins.expect.expected,
    not: pins.expect.not,
  },
  run(opts) {
    if (opts.inputs.not) {
      expect(opts.inputs.actual).not.toContainValue(opts.inputs.expected);
    } else {
      expect(opts.inputs.actual).toContainValue(opts.inputs.expected);
    }
  },
});

export const toContainValues = i.nodes.pure({
  category,
  description: 'Assert that an object contains the provided values',
  inputs: {
    actual: pins.expect.actual,
    expected: pins.expect.expected,
    not: pins.expect.not,
  },
  run(opts) {
    if (opts.inputs.not) {
      expect(opts.inputs.actual).not.toContainValues(opts.inputs.expected);
    } else {
      expect(opts.inputs.actual).toContainValues(opts.inputs.expected);
    }
  },
});

export const toContainAllValues = i.nodes.pure({
  category,
  description: 'Assert that an object contains all the provided values',
  inputs: {
    actual: pins.expect.actual,
    expected: pins.expect.expected,
    not: pins.expect.not,
  },
  run(opts) {
    if (opts.inputs.not) {
      expect(opts.inputs.actual).not.toContainAllValues(opts.inputs.expected);
    } else {
      expect(opts.inputs.actual).toContainAllValues(opts.inputs.expected);
    }
  },
});

export const toContainAnyValues = i.nodes.pure({
  category,
  description: 'Assert that an object contains any provided value',
  inputs: {
    actual: pins.expect.actual,
    expected: pins.expect.expected,
    not: pins.expect.not,
  },
  run(opts) {
    if (opts.inputs.not) {
      expect(opts.inputs.actual).not.toContainAnyValues(opts.inputs.expected);
    } else {
      expect(opts.inputs.actual).toContainAnyValues(opts.inputs.expected);
    }
  },
});

// Length and size assertions
export const toHaveLength = i.nodes.pure({
  category,
  description:
    'Assert that a value has a length property equal to the expected length',
  inputs: {
    actual: pins.expect.actual,
    length: pins.expect.length,
    not: pins.expect.not,
  },
  run(opts) {
    if (opts.inputs.not) {
      expect(opts.inputs.actual).not.toHaveLength(opts.inputs.length);
    } else {
      expect(opts.inputs.actual).toHaveLength(opts.inputs.length);
    }
  },
});

// Empty assertions
export const toBeEmpty = i.nodes.pure({
  category,
  description: 'Assert that a value is empty',
  inputs: {
    actual: pins.expect.actual,
    not: pins.expect.not,
  },
  run(opts) {
    if (opts.inputs.not) {
      expect(opts.inputs.actual).not.toBeEmpty();
    } else {
      expect(opts.inputs.actual).toBeEmpty();
    }
  },
});

// Boolean assertions
export const toBeBoolean = i.nodes.pure({
  category,
  description: 'Assert that a value is a boolean',
  inputs: {
    actual: pins.expect.actual,
    not: pins.expect.not,
  },
  run(opts) {
    if (opts.inputs.not) {
      expect(opts.inputs.actual).not.toBeBoolean();
    } else {
      expect(opts.inputs.actual).toBeBoolean();
    }
  },
});

// Date assertions
export const toBeDate = i.nodes.pure({
  category,
  description: 'Assert that a value is a Date object',
  inputs: {
    actual: pins.expect.actual,
    not: pins.expect.not,
  },
  run(opts) {
    if (opts.inputs.not) {
      expect(opts.inputs.actual).not.toBeDate();
    } else {
      expect(opts.inputs.actual).toBeDate();
    }
  },
});

export const toBeValidDate = i.nodes.pure({
  category,
  description: 'Assert that a value is a valid Date object',
  inputs: {
    actual: pins.expect.actual,
    not: pins.expect.not,
  },
  run(opts) {
    if (opts.inputs.not) {
      expect(opts.inputs.actual).not.toBeValidDate();
    } else {
      expect(opts.inputs.actual).toBeValidDate();
    }
  },
});
