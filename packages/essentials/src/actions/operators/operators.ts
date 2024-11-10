import {
  IconAmpersand,
  IconAsteriskSimple,
  IconDivide,
  IconEqual,
  IconEqualNot,
  IconExclamationMark,
  IconMathEqualGreater,
  IconMathEqualLower,
  IconMathGreater,
  IconMathLower,
  IconMinus,
  IconPercentage,
  IconPlus,
  IconQuestionMark,
  IconTallymark2,
} from '@tabler/icons-react';
import { createAction, pin } from '@xentom/integration';

const group = 'Operators';

const inputs = {
  a: pin.unknown({
    label: null,
    description: '[a] The first value to operate on.',
  }),
  b: pin.unknown({
    label: null,
    description: '[b] The second value to operate on.',
  }),
};

export const addition = createAction({
  group,
  icon: IconPlus,
  description: 'Add two numbers together.',
  inputs,
  outputs: {
    result: pin.unknown({
      label: null,
      description: 'Returns the sum of the addition of a and b.',
      isEditable: false,
    }),
  },
  run({ inputs, outputs }) {
    outputs.result = inputs.a + inputs.b;
  },
});

export const subtraction = createAction({
  group,
  icon: IconMinus,
  description: 'Subtract one number from another.',
  inputs,
  outputs: {
    result: pin.number({
      label: null,
      description: 'Returns the difference of the subtraction of b from a.',
      isEditable: false,
    }),
  },
  run({ inputs, outputs }) {
    outputs.result = inputs.a - inputs.b;
  },
});

export const multiplication = createAction({
  group,
  icon: IconAsteriskSimple,
  description: 'Multiply two numbers together.',
  inputs,
  outputs: {
    result: pin.number({
      label: null,
      description: 'Returns the product of the multiplication of a and b.',
      isEditable: false,
    }),
  },
  run({ inputs, outputs }) {
    outputs.result = inputs.a * inputs.b;
  },
});

export const division = createAction({
  group,
  icon: IconDivide,
  description: 'Divide one number by another.',
  inputs,
  outputs: {
    result: pin.number({
      label: null,
      description: 'Returns the quotient of the division of a by b.',
      isEditable: false,
    }),
  },
  run({ inputs, outputs }) {
    outputs.result = inputs.a / inputs.b;
  },
});

export const modulo = createAction({
  group,
  icon: IconPercentage,
  description: 'Calculate the remainder of a division operation.',
  inputs,
  outputs: {
    result: pin.number({
      label: null,
      description: 'Returns the remainder of the division of a by b.',
      isEditable: false,
    }),
  },
  run({ inputs, outputs }) {
    outputs.result = inputs.a % inputs.b;
  },
});

export const equals = createAction({
  group,
  icon: IconEqual,
  description: 'Check if two values are equal.',
  inputs,
  outputs: {
    result: pin.boolean({
      label: null,
      description: 'Returns true if a is equal to b, otherwise returns false.',
      isEditable: false,
    }),
  },
  run({ inputs, outputs }) {
    outputs.result = inputs.a == inputs.b;
  },
});

export const notEquals = createAction({
  group,
  icon: IconEqualNot,
  description: 'Check if two values are not equal.',
  inputs,
  outputs: {
    result: pin.boolean({
      label: null,
      description:
        'Returns true if a is not equal to b, otherwise returns false.',
      isEditable: false,
    }),
  },
  run({ inputs, outputs }) {
    outputs.result = inputs.a != inputs.b;
  },
});

export const greaterThan = createAction({
  group,
  icon: IconMathGreater,
  description: 'Check if one value is greater than another.',
  inputs,
  outputs: {
    result: pin.boolean({
      label: null,
      description:
        'Returns true if a is greater than b, otherwise returns false.',
      isEditable: false,
    }),
  },
  run({ inputs, outputs }) {
    outputs.result = inputs.a > inputs.b;
  },
});

export const greaterThanOrEquals = createAction({
  group,
  icon: IconMathEqualGreater,
  description: 'Check if one value is greater than or equal to another.',
  inputs,
  outputs: {
    result: pin.boolean({
      label: null,
      description:
        'Returns true if a is greater than or equal to b, otherwise returns false.',
      isEditable: false,
    }),
  },
  run({ inputs, outputs }) {
    outputs.result = inputs.a >= inputs.b;
  },
});

export const lessThan = createAction({
  group,
  icon: IconMathLower,
  description: 'Check if one value is less than another.',
  inputs,
  outputs: {
    result: pin.boolean({
      label: null,
      description: 'Returns true if a is less than b, otherwise returns false.',
      isEditable: false,
    }),
  },
  run({ inputs, outputs }) {
    outputs.result = inputs.a < inputs.b;
  },
});

export const lessThanOrEquals = createAction({
  group,
  icon: IconMathEqualLower,
  description: 'Check if one value is less than or equal to another.',
  inputs,
  outputs: {
    result: pin.boolean({
      label: null,
      description:
        'Returns true if a is less than or equal to b, otherwise returns false.',
      isEditable: false,
    }),
  },
  run({ inputs, outputs }) {
    outputs.result = inputs.a <= inputs.b;
  },
});

export const and = createAction({
  group,
  icon: IconAmpersand,
  description: 'Check if two values are both true.',
  inputs,
  outputs: {
    result: pin.boolean({
      label: null,
      description:
        'Returns true if both a and b are true, otherwise returns false.',
      isEditable: false,
    }),
  },
  run({ inputs, outputs }) {
    outputs.result = inputs.a && inputs.b;
  },
});

export const or = createAction({
  group,
  icon: IconTallymark2,
  description: 'Check if either of two values are true.',
  inputs,
  outputs: {
    result: pin.boolean({
      label: null,
      description:
        'Returns true if either a or b is true, otherwise returns false.',
      isEditable: false,
    }),
  },
  run({ inputs, outputs }) {
    outputs.result = inputs.a || inputs.b;
  },
});

export const not = createAction({
  group,
  icon: IconExclamationMark,
  description: 'Negate a value.',
  inputs: {
    a: pin.unknown({
      label: null,
    }),
  },
  outputs: {
    result: pin.boolean({
      label: null,
      description: 'Returns the negation of a.',
      isEditable: false,
    }),
  },
  run({ inputs, outputs }) {
    outputs.result = !inputs.a;
  },
});

export const ternary = createAction({
  group,
  description: 'Return one of two values based on a condition.',
  icon: IconQuestionMark,
  inputs: {
    trueValue: pin.unknown({
      description: 'The value to return if condition is true.',
    }),
    falseValue: pin.unknown({
      description: 'The value to return if condition is false.',
    }),
    condition: pin.boolean({
      description: 'The condition to evaluate.',
    }),
  },
  outputs: {
    result: pin.unknown({
      label: null,
      description:
        'Returns trueValue if condition is true, otherwise returns falseValue.',
    }),
  },
  run({ inputs, outputs }) {
    outputs.result = inputs.condition ? inputs.trueValue : inputs.falseValue;
  },
});
