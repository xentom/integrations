import * as pins from '@/pins';
import { type sheets_v4 } from '@googleapis/sheets';
import * as v from 'valibot';

import * as i from '@xentom/integration-framework';

const category = {
  path: ['Spreadsheets'],
} satisfies i.NodeCategory;

export const getValues = i.nodes.callable({
  category,
  description: 'Read a range of values from a spreadsheet.',
  inputs: {
    spreadsheetId: pins.spreadsheet.id,
    range: pins.range.a1Notation,
    majorDimension: i.pins.data({
      description: 'The major dimension that results should use.',
      control: i.controls.select({
        options: [
          { label: 'ROWS', value: 'ROWS' },
          { label: 'COLUMNS', value: 'COLUMNS' },
        ],
      }),
      schema: v.picklist(['ROWS', 'COLUMNS'] as const),
    }),
    valueRenderOption: i.pins.data({
      description: 'How values should be represented in the output.',
      control: i.controls.select({
        options: [
          { label: 'FORMATTED_VALUE', value: 'FORMATTED_VALUE' },
          { label: 'UNFORMATTED_VALUE', value: 'UNFORMATTED_VALUE' },
          { label: 'FORMULA', value: 'FORMULA' },
        ],
      }),
      schema: v.picklist([
        'FORMATTED_VALUE',
        'UNFORMATTED_VALUE',
        'FORMULA',
      ] as const),
      optional: true,
    }),
    dateTimeRenderOption: i.pins.data({
      description: 'How dates, times, and durations should be represented.',
      control: i.controls.select({
        options: [
          { label: 'SERIAL_NUMBER', value: 'SERIAL_NUMBER' },
          { label: 'FORMATTED_STRING', value: 'FORMATTED_STRING' },
        ],
      }),
      schema: v.picklist(['SERIAL_NUMBER', 'FORMATTED_STRING'] as const),
      optional: true,
    }),
  },
  outputs: {
    values: pins.value.matrix.with<sheets_v4.Schema$ValueRange['values']>({
      description: 'The requested values as a 2D array.',
    }),
  },
  async run(opts) {
    const response = await opts.state.sheets.spreadsheets.values.get({
      spreadsheetId: opts.inputs.spreadsheetId,
      range: opts.inputs.range,
      majorDimension: opts.inputs.majorDimension,
      valueRenderOption: opts.inputs.valueRenderOption,
      dateTimeRenderOption: opts.inputs.dateTimeRenderOption,
    });

    return opts.next({ values: response.data.values ?? [] });
  },
});

export const appendValues = i.nodes.callable({
  category,
  description: 'Append rows or columns of values to a sheet.',
  inputs: {
    spreadsheetId: pins.spreadsheet.id,
    range: pins.range.a1Notation,
    inputOption: i.pins.data({
      description: 'How the input data should be interpreted.',
      control: i.controls.select({
        options: [
          { label: 'RAW', value: 'RAW' },
          { label: 'USER_ENTERED', value: 'USER_ENTERED' },
        ],
      }),
      schema: v.picklist(['RAW', 'USER_ENTERED'] as const),
    }),
    values: pins.value.matrix,
  },
  async run(opts) {
    await opts.state.sheets.spreadsheets.values.append({
      spreadsheetId: opts.inputs.spreadsheetId,
      range: opts.inputs.range,
      valueInputOption: opts.inputs.inputOption,
      requestBody: {
        values: opts.inputs.values,
      },
    });

    return opts.next();
  },
});

export const clearValues = i.nodes.callable({
  category,
  description: 'Clear values in a given range.',
  inputs: {
    spreadsheetId: pins.spreadsheet.id,
    range: pins.range.a1Notation,
  },
  async run(opts) {
    await opts.state.sheets.spreadsheets.values.clear({
      spreadsheetId: opts.inputs.spreadsheetId,
      range: opts.inputs.range,
    });

    return opts.next();
  },
});

export const createSpreadsheet = i.nodes.callable({
  category,
  description: 'Create a new spreadsheet and return its metadata.',
  inputs: {
    title: pins.spreadsheet.title.with({ optional: true }),
  },
  outputs: {
    id: pins.spreadsheet.id.with<string>({ description: 'Spreadsheet ID.' }),
    url: pins.spreadsheet.url.with<string>({ description: 'Spreadsheet URL.' }),
  },
  async run(opts) {
    const response = await opts.state.sheets.spreadsheets.create({
      requestBody: {
        properties: {
          title: opts.inputs.title,
        },
      },
    });

    const id = response.data.spreadsheetId ?? '';
    const url = response.data.spreadsheetUrl ?? '';
    return opts.next({ id, url });
  },
});
