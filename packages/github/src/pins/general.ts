import * as i from '@xentom/integration-framework'
import * as v from 'valibot'

export const markdown = i.pins.data({
  description: 'The markdown content',
  schema: v.string(),
  control: i.controls.text({
    language: i.TextControlLanguage.Markdown,
    placeholder: 'Markdown content',
    rows: 2,
  }),
})
