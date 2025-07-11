import {
  type FilesInfoResponse,
  type FilesListResponse,
  type FilesUploadResponse,
} from '@slack/web-api';
import * as v from 'valibot';

import * as i from '@acme/integration-framework';

// File content as string or buffer
export const fileContent = i.pins.data({
  description: 'File content as a string.',
  control: i.controls.text({
    placeholder: 'File content...',
  }),
  schema: v.pipe(v.string(), v.trim(), v.minLength(1)),
});

// Alias for file content to match node usage
export const content = fileContent;

// File name
export const filename = i.pins.data({
  description: 'Name of the file.',
  control: i.controls.text({
    placeholder: 'document.txt',
  }),
  schema: v.pipe(v.string(), v.trim(), v.minLength(1)),
});

// File type/extension
export const filetype = i.pins.data({
  description: 'File type or extension.',
  control: i.controls.text({
    placeholder: 'txt',
  }),
  optional: true,
  schema: v.optional(v.pipe(v.string(), v.trim())),
});

// File title
export const title = i.pins.data({
  description: 'Title for the file.',
  control: i.controls.text({
    placeholder: 'My Document',
  }),
  optional: true,
  schema: v.optional(v.pipe(v.string(), v.trim())),
});

// Initial comment when sharing file
export const initialComment = i.pins.data({
  description: 'Initial comment when sharing the file.',
  control: i.controls.text({
    placeholder: 'Here is the file...',
  }),
  optional: true,
  schema: v.optional(v.pipe(v.string(), v.trim())),
});

// Channels to share file to (comma-separated)
export const channels = i.pins.data({
  description: 'Channels to share the file to (comma-separated).',
  control: i.controls.text({
    placeholder: 'C1234567890,C0987654321',
  }),
  optional: true,
  schema: v.optional(v.pipe(v.string(), v.trim())),
});

// File ID
export const fileId = i.pins.data({
  description: 'Slack file ID.',
  control: i.controls.text({
    placeholder: 'F1234567890',
  }),
  schema: v.pipe(v.string(), v.trim(), v.minLength(1)),
});

// User ID for filtering files by user
export const userId = i.pins.data({
  description: 'Filter files by user ID.',
  control: i.controls.text({
    placeholder: 'U1234567890',
  }),
  optional: true,
  schema: v.optional(v.pipe(v.string(), v.trim())),
});

// Channel ID for filtering files by channel
export const channelId = i.pins.data({
  description: 'Filter files by channel ID.',
  control: i.controls.text({
    placeholder: 'C1234567890',
  }),
  optional: true,
  schema: v.optional(v.pipe(v.string(), v.trim())),
});

// File types filter
export const types = i.pins.data({
  description: 'Filter by file types (comma-separated).',
  control: i.controls.text({
    placeholder: 'images,docs,spreadsheets',
  }),
  optional: true,
  schema: v.optional(v.pipe(v.string(), v.trim())),
});

// Timestamp range for file filtering
export const tsFrom = i.pins.data({
  description: 'Filter files from this timestamp.',
  control: i.controls.text({
    placeholder: '1234567890',
  }),
  optional: true,
  schema: v.optional(v.pipe(v.string(), v.trim())),
});

export const tsTo = i.pins.data({
  description: 'Filter files to this timestamp.',
  control: i.controls.text({
    placeholder: '1234567890',
  }),
  optional: true,
  schema: v.optional(v.pipe(v.string(), v.trim())),
});

// File upload response
export const fileUploadResponse = i.pins.data<FilesUploadResponse>({
  description: 'Response from uploading a file to Slack.',
});

// Files list response
export const filesListResponse = i.pins.data<FilesListResponse>({
  description: 'List of files from Slack.',
});

// File info response
export const fileInfoResponse = i.pins.data<FilesInfoResponse>({
  description: 'Detailed information about a file.',
});
