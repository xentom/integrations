import * as i from '@xentom/integration-framework';
import * as v from 'valibot';

import * as pins from '../../pins';

const nodes = i.nodes.group('Messages');

// export const onMessage = nodes.trigger({
//   description: 'Trigger when a new message is received',
//   inputs: {
//     projectId: i.pins.data({
//       displayName: 'Project ID',
//       schema: v.string(),
//       control: i.controls.text(),
//     }),
//   },
//   outputs: {
//     message: pins.message.message,
//   },
//   async subscribe(opts) {
//     console.log(opts.inputs.projectId);

//     const topicPath = await createTopic(opts.state.pubsub, {
//       projectId: opts.inputs.projectId,
//       topicName: 'xentom-gmail',
//     });

//     await createSubscription(opts.state.pubsub, {
//       projectId: opts.inputs.projectId,
//       subscriptionName: 'xentom-gmail-sub',
//       topicPath,
//       pushEndpoint: opts.webhook.url,
//     });

//     // Does not work because the oauth client credentials must be in the same project :(
//     const watch = await opts.state.gmail.users.watch({
//       userId: 'me',
//       requestBody: {
//         topicName: topicPath,
//         labelIds: ['INBOX'],
//         labelFilterBehavior: 'include',
//       },
//     });

//     let lastHistoryId = watch.data.historyId;

//     opts.webhook.subscribe(async (request) => {
//       const payload = (await request.json()) as {
//         message: pubsub_v1.Schema$PubsubMessage;
//       };

//       if (!payload.message.data) {
//         return;
//       }

//       const notification = decodeGmailNotification(payload.message.data);

//       if (!lastHistoryId) {
//         lastHistoryId = notification.historyId;
//         return;
//       }

//       const response = await opts.state.gmail.users.history.list({
//         userId: notification.emailAddress ?? 'me',
//         startHistoryId: lastHistoryId,
//         historyTypes: ['messageAdded'],
//       });

//       const history = response.data.history ?? [];
//       const newMessageIds = history
//         .flatMap((history) => history.messagesAdded ?? [])
//         // eslint-disable-next-line @typescript-eslint/no-non-null-assertion, @typescript-eslint/no-non-null-asserted-optional-chain
//         .map((added) => added.message?.id!)
//         .filter(Boolean);

//       const promises = await Promise.allSettled(
//         newMessageIds.map(async (id) => {
//           try {
//             const response = await opts.state.gmail.users.messages.get({
//               userId: 'me',
//               id,
//             });

//             void opts.next({
//               message: response.data,
//             });
//           } catch (error) {
//             if (!isGaxiosError(error) || error.code !== 404) {
//               throw error;
//             }
//           }
//         }),
//       );

//       for (const promise of promises) {
//         if (promise.status === 'fulfilled') continue;
//         console.warn(`Failed to get message ${promise.reason}`);
//       }

//       lastHistoryId = notification.historyId;
//     });

//     return async () => {
//       await opts.state.gmail.users.stop({
//         userId: 'me',
//       });
//     };
//   },
// });

export const sendMessage = nodes.callable({
  description: 'Send an email message through Gmail',
  inputs: {
    to: pins.message.addresses,
    subject: pins.message.subject.with({
      optional: true,
    }),
    body: pins.message.body.with({
      optional: true,
    }),
    cc: pins.message.cc.with({
      optional: true,
    }),
    bcc: pins.message.bcc.with({
      optional: true,
    }),
  },
  outputs: {
    message: pins.message.item,
  },
  async run(opts) {
    const headers = [
      `To: ${opts.inputs.to.join(', ')}`,
      `Subject: ${opts.inputs.subject}`,
    ];

    if (opts.inputs.cc?.length) {
      headers.push(`Cc: ${opts.inputs.cc.join(', ')}`);
    }

    if (opts.inputs.bcc?.length) {
      headers.push(`Bcc: ${opts.inputs.bcc.join(', ')}`);
    }

    const content = [...headers, '', opts.inputs.body ?? ''].join('\r\n');
    const response = await opts.state.gmail.users.messages.send({
      userId: 'me',
      requestBody: {
        raw: Buffer.from(content).toString('base64url'),
      },
    });

    return opts.next({
      message: response.data,
    });
  },
});

export const getMessage = nodes.callable({
  description: 'Retrieve a specific Gmail message by ID',
  inputs: {
    id: pins.message.id,
    format: pins.query.messageFormat.with({
      optional: true,
    }),
  },
  outputs: {
    message: pins.message.item,
  },
  async run(opts) {
    const response = await opts.state.gmail.users.messages.get({
      userId: 'me',
      id: opts.inputs.id,
      format: opts.inputs.format,
    });

    return opts.next({
      message: response.data,
    });
  },
});

export const listMessages = nodes.callable({
  description: 'Search and retrieve Gmail messages',
  inputs: {
    query: pins.query.searchQuery.with({
      optional: true,
    }),
    labelIds: pins.label.ids.with({
      optional: true,
    }),
    maxResults: pins.query.maxResults.with({
      optional: true,
    }),
  },
  outputs: {
    messages: i.pins.data({
      displayName: 'Messages',
      schema: v.array(v.any()),
    }),
    resultSizeEstimate: i.pins.data({
      displayName: 'Total Results',
      schema: v.number(),
    }),
  },
  async run(opts) {
    const response = await opts.state.gmail.users.messages.list({
      userId: 'me',
      q: opts.inputs.query,
      labelIds: opts.inputs.labelIds,
      maxResults: opts.inputs.maxResults,
    });

    if (!response.data.messages) {
      return opts.next({
        messages: [],
        resultSizeEstimate: 0,
      });
    }

    return opts.next({
      messages: response.data.messages,
      resultSizeEstimate: response.data.resultSizeEstimate ?? 0,
    });
  },
});

export const deleteMessage = nodes.callable({
  description: 'Permanently delete a Gmail message',
  inputs: {
    id: pins.message.id,
  },
  async run(opts) {
    await opts.state.gmail.users.messages.delete({
      userId: 'me',
      id: opts.inputs.id,
    });
  },
});
