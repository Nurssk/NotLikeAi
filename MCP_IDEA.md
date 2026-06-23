# MCP Idea: Extension Auth Code Manager

## Goal

Create an MCP server that helps the Chrome extension creator/debugger work with the extension login flow without touching Firebase manually.

The MCP should expose safe tools for checking, generating, deleting, and exchanging extension authorization codes stored in Firestore.

## Current Login Flow

1. User opens `https://www.beuniq.design/extension/authorize`.
2. User signs in with Google or email/password.
3. Website redirects to `/extension/code`.
4. Website creates a 6-character random code using uppercase letters and numbers.
5. Website stores one Firestore document in `extensionAuthCodes` with only:

```json
{
  "email": "user@example.com",
  "code": "A7K9Q2"
}
```

6. Before writing a new code, old documents for the same email are deleted.
7. User enters the same email and code in the Chrome extension.
8. Backend/extension exchange logic validates the email and code.

## MCP Server Responsibilities

The MCP server should provide tools that make this flow easy to inspect and debug.

### Tool: `generate_extension_code`

Input:

```json
{
  "email": "user@example.com"
}
```

Behavior:

- Normalize email to lowercase.
- Delete all existing `extensionAuthCodes` documents where `email` equals the normalized email.
- Generate a random 6-character code from `A-Z` and `0-9`.
- Store a new Firestore document with exactly:

```json
{
  "email": "user@example.com",
  "code": "A7K9Q2"
}
```

- Return the email and code.

Important: do not hash the code.

### Tool: `get_extension_code`

Input:

```json
{
  "email": "user@example.com"
}
```

Behavior:

- Normalize email to lowercase.
- Query `extensionAuthCodes` by email.
- Return matching documents with document IDs, email, and code.
- Do not return unrelated user data.

### Tool: `delete_extension_codes`

Input:

```json
{
  "email": "user@example.com"
}
```

Behavior:

- Normalize email to lowercase.
- Delete all `extensionAuthCodes` documents for that email.
- Return the number of deleted records.

### Tool: `exchange_extension_code`

Input:

```json
{
  "email": "user@example.com",
  "code": "A7K9Q2"
}
```

Behavior:

- Normalize email to lowercase.
- Normalize code to uppercase.
- Query Firestore where `email` and `code` match.
- If no match exists, return an error.
- If a match exists, delete the matching code document.
- Return success with the email.

## Firestore Collection

Collection:

```text
extensionAuthCodes
```

Document shape:

```ts
type ExtensionAuthCode = {
  email: string;
  code: string;
};
```

No extra fields should be written by the MCP unless the app flow changes.

## Security Notes

- MCP should run server-side only.
- It should use Firebase Admin SDK credentials, not browser Firebase credentials.
- Never expose Firebase service account keys to the Chrome extension.
- Never write hashed code for this current implementation.
- Keep one active code per email by deleting old records before creating a new one.
- Treat the code as temporary and one-time use.

## Implementation Prompt

Build a TypeScript MCP server for the BeUniq Design Chrome extension auth flow.

Use Firebase Admin SDK to connect to Firestore. Create MCP tools named:

- `generate_extension_code`
- `get_extension_code`
- `delete_extension_codes`
- `exchange_extension_code`

The Firestore collection is `extensionAuthCodes`. Each document must contain only `email` and `code`.

For `generate_extension_code`, delete all old records for the normalized email first, then create one new record with a random 6-character uppercase alphanumeric code.

For `exchange_extension_code`, validate by exact normalized email and uppercase code, delete the matched document after success, and return success. Do not hash codes.

Add input validation with Zod. Keep responses small and explicit. Include setup instructions for Firebase Admin credentials through environment variables.
