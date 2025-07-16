import {
  type CreateDomainOptions,
  type GetDomainResponseSuccess,
  type ListDomainsResponseSuccess,
} from 'resend';
import * as v from 'valibot';

import * as i from '@xentom/integration-framework';

import * as common from './common';

export const id = common.uuid.with({
  displayName: 'Domain ID',
  description: 'The unique identifier for the domain.',
});

export const name = i.pins.data({
  description: 'The domain name.',
  control: i.controls.text({
    placeholder: 'example.com',
  }),
  schema: v.pipe(v.string(), v.minLength(1)),
});

export const region = i.pins.data<NonNullable<CreateDomainOptions['region']>>({
  description: 'The region where emails will be sent from.',
  control: i.controls.select({
    options: [
      { label: 'US East 1', value: 'us-east-1' },
      { label: 'EU West 1', value: 'eu-west-1' },
      { label: 'SA East 1', value: 'sa-east-1' },
      { label: 'AP Northeast 1', value: 'ap-northeast-1' },
    ],
  }),
  schema: v.picklist(['us-east-1', 'eu-west-1', 'sa-east-1', 'ap-northeast-1']),
});

export const returnPath = i.pins.data({
  description: 'Custom return path for SPF authentication.',
  control: i.controls.text({
    placeholder: 'send',
  }),
  schema: v.pipe(v.string(), v.minLength(1)),
});

export const object = i.pins.data<GetDomainResponseSuccess>({
  description: 'A domain object containing all domain information.',
});

export const list = i.pins.data<ListDomainsResponseSuccess>({
  description: 'A list of domains.',
});
