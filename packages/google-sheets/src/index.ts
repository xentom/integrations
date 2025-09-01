import { sheets_v4 } from '@googleapis/sheets';
import { JWT } from 'google-auth-library';
import * as v from 'valibot';

import * as i from '@xentom/integration-framework';

import * as nodes from './nodes';

export interface IntegrationState {
  sheets: sheets_v4.Sheets;
}

export default i.integration({
  nodes,
  env: {
    GOOGLE_SERVICE_ACCOUNT_EMAIL: i.env({
      control: i.controls.text({
        label: 'Service Account Email',
        description:
          'The service account client email from your Google Cloud credentials.',
        placeholder: 'service-account@project.iam.gserviceaccount.com',
      }),
      schema: v.pipe(v.string(), v.minLength(3)),
    }),
    GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY: i.env({
      control: i.controls.text({
        label: 'Service Account Private Key',
        description:
          'The private key for your service account. Paste the full key including BEGIN/END lines. Newlines (\\n) are normalized.',
        sensitive: true,
      }),
      schema: v.pipe(v.string(), v.minLength(10)),
    }),
  },

  start(opts) {
    const email = process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL;
    const rawKey = process.env.GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY;
    const key = rawKey ? rawKey.replace(/\\n/g, '\n') : undefined;
    console.log(email, rawKey);
    const auth = new JWT({
      email,
      key,
      scopes: ['https://www.googleapis.com/auth/spreadsheets'],
    });

    opts.state.sheets = new sheets_v4.Sheets({ auth });
  },
});
