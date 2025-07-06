import * as v from 'valibot';

import * as i from '@acme/integration-framework';

const category = {
  path: ['Email'],
} satisfies i.NodeCategory;

export const sendEmail = i.nodes.callable({
  category,
  displayName: 'Send Email',
  description: 'Send an email using SMTP configuration',
  inputs: {
    from: i.pins.data({
      description: 'The sender email address',
      schema: v.pipe(v.string(), v.email()),
      control: i.controls.text({
        placeholder: 'sender@example.com',
      }),
    }),
    to: i.pins.data({
      description: 'The recipient email address(es)',
      schema: v.union([
        v.pipe(v.string(), v.email()),
        v.array(v.pipe(v.string(), v.email())),
      ]),
      control: i.controls.text({
        placeholder: 'recipient@example.com',
      }),
    }),
    cc: i.pins.data({
      description: 'CC recipient email address(es)',
      schema: v.optional(
        v.union([
          v.pipe(v.string(), v.email()),
          v.array(v.pipe(v.string(), v.email())),
        ]),
      ),
      control: i.controls.text({
        placeholder: 'cc@example.com',
      }),
    }),
    bcc: i.pins.data({
      description: 'BCC recipient email address(es)',
      schema: v.optional(
        v.union([
          v.pipe(v.string(), v.email()),
          v.array(v.pipe(v.string(), v.email())),
        ]),
      ),
      control: i.controls.text({
        placeholder: 'bcc@example.com',
      }),
    }),
    subject: i.pins.data({
      description: 'The email subject line',
      schema: v.pipe(v.string(), v.minLength(1)),
      control: i.controls.text({
        placeholder: 'Email subject',
      }),
    }),
    text: i.pins.data({
      description: 'The plain text email body',
      schema: v.optional(v.string()),
      control: i.controls.text({
        placeholder: 'Plain text email content...',
      }),
    }),
    html: i.pins.data({
      description: 'The HTML email body',
      schema: v.optional(v.string()),
      control: i.controls.text({
        placeholder: '<h1>HTML email content</h1>',
      }),
    }),
  },
  async run(opts) {
    console.log(opts.inputs);
    const { from, to, cc, bcc, subject, text, html } = opts.inputs;

    if (!text && !html) {
      throw new Error('Either text or html content must be provided');
    }

    try {
      await opts.state.transporter.sendMail({
        from,
        to,
        subject,
        text,
        html,
        cc,
        bcc,
      });

      return opts.next();
    } catch (error) {
      console.error(error);
      throw error;
    }
  },
});
