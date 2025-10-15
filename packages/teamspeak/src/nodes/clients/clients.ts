import * as i from '@xentom/integration-framework';

import * as pins from '@/pins';

const nodes = i.nodes.group('Clients');

export const listClients = nodes.pure({
  description: 'List all TeamSpeak clients',
  outputs: {
    clients: pins.client.items.output,
  },
  async run(opts) {
    opts.outputs.clients = await opts.state.teamspeak.clientList();
  },
});
