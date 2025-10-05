import * as i from '@xentom/integration-framework';

import { type sheets_v4 } from 'googleapis/build/src/apis/sheets/v4';

import * as pins from '@/pins';

const nodes = i.nodes.group('Spreadsheets');

export const onNewSheet = nodes.trigger({
  description: 'Trigger when a new sheet is added to a Google Spreadsheet',
  inputs: {
    spreadsheetId: pins.spreadsheet.id,
  },
  outputs: {
    sheet: i.pins.data<sheets_v4.Schema$Sheet>({
      displayName: 'Sheet',
    }),
    sheetName: pins.sheet.name.with({
      control: false,
    }),
  },
  async subscribe(opts) {
    let lastSheetCount = 0;
    let lastSheetIds = new Set<number>();

    const checkForNewSheets = async () => {
      const response = await opts.state.sheets.spreadsheets.get({
        spreadsheetId: opts.inputs.spreadsheetId,
      });

      const sheets = response.data.sheets ?? [];
      const currentSheetCount = sheets.length;

      if (lastSheetCount === 0) {
        lastSheetCount = currentSheetCount;
        lastSheetIds = new Set(
          sheets
            .map((sheet) => sheet.properties?.sheetId)
            .filter((id): id is number => id !== undefined),
        );
        return;
      }

      if (currentSheetCount > lastSheetCount) {
        const newSheets = sheets.filter((sheet) => {
          return (
            sheet.properties?.sheetId != null &&
            !lastSheetIds.has(sheet.properties.sheetId)
          );
        });

        for (const sheet of newSheets) {
          if (sheet.properties?.sheetId != null) {
            lastSheetIds.add(sheet.properties.sheetId);
            void opts.next({
              sheet,
              sheetName: sheet.properties.title ?? '',
            });
          }
        }

        lastSheetCount = currentSheetCount;
      }
    };

    const channelId = `${opts.node.id}-${Date.now()}`;

    await opts.state.drive.files.watch({
      fileId: opts.inputs.spreadsheetId,
      requestBody: {
        id: channelId,
        type: 'web_hook',
        address: opts.webhook.url,
      },
    });

    const unsubscribe = opts.webhook.subscribe(async () => {
      await checkForNewSheets();
    });

    return async () => {
      unsubscribe();

      await opts.state.drive.channels.stop({
        requestBody: {
          id: channelId,
          resourceId: opts.inputs.spreadsheetId,
        },
      });
    };
  },
});

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
    });

    await opts.next({
      spreadsheet: response.data,
    });
  },
});
