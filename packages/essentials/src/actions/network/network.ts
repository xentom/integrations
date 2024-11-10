import * as pins from '@/pins';
import {
  IconArrowRightRhombus,
  IconBrackets,
  IconWorldUpload,
} from '@tabler/icons-react';
import { createAction, pin } from '@xentom/integration';

const group = 'Network';

export const request = createAction({
  group,
  icon: IconWorldUpload,
  description: 'Make an HTTP request.',
  inputs: {
    exec: pin.exec({
      async run({ inputs, next }) {
        next('exec', {
          response: await fetch(inputs.url, {
            method: inputs.method,
          }),
        });
      },
    }),
    method: pin.enum({
      description: 'The HTTP method to use.',
      options: [
        { value: 'GET' },
        { value: 'POST' },
        { value: 'PUT' },
        { value: 'DELETE' },
      ],
      defaultValue: 'GET',
    }),
    url: pin.string({
      label: 'URL',
      description: 'The URL to make the request to.',
      placeholder: 'https://example.com',
    }),
  },
  outputs: {
    exec: pin.exec(),
    response: pins.response,
  },
});

export const getResponseText = createAction({
  group,
  icon: IconArrowRightRhombus,
  description: 'Get the text content from a response.',
  inputs: {
    response: pins.response,
  },
  outputs: {
    text: pin.string({
      description: 'The text content of the response.',
      isEditable: false,
    }),
  },
  async run({ inputs, outputs }) {
    outputs.text = await (inputs.response as Response).text();
  },
});

export const getResponseJson = createAction({
  group,
  icon: IconArrowRightRhombus,
  displayName: 'Get Response JSON',
  description: 'Get the JSON content from a response.',
  inputs: {
    response: pins.response,
  },
  outputs: {
    json: pin
      .custom<string | number | boolean | Record<string, unknown>>()
      .extend({
        description: 'The JSON content of the response.',
        label: 'JSON',
      }),
  },
  async run({ inputs, outputs }) {
    outputs.json = await (inputs.response as Response).json();
  },
});

export const getResponseArrayBuffer = createAction({
  group,
  icon: IconArrowRightRhombus,
  description: 'Get the array buffer content from a response.',
  inputs: {
    response: pins.response,
  },
  outputs: {
    arrayBuffer: pin.custom<ArrayBuffer>().extend({
      icon: IconBrackets,
      description: 'The array buffer content of the response.',
    }),
  },
  async run({ inputs, outputs }) {
    outputs.arrayBuffer = await (inputs.response as Response).arrayBuffer();
  },
});
