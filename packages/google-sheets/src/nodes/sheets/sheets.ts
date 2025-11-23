import * as i from '@xentom/integration-framework'

import { type sheets_v4 } from 'googleapis/build/src/apis/sheets/v4'

import * as pins from '@/pins'

const nodes = i.nodes.group('Sheets')

export const onNewSheet = nodes.trigger({
  description: 'Trigger when a new sheet is added to a Google Spreadsheet',
  inputs: {
    spreadsheetId: pins.spreadsheet.id,
  },
  outputs: {
    sheet: i.pins.data<sheets_v4.Schema$Sheet>({
      displayName: 'Sheet',
    }),
  },
  async subscribe(opts) {
    let lastSheetCount = 0
    let lastSheetIds = new Set<number>()

    const checkForNewSheets = async () => {
      const response = await opts.state.sheets.spreadsheets.get({
        spreadsheetId: opts.inputs.spreadsheetId,
      })

      const sheets = response.data.sheets ?? []
      const currentSheetCount = sheets.length

      if (lastSheetCount === 0) {
        lastSheetCount = currentSheetCount
        lastSheetIds = new Set(
          sheets
            .map((sheet) => sheet.properties?.sheetId)
            .filter((id): id is number => id !== undefined),
        )
        return
      }

      if (currentSheetCount > lastSheetCount) {
        const newSheets = sheets.filter((sheet) => {
          return (
            sheet.properties?.sheetId != null &&
            !lastSheetIds.has(sheet.properties.sheetId)
          )
        })

        for (const sheet of newSheets) {
          if (sheet.properties?.sheetId != null) {
            lastSheetIds.add(sheet.properties.sheetId)
            void opts.next({
              sheet,
            })
          }
        }

        lastSheetCount = currentSheetCount
      }
    }

    const channelId = `${opts.node.id}-${Date.now()}`

    await opts.state.drive.files.watch({
      fileId: opts.inputs.spreadsheetId,
      requestBody: {
        id: channelId,
        type: 'web_hook',
        address: opts.webhook.url,
      },
    })

    const unsubscribe = opts.webhook.subscribe(async () => {
      await checkForNewSheets()
    })

    return async () => {
      unsubscribe()

      await opts.state.drive.channels.stop({
        requestBody: {
          id: channelId,
          resourceId: opts.inputs.spreadsheetId,
        },
      })
    }
  },
})

export const addSheet = nodes.callable({
  displayName: 'Add Sheet',
  description: 'Add a new sheet to an existing Google Spreadsheet',
  inputs: {
    spreadsheetId: pins.spreadsheet.id,
    title: pins.sheet.name.with({
      description: 'Name for the new sheet',
      control: i.controls.text({
        placeholder: 'Q1 Budget',
      }),
    }),
    index: pins.sheet.index.with({
      optional: true,
    }),
  },
  outputs: {
    sheet: i.pins.data<sheets_v4.Schema$Sheet>({
      displayName: 'Sheet',
    }),
  },
  async run(opts) {
    const response = await opts.state.sheets.spreadsheets.batchUpdate({
      spreadsheetId: opts.inputs.spreadsheetId,
      requestBody: {
        requests: [
          {
            addSheet: {
              properties: {
                title: opts.inputs.title,
                index: opts.inputs.index,
              },
            },
          },
        ],
      },
    })

    const properties = response.data.replies?.[0]?.addSheet?.properties
    if (properties?.sheetId == null) {
      throw new Error('Failed to create sheet')
    }

    return opts.next({
      sheet: {
        properties,
      },
    })
  },
})

export const renameSheet = nodes.callable({
  displayName: 'Rename Sheet',
  description: 'Rename an existing sheet in a Google Spreadsheet',
  inputs: {
    spreadsheetId: pins.spreadsheet.id,
    sheetId: pins.sheet.id,
    newName: pins.sheet.name.with({
      description: 'New name for the sheet',
      control: i.controls.text({
        placeholder: 'Quarterly Plan',
      }),
    }),
  },
  outputs: {
    sheet: i.pins.data<sheets_v4.Schema$Sheet>({
      displayName: 'Sheet',
    }),
  },
  async run(opts) {
    await opts.state.sheets.spreadsheets.batchUpdate({
      spreadsheetId: opts.inputs.spreadsheetId,
      requestBody: {
        requests: [
          {
            updateSheetProperties: {
              properties: {
                sheetId: opts.inputs.sheetId,
                title: opts.inputs.newName,
              },
              fields: 'title',
            },
          },
        ],
      },
    })

    const sheetResponse = await opts.state.sheets.spreadsheets.get({
      spreadsheetId: opts.inputs.spreadsheetId,
    })

    const sheet = (sheetResponse.data.sheets ?? []).find((item) => {
      return item?.properties?.sheetId === opts.inputs.sheetId
    })

    if (sheet?.properties?.title == null) {
      throw new Error('Failed to load renamed sheet')
    }

    return opts.next({
      sheet,
    })
  },
})

export const deleteSheet = nodes.callable({
  displayName: 'Delete Sheet',
  description: 'Delete a sheet from a Google Spreadsheet',
  inputs: {
    spreadsheetId: pins.spreadsheet.id,
    sheetId: pins.sheet.id,
  },
  async run(opts) {
    await opts.state.sheets.spreadsheets.batchUpdate({
      spreadsheetId: opts.inputs.spreadsheetId,
      requestBody: {
        requests: [
          {
            deleteSheet: {
              sheetId: opts.inputs.sheetId,
            },
          },
        ],
      },
    })

    return opts.next()
  },
})
