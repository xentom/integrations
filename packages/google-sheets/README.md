# Google Sheets Integration

Interact with Google Sheets using the Xentom Integration Framework. This integration provides typed nodes to read, append, and clear values, and to create spreadsheets via the official Google Sheets API.

## Environment Setup

This integration authenticates with a Google Cloud Service Account. The following environment variables are required:

- `GOOGLE_SERVICE_ACCOUNT_EMAIL` – Service account client email
- `GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY` – Service account private key

### Create a Service Account and Key

1. In Google Cloud Console, create (or select) a project.
2. Enable the "Google Sheets API".
3. Create a Service Account (IAM & Admin → Service Accounts) with at least "Editor" on the target Sheets.
4. Create a JSON key for the Service Account and download it.
5. From the JSON, copy `client_email` and `private_key`.

### Configure Environment Variables

Add the values to your environment. If your env loader does not support multiline values, replace newlines in the private key with literal `\\n` and wrap in quotes. The integration automatically normalizes `\\n` back to real newlines.

```bash
GOOGLE_SERVICE_ACCOUNT_EMAIL=service-account@project.iam.gserviceaccount.com
GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\\nMIIEv...\\n-----END PRIVATE KEY-----\\n"
```

Notes:

- If your environment supports multiline values, you can paste the key as-is (including line breaks).
- Share any target spreadsheet with the service account email so it can read/write.
- Scope used: `https://www.googleapis.com/auth/spreadsheets`.

## Available Nodes (initial)

- Get Values: Read a range as a 2D array
- Append Values: Append rows/columns with RAW or USER_ENTERED
- Clear Values: Clear values in a range
- Create Spreadsheet: Create a spreadsheet and return `id` and `url`

## Troubleshooting

- 403/404 when accessing a sheet: Ensure the spreadsheet is shared with the service account email.
- Invalid private key: Verify quotes and `\\n` escaping, or use true multiline env values if supported.
