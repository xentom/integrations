import * as i from '@xentom/integration-framework';
import * as v from 'valibot';

import { type sheets_v4 } from 'googleapis/build/src/apis/sheets/v4';

export const item = i.pins.data<sheets_v4.Schema$Spreadsheet>({
  displayName: 'Spreadsheet',
  description: 'The Google Spreadsheet',
});

export const id = i.pins.data({
  displayName: 'Spreadsheet ID',
  description: 'The unique identifier of the Google Spreadsheet',
  schema: v.pipe(v.string(), v.nonEmpty()),
  control: i.controls.text(),
});
