# Kodehole

Version your code from the terminal. Every push from the CLI creates a new snapshot inside a project workspace (Orbit), so earlier versions are always preserved and can be browsed in the browser.

<img width="1916" height="905" alt="image" src="https://github.com/user-attachments/assets/42b217f8-f9c4-4493-84b8-06e0255eb66f" />

## Features

- One-command push: run `kdh push <orbit-name>` and your code is saved as a new snapshot
- CLI-first workflow: push your project straight from the terminal
- Every push creates a new snapshot inside the same Orbit, and old snapshots are never overwritten
- File-tree interface to browse the files of any snapshot in the browser
- Google sign-in with Auth.js
- Snapshot files stored on Cloudflare R2

## Tech Stack

| Area | Tools |
|---|---|
| Framework | Next.js (frontend and API routes), React, TypeScript |
| UI | Tailwind CSS, shadcn/ui, React Arborist |
| Database | MongoDB (Mongoose) |
| CLI | Commander, Inquirer, Chalk |
| Auth | Auth.js (Google), JWT |
| Storage | Cloudflare R2 (S3-compatible API) |

## How It Works

1. Log in and create an Orbit (a project workspace).
2. Run the CLI inside your project folder: `kdh push <orbit-name>`.
3. The CLI zips your files and uploads them as a new snapshot.
4. Open the Orbit in the browser and explore any snapshot in the file tree.

## Getting Started

```
git clone https://github.com/randeep88/kodehole.git
cd kodehole
npm install
```

Create a `.env.local` file in the root:

```
NEXT_PUBLIC_BASE_URL=
MONGODB_URI=
AUTH_SECRET=
AUTH_GOOGLE_ID=
AUTH_GOOGLE_SECRET=
AUTH_GITHUB_ID=
AUTH_GITHUB_SECRET=
R2_ACCOUNT_ID=
R2_ACCESS_KEY_ID=
R2_SECRET_ACCESS_KEY=
R2_BUCKET_NAME=
R2_PUBLIC_URL=

```

Start the app:

```
npm run dev
```

Open http://localhost:3000

> Note: The hosted demo is currently offline because it depends on paid Cloudflare R2 storage. See the demo video above.

## Author

Randeep Singh: [GitHub](https://github.com/randeep88) | [LinkedIn](https://linkedin.com/in/randeep-singh88)
