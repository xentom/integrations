import * as i from '@xentom/integration-framework'
import * as v from 'valibot'

import type Stripe from 'stripe'

import { getPagination } from '@/utils/pagination'
import * as common from './common'

export const eventType = i.pins.data({
  description: 'The type of plan event to trigger on.',
  control: i.controls.select({
    options: [
      { label: 'Created', value: 'created' },
      { label: 'Updated', value: 'updated' },
      { label: 'Deleted', value: 'deleted' },
    ],
    defaultValue: 'created',
  } as const),
})

export const id = i.pins.data({
  displayName: 'Plan ID',
  description: 'The unique identifier for the plan.',
  schema: v.pipe(v.string(), v.nonEmpty()),
  control: i.controls.select({
    async options({ state, pagination }) {
      const plans = await state.stripe.plans.list({
        ...getPagination(pagination),
      })

      return {
        hasMore: plans.has_more,
        items: plans.data.map((plan) => ({
          value: plan.id,
          label: plan.nickname || plan.id,
          suffix: `${plan.amount ? plan.amount / 100 : 0} ${plan.currency.toUpperCase()}/${plan.interval}`,
        })),
      }
    },
  }),
})

export const nickname = i.pins.data({
  description: 'A brief description of the plan, hidden from customers.',
  schema: v.string(),
  control: i.controls.text({
    placeholder: 'Basic Plan',
  }),
})

export const productId = i.pins.data({
  displayName: 'Product ID',
  description: 'The product whose pricing the plan determines.',
  schema: v.pipe(v.string(), v.startsWith('prod_')),
  control: i.controls.select({
    async options({ state, pagination, search }) {
      const products = search
        ? await state.stripe.products.search({
            ...getPagination(pagination),
            query: `name~"${search}"`,
          })
        : await state.stripe.products.list({
            ...getPagination(pagination),
          })

      return {
        hasMore: products.has_more,
        items: products.data.map((product) => ({
          value: product.id,
          label: product.name,
          suffix: product.id,
        })),
      }
    },
  }),
})

export const amount = common.amount.with({
  description:
    'The unit amount in the smallest currency unit. Use 0 for free plans.',
})

export const currency = common.currency.with({
  description: 'Three-letter ISO currency code for the plan.',
})

export const interval = i.pins.data<Stripe.PlanCreateParams.Interval>({
  description: 'The frequency at which a subscription is billed.',
  schema: v.picklist(['day', 'week', 'month', 'year']),
  control: i.controls.select({
    options: [
      { value: 'day', label: 'Daily' },
      { value: 'week', label: 'Weekly' },
      { value: 'month', label: 'Monthly' },
      { value: 'year', label: 'Yearly' },
    ],
    defaultValue: 'month',
  }),
})

export const intervalCount = i.pins.data({
  displayName: 'Interval Count',
  description:
    'The number of intervals between subscription billings. For example, interval=month and interval_count=3 bills every 3 months.',
  schema: v.pipe(v.number(), v.integer(), v.minValue(1)),
  control: i.controls.expression(),
})

export const trialPeriodDays = i.pins.data({
  displayName: 'Trial Period Days',
  description:
    'Default number of trial days when subscribing a customer to this plan.',
  schema: v.pipe(v.number(), v.integer(), v.minValue(1)),
  control: i.controls.expression(),
})

export const usageType = i.pins.data<Stripe.PlanCreateParams.UsageType>({
  displayName: 'Usage Type',
  description: 'Configures how the quantity per period should be determined.',
  schema: v.picklist(['metered', 'licensed']),
  control: i.controls.select({
    options: [
      { value: 'licensed', label: 'Licensed' },
      { value: 'metered', label: 'Metered' },
    ],
    defaultValue: 'licensed',
  }),
})

export const billingScheme = i.pins.data<Stripe.PlanCreateParams.BillingScheme>(
  {
    displayName: 'Billing Scheme',
    description: 'Describes how to compute the price per period.',
    schema: v.picklist(['per_unit', 'tiered']),
    control: i.controls.select({
      options: [
        { value: 'per_unit', label: 'Per Unit' },
        { value: 'tiered', label: 'Tiered' },
      ],
      defaultValue: 'per_unit',
    }),
  },
)

export const metadata = common.metadata.with({
  description:
    'Set of key-value pairs for storing additional information about the plan.',
})

export const active = i.pins.data({
  description: 'Whether the plan can be used for new purchases.',
  schema: v.boolean(),
  control: i.controls.switch(),
})
