import * as i from '@xentom/integration-framework';

import {
  type CreateDomainResponseSuccess,
  type GetDomainResponseSuccess,
  type ListDomainsResponseSuccess,
} from 'resend';

import * as pins from '@/pins';

const category = {
  path: ['Domains'],
} satisfies i.NodeCategory;

export const createDomain = i.nodes.callable({
  category,
  description: 'Create a new domain for sending emails.',

  inputs: {
    name: pins.domain.name.with({
      description: 'The domain name to create.',
    }),
    region: pins.domain.region.with({
      description: 'The region where emails will be sent from.',
      optional: true,
    }),
    returnPath: pins.domain.returnPath.with({
      description: 'Custom return path for SPF authentication.',
      optional: true,
    }),
  },

  outputs: {
    domain: pins.domain.item.with<CreateDomainResponseSuccess>({
      description: 'The created domain object.',
    }),
  },

  async run(opts) {
    const response = await opts.state.resend.domains.create({
      name: opts.inputs.name,
      region: opts.inputs.region,
      customReturnPath: opts.inputs.returnPath,
    });

    if (response.error) {
      throw new Error(response.error.message);
    }

    return opts.next({
      domain: response.data,
    });
  },
});

export const getDomain = i.nodes.callable({
  category,
  description: 'Retrieve details of a domain by its ID.',

  inputs: {
    id: pins.domain.id.with({
      description: 'The ID of the domain to retrieve.',
    }),
  },

  outputs: {
    domain: pins.domain.item.with<GetDomainResponseSuccess>({
      description: 'The domain object.',
    }),
  },

  async run(opts) {
    const response = await opts.state.resend.domains.get(opts.inputs.id);

    if (response.error) {
      throw new Error(response.error.message);
    }

    return opts.next({
      domain: response.data,
    });
  },
});

export const listDomains = i.nodes.callable({
  category,
  description: 'Retrieve a list of domains.',

  outputs: {
    domains: pins.domain.items.with<ListDomainsResponseSuccess>({
      description: 'The list of domains.',
    }),
  },

  async run(opts) {
    const response = await opts.state.resend.domains.list();

    if (response.error) {
      throw new Error(response.error.message);
    }

    return opts.next({
      domains: response.data,
    });
  },
});

export const verifyDomain = i.nodes.callable({
  category,
  description: 'Verify a domain by checking its DNS records.',

  inputs: {
    id: pins.domain.id.with({
      description: 'The ID of the domain to verify.',
    }),
  },

  outputs: {
    id: pins.domain.id.with({
      description: 'The ID of the verified domain.',
      control: false,
    }),
  },

  async run(opts) {
    const response = await opts.state.resend.domains.verify(opts.inputs.id);

    if (response.error) {
      throw new Error(response.error.message);
    }

    return opts.next({
      id: response.data.id,
    });
  },
});

export const deleteDomain = i.nodes.callable({
  category,
  description: 'Delete a domain by its ID.',

  inputs: {
    id: pins.domain.id.with({
      description: 'The ID of the domain to delete.',
    }),
  },

  outputs: {
    id: pins.domain.id.with({
      description: 'The ID of the deleted domain.',
      control: false,
    }),
  },

  async run(opts) {
    const response = await opts.state.resend.domains.remove(opts.inputs.id);

    if (response.error) {
      throw new Error(response.error.message);
    }

    if (!response.data.deleted) {
      throw new Error('Failed to delete domain');
    }

    return opts.next({
      id: response.data.id,
    });
  },
});
