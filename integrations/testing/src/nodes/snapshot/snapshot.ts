import * as pins from '@/pins';
import { expect } from 'bun:test';
import * as v from 'valibot';

import * as i from '@acme/integration-framework';

import { writeSnapshots } from './utils';

const category = {
  path: ['Testing', 'Snapshot'],
} satisfies i.NodeCategory;

let timeout: NodeJS.Timeout | null = null;

export const toMatchSnapshot = i.nodes.pure({
  category,
  description: 'Assert that a value matches the most recent snapshot',
  inputs: {
    actual: pins.expect.actual,
    hint: i.pins.data({
      description: 'Hint used to identify the snapshot in the snapshot file',
      control: i.controls.text(),
      schema: v.string(),
      optional: true,
    }),
    not: pins.expect.not,
  },
  run(opts) {
    const key = opts.inputs.hint
      ? `${opts.node.id}:${opts.inputs.hint}`
      : opts.node.id;

    if (!opts.state.snapshots.has(key)) {
      opts.state.snapshots.set(key, opts.inputs.actual);
    }

    const expected = opts.state.snapshots.get(key);
    if (opts.inputs.not) {
      expect(opts.inputs.actual).not.toEqual(expected);
    } else {
      expect(opts.inputs.actual).toEqual(expected);
    }

    if (timeout) {
      clearTimeout(timeout);
    }

    timeout = setTimeout(() => {
      void writeSnapshots(opts.state.snapshots);
    }, 1000);
  },
});
