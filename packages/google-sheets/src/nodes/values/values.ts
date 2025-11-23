import * as i from '@xentom/integration-framework'

import { type sheets_v4 } from 'googleapis/build/src/apis/sheets/v4'

import * as pins from '@/pins'

const nodes = i.nodes.group('Values')

export const getValues = nodes.callable({
  displayName: 'Get Values',
  description: 'Read values from a specified range in a Google Sheet',
  inputs: {
    spreadsheetId: pins.spreadsheet.id,
    range: pins.range.range,
    sheet: pins.sheet.name.with({
      optional: true,
    }),
  },
  outputs: {
    values: pins.range.values.with({
      control: false,
    }),
  },
  async run(opts) {
    const response = await opts.state.sheets.spreadsheets.values.get({
      spreadsheetId: opts.inputs.spreadsheetId,
      range: addSheetNameToRange(opts.inputs),
    })

    await opts.next({
      values: response.data.values ?? [],
    })
  },
})

export const updateValues = nodes.callable({
  displayName: 'Update Values',
  description: 'Write values to a specified range in a Google Sheet',
  inputs: {
    spreadsheetId: pins.spreadsheet.id,
    range: pins.range.range,
    values: pins.range.values,
    sheet: pins.sheet.name.with({
      optional: true,
    }),
  },
  outputs: {
    response: i.pins.data<sheets_v4.Schema$UpdateValuesResponse>(),
  },
  async run(opts) {
    const response = await opts.state.sheets.spreadsheets.values.update({
      spreadsheetId: opts.inputs.spreadsheetId,
      range: addSheetNameToRange(opts.inputs),
      valueInputOption: 'USER_ENTERED',
      requestBody: {
        values: opts.inputs.values,
      },
    })

    await opts.next({
      response: response.data,
    })
  },
})

export const appendValues = nodes.callable({
  displayName: 'Append Values',
  description:
    'Append values to the end of a specified range in a Google Sheet',
  inputs: {
    spreadsheetId: pins.spreadsheet.id,
    range: pins.range.range,
    values: pins.range.values,
    sheet: pins.sheet.name.with({
      optional: true,
    }),
  },
  outputs: {
    response: i.pins.data<sheets_v4.Schema$AppendValuesResponse>(),
  },
  async run(opts) {
    const response = await opts.state.sheets.spreadsheets.values.append({
      spreadsheetId: opts.inputs.spreadsheetId,
      range: addSheetNameToRange(opts.inputs),
      valueInputOption: 'USER_ENTERED',
      requestBody: {
        values: opts.inputs.values,
      },
    })

    await opts.next({
      response: response.data,
    })
  },
})

export const clearValues = nodes.callable({
  displayName: 'Clear Values',
  description: 'Clear values from a specified range in a Google Sheet',
  inputs: {
    spreadsheetId: pins.spreadsheet.id,
    range: pins.range.range,
    sheet: pins.sheet.name.with({
      optional: true,
    }),
  },
  outputs: {
    response: i.pins.data<sheets_v4.Schema$ClearValuesResponse>(),
  },
  async run(opts) {
    const response = await opts.state.sheets.spreadsheets.values.clear({
      spreadsheetId: opts.inputs.spreadsheetId,
      range: addSheetNameToRange(opts.inputs),
    })

    await opts.next({
      response: response.data,
    })
  },
})

function addSheetNameToRange(inputs: { range: string; sheet?: string }) {
  if (inputs.sheet && !inputs.range.includes('!')) {
    return `${inputs.sheet}!${inputs.range}`
  }

  return inputs.range
}
