import * as i from '@xentom/integration-framework'
import * as v from 'valibot'

export const name = i.pins.data({
  description: 'The name of the Google Sheet',
  schema: v.pipe(v.string(), v.nonEmpty()),
  control: i.controls.select({
    async options(opts) {
      if (!opts.node.inputs.spreadsheetId) {
        throw new Error('Spreadsheet ID is required')
      }

      const response = await opts.state.sheets.spreadsheets.get({
        spreadsheetId: opts.node.inputs.spreadsheetId as string,
      })

      const options: i.SelectControlOption<string>[] = []
      for (const sheet of response.data.sheets ?? []) {
        if (sheet.properties?.title == null) {
          continue
        }

        options.push({
          value: sheet.properties.title,
        })
      }

      return options
    },
  }),
})
