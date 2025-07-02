import * as v from 'valibot';

import * as i from '@acme/integration';

const category = {
  path: ['DataTypes', 'Structured'],
} satisfies i.ActionCategory;

export const html = i.actions.pure({
  category,
  displayName: 'HTML',
  outputs: {
    value: i.pins.data({
      displayName: false,
      schema: v.string(),
      control: i.controls.text({
        language: i.TextControlLanguage.Html,
        defaultValue: '<h1>HTML</h1>',
      }),
    }),
  },
});

export const markdown = i.actions.pure({
  category,
  outputs: {
    value: i.pins.data({
      displayName: false,
      schema: v.string(),
      control: i.controls.text({
        language: i.TextControlLanguage.Markdown,
        defaultValue: '# Markdown',
      }),
    }),
  },
});
