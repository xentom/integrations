import * as i from '@xentom/integration-framework'

import * as pins from '@/pins'

const nodes = i.nodes.group('Spreadsheets')

export const getSpreadsheet = nodes.callable({
  displayName: 'Get Spreadsheet',
  description: 'Retrieve metadata about a Google Spreadsheet',
  inputs: {
    spreadsheetId: pins.spreadsheet.id,
  },
  outputs: {
    spreadsheet: pins.spreadsheet.item,
  },
  async run(opts) {
    const response = await opts.state.sheets.spreadsheets.get({
      spreadsheetId: opts.inputs.spreadsheetId,
    })

    return opts.next({
      spreadsheet: response.data,
    })
  },
})

export const createSpreadsheet = nodes.callable({
  displayName: 'Create Spreadsheet',
  description: 'Create a new Google Spreadsheet with the given title',
  inputs: {
    title: pins.spreadsheet.title,
  },
  outputs: {
    spreadsheet: pins.spreadsheet.item,
    spreadsheetId: pins.spreadsheet.id.with({
      control: false,
    }),
  },
  async run(opts) {
    const response = await opts.state.sheets.spreadsheets.create({
      requestBody: {
        properties: {
          title: opts.inputs.title,
        },
      },
    })

    return opts.next({
      spreadsheet: response.data,
      spreadsheetId: response.data.spreadsheetId ?? '',
    })
  },
})

export const deleteSpreadsheet = nodes.callable({
  displayName: 'Delete Spreadsheet',
  description: 'Permanently delete a Google Spreadsheet',
  inputs: {
    spreadsheetId: pins.spreadsheet.id,
  },
  async run(opts) {
    await opts.state.drive.files.delete({
      fileId: opts.inputs.spreadsheetId,
    })

    return opts.next()
  },
})
