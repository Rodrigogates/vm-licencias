# vm-licencias

An OS-style system for provisioning and activating virtual machines through a licensing scheme, built for controlled resale to university students: each virtual machine only unlocks and becomes usable once the student has a valid license, similar to how an operating system activation works.

## Current status

Working front-end built with Next.js and TypeScript. The persistence/backend layer is under review — there is currently no database connected, so the focus is on the interface logic and the provisioning/activation flow.

## Features

- Provisioning of new per-student virtual machine licenses.
- License-based activation flow, aimed at controlling which machines are enabled for use.
- Admin dashboard to view and manage issued licenses.

## Next steps

- Reconnect a persistence layer (database) so issuing and looking up licenses works end to end.
- Show a visible error state in the UI when a request fails, instead of an indefinite loading state.

## Tech stack

Next.js · TypeScript · Tailwind CSS · ESLint

## Demo

[vm-licencias.vercel.app](https://vm-licencias.vercel.app)
