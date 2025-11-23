import * as i from '@xentom/integration-framework'
import * as v from 'valibot'

export const range = i.pins.data({
  displayName: 'Range',
  description: 'The A1 notation of the range to access',
  schema: v.pipe(v.string(), v.nonEmpty()),
  control: i.controls.text({
    placeholder: 'A1:B10',
  }),
  examples: [
    {
      title: 'First 2 Rows & Columns',
      value: 'A1:B2',
    },
    {
      title: 'Entire Column A',
      value: 'A:A',
    },
    {
      title: 'First 2 Rows',
      value: '1:2',
    },
    {
      title: 'Column A From Row 5',
      value: 'A5:A',
    },
    {
      title: 'Range in Active Sheet',
      value: 'A1:B2',
    },
    {
      title: 'Whole Sheet',
      value: 'Sheet1',
    },
    {
      title: 'Custom Sheet Range',
      value: "'Jon's_Data'!A1:D5",
    },
    {
      title: 'Custom Sheet Column',
      value: "'My Custom Sheet'!A:A",
    },
    {
      title: 'Whole Custom Sheet',
      value: "'My Custom Sheet'",
    },
  ],
})

export const values = i.pins.data({
  displayName: 'Values',
  description: 'A 2D array of values',
  schema: v.array(v.array(v.any())),
  control: i.controls.expression({
    placeholder: '[["A", "B", "C"]]',
  }),
})
