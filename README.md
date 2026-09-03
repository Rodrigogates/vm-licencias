# vm-licencias

An OS-style system for provisioning and activating virtual machines through a licensing scheme, built to support controlled resale: each virtual machine only unlocks and becomes usable once it has a valid license, similar to how an operating system activation works.

## Current status

Working front-end built with Next.js and TypeScript. The persistence/backend layer is under review — there is currently no database connected, so the focus is on the interface logic and the provisioning/activation flow.

## Features

- Provisioning of new virtual machines.
- License-based activation flow, aimed at controlling which machines are enabled for use.
- Dashboard to view and manage provisioned machines.

## Tech stack

Next.js · TypeScript · Tailwind CSS · ESLint

## Demo

[vm-licencias.vercel.app](https://vm-licencias.vercel.app)
