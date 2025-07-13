import * as v from 'valibot';

import * as i from '@acme/integration-framework';

import * as nodes from './nodes';

export interface IntegrationState {
  snapshots: Map<string, unknown>;
}

export default i.integration({
  nodes,

  env: {
    SNAPSHOTS_FILE: i.env({
      control: i.controls.text({
        description:
          'Path to the file where test snapshots will be stored. Defaults to `snapshots.json`.',
        defaultValue: 'snapshots.json',
      }),
      schema: v.string(),
    }),
  },

  async start(opts) {
    opts.state.snapshots = new Map();

    try {
      const snapshotFile = Bun.file(process.env.SNAPSHOTS_FILE);
      const snapshots = (await snapshotFile.json()) as Record<string, unknown>;

      opts.state.snapshots = new Map(Object.entries(snapshots));
    } catch {
      // Do nothing
    }
  },

  async stop(opts) {
    await Bun.write(
      process.env.SNAPSHOTS_FILE,
      JSON.stringify(Object.fromEntries(opts.state.snapshots)),
    );
  },
});
