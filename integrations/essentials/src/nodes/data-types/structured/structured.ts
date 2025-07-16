import * as v from 'valibot';

import * as i from '@xentom/integration-framework';

const category = {
  path: ['DataTypes', 'Structured'],
} satisfies i.NodeCategory;

export const html = i.nodes.pure({
  category,
  displayName: 'HTML',
  outputs: {
    value: i.pins.data({
      displayName: false,
      control: i.controls.text({
        language: i.TextControlLanguage.Html,
        defaultValue: '<h1>HTML</h1>',
      }),
      schema: v.string(),
    }),
  },
});

export const markdown = i.nodes.pure({
  category,
  outputs: {
    value: i.pins.data({
      displayName: false,
      control: i.controls.text({
        language: i.TextControlLanguage.Markdown,
        defaultValue: '# Markdown',
      }),
      schema: v.string(),
    }),
  },
});
