import { EventEmitter } from 'node:events';

export const responses = new EventEmitter<Record<string, [Response]>>();

const mimeToExtension: Record<string, string> = {
  // Images
  'image/jpeg': '.jpg',
  'image/jpg': '.jpg',
  'image/png': '.png',
  'image/gif': '.gif',
  'image/webp': '.webp',
  'image/svg+xml': '.svg',
  'image/bmp': '.bmp',
  'image/tiff': '.tiff',
  'image/ico': '.ico',

  // Documents
  'application/pdf': '.pdf',
  'application/msword': '.doc',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document':
    '.docx',
  'application/vnd.ms-excel': '.xls',
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': '.xlsx',
  'application/vnd.ms-powerpoint': '.ppt',
  'application/vnd.openxmlformats-officedocument.presentationml.presentation':
    '.pptx',

  // Text
  'text/plain': '.txt',
  'text/html': '.html',
  'text/css': '.css',
  'text/javascript': '.js',
  'text/csv': '.csv',
  'application/json': '.json',
  'application/xml': '.xml',
  'text/xml': '.xml',

  // Audio
  'audio/mpeg': '.mp3',
  'audio/wav': '.wav',
  'audio/ogg': '.ogg',
  'audio/mp4': '.m4a',

  // Video
  'video/mp4': '.mp4',
  'video/mpeg': '.mpeg',
  'video/quicktime': '.mov',
  'video/x-msvideo': '.avi',
  'video/webm': '.webm',

  // Archives
  'application/zip': '.zip',
  'application/x-rar-compressed': '.rar',
  'application/x-tar': '.tar',
  'application/gzip': '.gz',

  // Other
  'application/octet-stream': '.bin',
};

export function getExtensionFromMimeType(mimeType: string): string {
  const cleanMimeType = mimeType.split(';')[0]?.trim().toLowerCase() || '';
  return mimeToExtension[cleanMimeType] || '.bin';
}

export async function parseRequestBody(
  request: Request,
  headers: Record<string, string>,
) {
  const contentType =
    headers['content-type']?.toLowerCase() || 'application/octet-stream';
  try {
    if (contentType.includes('application/json')) {
      return await request.json();
    }

    if (
      contentType.includes('application/x-www-form-urlencoded') ||
      contentType.includes('multipart/form-data')
    ) {
      return Object.fromEntries((await request.formData()).entries());
    }

    if (contentType.includes('text/')) {
      return await request.text();
    }

    // Fallback for binary data
    return new File(
      [await request.arrayBuffer()],
      generateUniqueFilename(headers, contentType),
      { type: contentType },
    );
  } catch (error) {
    throw new Error(
      `Failed to parse request body: ${
        error instanceof Error ? error.message : String(error)
      }`,
    );
  }
}

function generateUniqueFilename(
  headers: Record<string, string>,
  contentType: string,
): string {
  const filename = headers['x-filename'] || `${Bun.randomUUIDv7()}`;
  return `${filename}${getExtensionFromMimeType(contentType)}`;
}
