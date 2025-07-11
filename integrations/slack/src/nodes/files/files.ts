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
    }),
    channel: pins.file.channelId.with({
      description: 'Filter files appearing in this channel.',
    }),
    tsFrom: pins.file.tsFrom.with({
      description: 'Filter files created after this timestamp.',
    }),
    tsTo: pins.file.tsTo.with({
      description: 'Filter files created before this timestamp.',
    }),
    types: pins.file.types.with({
      description: 'Filter by file type.',
    }),
    limit: pins.common.limit.with({
      description: 'Number of items to return per page.',
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
    }),

    // Optional
    filetype: pins.file.filetype.with({
      description: 'Type of file being uploaded.',
    }),
    initialComment: pins.file.initialComment.with({
      description: 'Initial comment to add about the file.',
    }),
    title: pins.file.title.with({
      description: 'Title for the file.',
    }),
    threadTs: pins.chat.threadTs.with({
      description: 'Thread timestamp to upload file to.',
    }),
  },

  outputs: {
    response: pins.file.fileUploadResponse.with({
      description: 'Response from uploading the file.',
    }),
  },

  async run(opts) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const uploadParams: any = {
      content: opts.inputs.content,
      filename: opts.inputs.filename,
    };

    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    if (opts.inputs.channels) uploadParams.channels = opts.inputs.channels;
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    if (opts.inputs.filetype) uploadParams.filetype = opts.inputs.filetype;
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    if (opts.inputs.initialComment)
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      uploadParams.initial_comment = opts.inputs.initialComment;
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    if (opts.inputs.title) uploadParams.title = opts.inputs.title;
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    if (opts.inputs.threadTs) uploadParams.thread_ts = opts.inputs.threadTs;

    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
    const response = await opts.state.slack.files.uploadV2(uploadParams);

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
