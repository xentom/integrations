import * as i from '@xentom/integration-framework'
import * as v from 'valibot'

const nodes = i.nodes.group('Data types/Structured')

export const html = nodes.pure({
  displayName: 'HTML',
  outputs: {
    value: i.pins.data({
      displayName: false,
      control: i.controls.text({
        syntax: i.TextControlSyntax.Html,
        default: '<h1>HTML</h1>',
      }),
      schema: v.string(),
    }),
  },
})

export const markdown = nodes.pure({
  outputs: {
    value: i.pins.data({
      displayName: false,
      control: i.controls.text({
        syntax: i.TextControlSyntax.Markdown,
        default: '# Markdown',
      }),
      schema: v.string(),
    }),
  },
})
