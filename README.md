# firebase-helper.ts

A collection of utility Cloud Functions hosted on Google Firebase.

[![License](https://img.shields.io/github/license/conao3/firebase-helper.ts.svg?style=flat-square)](https://github.com/conao3/firebase-helper.ts/blob/master/LICENSE)
[![Release](https://img.shields.io/github/tag/conao3/firebase-helper.ts.svg?style=flat-square)](https://github.com/conao3/firebase-helper.ts/releases)
[![Build Status](https://img.shields.io/travis/conao3/firebase-helper.ts/master.svg?style=flat-square)](https://travis-ci.org/conao3/firebase-helper.ts)

## Overview

firebase-helper.ts provides serverless API endpoints for common utility functions, including date formatting, GitHub header image generation, and Docker badge creation. All functions are deployed on Google Firebase Cloud Functions and can be accessed via HTTP requests.

## Usage

No installation required. The endpoints are publicly available and can be accessed directly via your browser or `curl`.

### hello

A simple endpoint to verify the service is running.

```bash
curl https://us-central1-conao3-helper.cloudfunctions.net/hello
# Output: Hello from Firebase!
```

### hello_args

Returns a greeting with a custom name parameter.

**Endpoint:** `https://us-central1-conao3-helper.cloudfunctions.net/hello_args/:name`

| Parameter | Type   | Description        |
|-----------|--------|--------------------|
| `:name`   | string | Name to greet      |

```bash
curl https://us-central1-conao3-helper.cloudfunctions.net/hello_args/conao3
# Output: Hello from Firebase!conao3
```

### date

Returns the current date and time. Supports custom formatting via the `format` query parameter.

```bash
curl https://us-central1-conao3-helper.cloudfunctions.net/date
# Output: 2019-02-03T03:15:11+00:00
```

### github_header

Generates an SVG header image suitable for GitHub repositories.

**Endpoint:** `https://us-central1-conao3-helper.cloudfunctions.net/github_header/:header.svg`

| Parameter     | Type   | Description                              |
|---------------|--------|------------------------------------------|
| `:header`     | string | Text to display (URL-encoded if needed)  |
| `?foreground` | string | Foreground color without `#` (optional)  |
| `?background` | string | Background color without `#` (optional)  |

**Example:**

```
https://us-central1-conao3-helper.cloudfunctions.net/github_header/conao3%2Ffirebase-helper.svg?foreground=000&background=abc
```

**Note:** Special characters (`;/?:@&=+$-_!~*.,()#'`) must be URL-encoded. Invalid input returns a default "github-header" SVG.

### shield_docker

> **Note:** This endpoint is currently unavailable on the free Firebase tier. External API access is restricted on free accounts, so this function only works in local development.

Generates Docker badge SVGs using MicroBadger data.

**Endpoint:** `https://us-central1-conao3-helper.cloudfunctions.net/shield_docker/:username/:imagename/:badgetype`

| Parameter     | Type   | Description                          |
|---------------|--------|--------------------------------------|
| `:username`   | string | Docker Hub username                  |
| `:imagename`  | string | Docker image name                    |
| `:badgetype`  | string | Badge type (see options below)       |

**Badge types:** `name`, `layers`, `size`, `version`, `pulls`, `stars`

## Development

### Prerequisites

```bash
npm install -g firebase-tools
firebase login
```

### Setup

```bash
git clone https://github.com/conao3/firebase-helper.ts
cd firebase-helper.ts/functions
npm install
```

### Local Testing

Start the TypeScript compiler in watch mode:

```bash
cd firebase-helper.ts/functions
./node_modules/.bin/tsc --watch
```

In a separate terminal, start the local emulator:

```bash
firebase serve --only functions --port=9000
```

Test the endpoints locally:

```bash
curl http://localhost:9000/conao3-helper/us-central1/hello
```

**Important:** Local testing still connects to production databases. Exercise caution when testing database operations.

### Deployment

To deploy to your own Firebase project:

1. Clone the repository
2. Update `.firebaserc` with your project ID:

```json
{
  "projects": {
    "default": "YOUR-FIREBASE-PROJECT"
  }
}
```

3. Deploy:

```bash
firebase deploy
```

## Resources

- [Firebase Console](https://console.firebase.google.com/)
- [Firebase Cloud Functions Documentation](https://firebase.google.com/docs/functions/)
- [Express.js API Reference](https://expressjs.com/en/4x/api.html)
- [Google Cloud Functions Documentation](https://cloud.google.com/functions/docs/)

## License

This project is licensed under the [GNU Affero General Public License v3.0](https://github.com/conao3/firebase-helper.ts/blob/master/LICENSE).

If you use this project's API or code in your own work, please display the license information appropriately.

## Author

Naoya Yamashita ([@conao3](https://github.com/conao3))

## Contributing

Contributions are welcome. Feel free to open issues or submit pull requests.
