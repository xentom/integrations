import * as v from 'valibot';

import * as i from '@xentom/integration-framework';

export const id = i.pins.data({
  displayName: 'Spreadsheet ID',
  description: 'The unique identifier of a Google Spreadsheet.',
  control: i.controls.text({
    placeholder: '1A2B3C... (from the spreadsheet URL)',
  }),
  schema: v.pipe(v.string(), v.minLength(10)),
});

export const title = i.pins.data({
  description: 'Spreadsheet title.',
  control: i.controls.text({
    placeholder: 'My Spreadsheet',
  }),
  schema: v.string(),
});

export const url = i.pins.data({
  displayName: 'Spreadsheet URL',
  description: 'Web URL for the spreadsheet.',
  control: i.controls.text({
    placeholder: 'https://docs.google.com/spreadsheets/d/...',
  }),
  schema: v.pipe(v.string(), v.url('Must be a valid Google Sheets URL')),
});
