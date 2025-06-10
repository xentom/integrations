import {
  actions,
  controls,
  InputControlLanguage,
  pins,
} from '@acme/integration';
import * as v from 'valibot';

export const html = actions.pure({
  category: 'DataTypes / Structured',
  displayName: 'HTML',
  outputs: {
    value: pins.data({
      isLabelVisible: false,
      schema: v.string(),
      control: controls.input({
        language: InputControlLanguage.Html,
        defaultValue: '<h1>HTML</h1>',
      }),
    }),
  },
});

export const json = actions.pure({
  category: 'DataTypes / Structured',
  displayName: 'JSON',
  outputs: {
    value: pins.data({
      isLabelVisible: false,
      schema: v.any(),
      control: controls.input({
        language: InputControlLanguage.Json,
        defaultValue: '{}',
      }),
    }),
  },
});

export const markdown = actions.pure({
  category: 'DataTypes / Structured',
  outputs: {
    value: pins.data({
      isLabelVisible: false,
      schema: v.string(),
      control: controls.input({
        language: InputControlLanguage.Markdown,
        defaultValue: '# Markdown',
      }),
    }),
  },
});

export const javascript = actions.pure({
  category: 'DataTypes / Structured',
  displayName: 'JavaScript',
  outputs: {
    value: pins.data({
      isLabelVisible: false,
      schema: v.string(),
      control: controls.input({
        language: InputControlLanguage.JavaScript,
        defaultValue: 'return { id: 1, name: "John Doe" }',
      }),
    }),
  },
});

export const typescript = actions.pure({
  category: 'DataTypes / Structured',
  displayName: 'TypeScript',
  outputs: {
    value: pins.data({
      isLabelVisible: false,
      schema: v.string(),
      control: controls.input({
        language: InputControlLanguage.TypeScript,
        defaultValue: 'return { id: 1, name: "John Doe" }',
      }),
    }),
  },
});
