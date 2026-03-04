import * as i from '@xentom/integration-framework'
import * as v from 'valibot'

export const id = i.pins.data({
  displayName: 'Sheet ID',
  description: 'The numeric ID of the sheet within a spreadsheet',
  schema: v.number(),
  control: i.controls.select<number>({
    async options(opts) {
      if (!opts.node.inputs.spreadsheetId) {
        throw new Error('Spreadsheet ID is required')
      }

      const response = await opts.state.sheets.spreadsheets.get({
        spreadsheetId: opts.node.inputs.spreadsheetId as string,
      })

      const items: i.SelectControlOption<number>[] = []
      for (const sheet of response.data.sheets ?? []) {
        const sheetId = sheet.properties?.sheetId
        const title = sheet.properties?.title

        if (sheetId == null || title == null) {
          continue
        }

        items.push({
          value: sheetId,
          label: title,
          suffix: `${sheetId}`,
        })
      }

      return { items }
    },
  }),
})

export const name = i.pins.data({
  description: 'The name of the Google Sheet',
  schema: v.pipe(v.string(), v.nonEmpty()),
  control: i.controls.select<string>({
    async options(opts) {
      if (!opts.node.inputs.spreadsheetId) {
        throw new Error('Spreadsheet ID is required')
      }

      const response = await opts.state.sheets.spreadsheets.get({
        spreadsheetId: opts.node.inputs.spreadsheetId as string,
      })

      const items: i.SelectControlOption<string>[] = []
      for (const sheet of response.data.sheets ?? []) {
        if (sheet.properties?.title == null) {
          continue
        }

        items.push({
          value: sheet.properties.title,
        })
      }

      return { items }
    },
  }),
})

export const index = i.pins.data({
  displayName: 'Sheet Index',
  description: 'Zero-based position of the sheet in the spreadsheet',
  schema: v.pipe(v.number(), v.minValue(0)),
  control: i.controls.expression({
    placeholder: '0',
  }),
})
