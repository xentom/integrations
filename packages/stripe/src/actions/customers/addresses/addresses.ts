import * as pins from '@/pins';
import { IconMap } from '@tabler/icons-react';
import { createAction, pin } from '@xentom/integration';

const group = 'Customers/Addresses';

export const address = createAction({
  group,
  icon: IconMap,
  inputs: {
    country: pin.string({
      description: 'Two-letter country code (ISO 3166-1 alpha-2).',
      placeholder: 'US',
      isOptional: true,
    }),
    state: pin.string({
      description: 'State, county, province, or region.',
      placeholder: 'CA',
      isOptional: true,
    }),
    city: pin.string({
      description: 'City, district, suburb, town, or village.',
      placeholder: 'San Francisco',
      isOptional: true,
    }),
    postal_code: pin.string({
      description: 'ZIP or postal code.',
      isOptional: true,
    }),
    line1: pin.string({
      description: 'Address line 1 (e.g., street, PO Box, or company name).',
      isOptional: true,
    }),
    line2: pin.string({
      description:
        'Address line 2 (e.g., apartment, suite, unit, or building).',
      isOptional: true,
    }),
  },
  outputs: {
    address: pins.address,
  },
  run({ inputs, outputs }) {
    outputs.address = {
      ...inputs,
    };
  },
});
