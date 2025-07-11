import * as i from '@acme/integration-framework';

import * as pins from '../../pins';

const category = {
  path: ['Files'],
} satisfies i.NodeCategory;

export const listFiles = i.nodes.callable({
  category,
  description: 'List files in a Slack workspace.',

  inputs: {
    user: pins.file.userId.with({
      description: 'Filter files created by this user.',
      optional: true,
    }),
    channel: pins.file.channelId.with({
      description: 'Filter files appearing in this channel.',
      optional: true,
    }),
    tsFrom: pins.file.tsFrom.with({
      description: 'Filter files created after this timestamp.',
      optional: true,
    }),
    tsTo: pins.file.tsTo.with({
      description: 'Filter files created before this timestamp.',
      optional: true,
    }),
    types: pins.file.types.with({
      description: 'Filter by file type.',
      optional: true,
    }),
    limit: pins.common.limit.with({
      description: 'Number of items to return per page.',
      optional: true,
    }),
  },

  outputs: {
    response: pins.file.filesListResponse.with({
      description: 'List of files.',
    }),
  },

  async run(opts) {
    const response = await opts.state.slack.files.list({
      user: opts.inputs.user,
      channel: opts.inputs.channel,
      ts_from: opts.inputs.tsFrom,
      ts_to: opts.inputs.tsTo,
      types: opts.inputs.types,
      count: opts.inputs.limit,
    });

    if (!response.ok) {
      throw new Error(`Failed to list files: ${response.error}`);
    }

    return opts.next({ response });
  },
});

export const getFileInfo = i.nodes.callable({
  category,
  description: 'Get information about a file.',

  inputs: {
    file: pins.file.fileId.with({
      description: 'Specify a file by providing its ID.',
    }),
  },

  outputs: {
    response: pins.file.fileInfoResponse.with({
      description: 'Information about the file.',
    }),
  },

  async run(opts) {
    const response = await opts.state.slack.files.info({
      file: opts.inputs.file,
    });

    if (!response.ok) {
      throw new Error(`Failed to get file info: ${response.error}`);
    }

    return opts.next({ response });
  },
});

export const uploadFile = i.nodes.callable({
  category,
  description: 'Upload a file to Slack using the modern upload API.',

  inputs: {
    // Required
    content: pins.file.content.with({
      description: 'File content as string or buffer.',
    }),
    filename: pins.file.filename.with({
      description: 'Filename for the upload.',
    }),

    // Optional
    channels: pins.file.channels.with({
      description: 'Comma-separated list of channel IDs to upload to.',
      optional: true,
    }),
    filetype: pins.file.filetype.with({
      description: 'Type of file being uploaded.',
      optional: true,
    }),
    initialComment: pins.file.initialComment.with({
      description: 'Initial comment to add about the file.',
      optional: true,
    }),
    title: pins.file.title.with({
      description: 'Title for the file.',
      optional: true,
    }),
    threadTs: pins.chat.threadTs.with({
      description: 'Thread timestamp to upload file to.',
      optional: true,
    }),
  },

  outputs: {
    response: pins.file.fileUploadResponse.with({
      description: 'Response from uploading the file.',
    }),
  },

  async run(opts) {
    const response = await opts.state.slack.files.uploadV2({
      content: opts.inputs.content,
      filename: opts.inputs.filename,
      filetype: opts.inputs.filetype,
      initial_comment: opts.inputs.initialComment,
      title: opts.inputs.title,
      ...(opts.inputs.channels && opts.inputs.threadTs
        ? {
            channel_id: opts.inputs.channels,
            thread_ts: opts.inputs.threadTs,
          }
        : {
            channel_id: opts.inputs.channels,
          }),
    });

    if (!response.ok) {
      throw new Error(`Failed to upload file: ${response.error}`);
    }

    return opts.next({ response });
  },
});

export const deleteFile = i.nodes.callable({
  category,
  description: 'Delete a file from Slack.',

  inputs: {
    file: pins.file.fileId.with({
      description: 'ID of the file to delete.',
    }),
  },

  outputs: {
    response: pins.common.slackResponse.with({
      description: 'Response from deleting the file.',
    }),
  },

  async run(opts) {
    const response = await opts.state.slack.files.delete({
      file: opts.inputs.file,
    });

    if (!response.ok) {
      throw new Error(`Failed to delete file: ${response.error}`);
    }

    return opts.next({ response });
  },
});

export const shareFile = i.nodes.callable({
  category,
  description: 'Share an existing file to channels.',

  inputs: {
    file: pins.file.fileId.with({
      description: 'File to share.',
    }),
    channel: pins.file.channelId.with({
      description: 'Channel ID to share the file to.',
      optional: true,
    }),
  },

  outputs: {
    response: pins.file.fileInfoResponse.with({
      description: 'Information about the shared file.',
    }),
  },

  async run(opts) {
    const response = await opts.state.slack.files.sharedPublicURL({
      file: opts.inputs.file,
    });

    if (!response.ok) {
      throw new Error(`Failed to share file: ${response.error}`);
    }

    return opts.next({ response });
  },
});

export const makeFilePublic = i.nodes.callable({
  category,
  description: 'Enable public sharing for a file.',

  inputs: {
    file: pins.file.fileId.with({
      description: 'File to make publicly shareable.',
    }),
  },

  outputs: {
    response: pins.file.fileInfoResponse.with({
      description: 'Updated file information with public URL.',
    }),
  },

  async run(opts) {
    const response = await opts.state.slack.files.sharedPublicURL({
      file: opts.inputs.file,
    });

    if (!response.ok) {
      throw new Error(`Failed to make file public: ${response.error}`);
    }

    return opts.next({ response });
  },
});

export const revokeFilePublicURL = i.nodes.callable({
  category,
  description: 'Disable public sharing for a file.',

  inputs: {
    file: pins.file.fileId.with({
      description: 'File to revoke public sharing for.',
    }),
  },

  outputs: {
    response: pins.file.fileInfoResponse.with({
      description: 'Updated file information after revoking public access.',
    }),
  },

  async run(opts) {
    const response = await opts.state.slack.files.revokePublicURL({
      file: opts.inputs.file,
    });

    if (!response.ok) {
      throw new Error(`Failed to revoke file public URL: ${response.error}`);
    }

    return opts.next({ response });
  },
});
