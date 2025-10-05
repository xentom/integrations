import * as i from '@xentom/integration-framework';
import * as v from 'valibot';

import mime from 'mime';

const nodes = i.nodes.group('Files');

export const file = nodes.pure({
  inputs: {
    name: i.pins.data({
      description: 'Name of the file',
      schema: v.string(),
      control: i.controls.text({
        placeholder: 'example.txt',
      }),
    }),
    content: i.pins.data({
      description: 'Content of the file',
      schema: v.string(),
      control: i.controls.text(),
    }),
  },
  outputs: {
    file: i.pins.data<File>({
      description: 'File object created from the provided name and content',
    }),
  },
  run(opts) {
    opts.outputs.file = new File([opts.inputs.content], opts.inputs.name, {
      type: mime.getType(opts.inputs.name) ?? undefined,
    });
  },
});
