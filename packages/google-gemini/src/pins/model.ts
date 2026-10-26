import * as i from '@xentom/integration-framework'
import * as v from 'valibot'

export const id = i.pins.data({
  displayName: 'Model',
  description: 'The Gemini model to use for generation.',
  schema: v.string(),
  control: i.controls.select<string>({
    default: 'gemini-2.5-flash',
    options(opts) {
      return {
        items: opts.state.models
          .filter((model) => {
            const name = model.name ?? ''
            return (
              name.startsWith('models/gemini-') ||
              name.startsWith('models/imagen-')
            )
          })
          .map((model) => ({
            value: (model.name ?? '').replace(/^models\//, ''),
            label:
              model.displayName ?? (model.name ?? '').replace(/^models\//, ''),
          })),
      }
    },
  }),
})
