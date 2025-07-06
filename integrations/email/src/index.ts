import { createTransport, type Transporter } from 'nodemailer';
import * as v from 'valibot';

import * as i from '@acme/integration-framework';

import * as nodes from './nodes';

v.setGlobalConfig({
  abortEarly: true,
  abortPipeEarly: true,
});

export interface IntegrationState {
  transporter: Transporter;
}

export default i.integration({
  nodes,

  env: {
    EMAIL_HOST: i.env({
      control: i.controls.text({
        label: 'SMTP Host',
        description: 'The hostname of your SMTP server',
        placeholder: 'smtp.gmail.com',
      }),
      schema: v.pipe(v.string(), v.minLength(1)),
    }),
    EMAIL_PORT: i.env({
      control: i.controls.text({
        label: 'SMTP Port',
        description: 'The port number for your SMTP server',
        placeholder: '587',
      }),
      schema: v.pipe(
        v.string(),
        v.transform((val) => parseInt(val, 10)),
        v.number(),
        v.integer(),
        v.minValue(1),
        v.maxValue(65535),
      ),
    }),
    EMAIL_SECURE: i.env({
      control: i.controls.switch({
        label: 'Use SSL/TLS',
        description: 'Whether to use SSL/TLS encryption',
        defaultValue: true,
      }),
      schema: v.pipe(
        v.string(),
        v.transform((val) => val === 'true'),
        v.boolean(),
      ),
    }),
    EMAIL_USER: i.env({
      control: i.controls.text({
        label: 'Username',
        description: 'Your SMTP username/email address',
        placeholder: 'your-email@example.com',
      }),
      schema: v.pipe(v.string(), v.minLength(1)),
    }),
    EMAIL_PASSWORD: i.env({
      control: i.controls.text({
        label: 'Password',
        description: 'Your SMTP password or app password',
        sensitive: true,
      }),
      schema: v.pipe(v.string(), v.minLength(1)),
    }),
  },

  start(opts) {
    opts.state.transporter = createTransport({
      host: process.env.EMAIL_HOST,
      port: process.env.EMAIL_PORT,
      secure: process.env.EMAIL_SECURE,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD,
      },
    });
  },
});
