import * as i from '@xentom/integration-framework'
import * as v from 'valibot'

import { type Domain, type DomainRegion } from 'resend'

import * as common from './common'

export const item = i.pins.data<Domain>({
  description: 'A domain object containing all domain information.',
})

export const items = i.pins.data<Domain[]>({
  description: 'A list of domains.',
})

export const id = common.uuid.with({
  displayName: 'Domain ID',
  description: 'The unique identifier for the domain.',
  control: i.controls.select({
    async options({ state }) {
      const response = await state.resend.domains.list()
      if (!response.data) {
        return []
      }

      return response.data.data.map((domain) => {
        return {
          value: domain.id,
          label: domain.name,
          suffix: domain.id,
        }
      })
    },
  }),
})

export const name = i.pins.data({
  description: 'The domain name.',
  schema: v.pipe(v.string(), v.minLength(1)),
  control: i.controls.text({
    placeholder: 'example.com',
  }),
})

export const region = i.pins.data<DomainRegion>({
  description: 'The region where emails will be sent from.',
  schema: v.picklist(['us-east-1', 'eu-west-1', 'sa-east-1', 'ap-northeast-1']),
  control: i.controls.select({
    options: [
      { label: 'US East 1', value: 'us-east-1' },
      { label: 'EU West 1', value: 'eu-west-1' },
      { label: 'SA East 1', value: 'sa-east-1' },
      { label: 'AP Northeast 1', value: 'ap-northeast-1' },
    ],
  }),
})

export const returnPath = i.pins.data({
  description: 'Custom return path for SPF authentication.',
  schema: v.pipe(v.string(), v.minLength(1)),
  control: i.controls.text({
    placeholder: 'send',
  }),
})
