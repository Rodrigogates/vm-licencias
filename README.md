vm-licencias

Sistema tipo SO para dar de alta y activar máquinas virtuales mediante un esquema de licencias, pensado para permitir su venta controlada: cada máquina virtual solo se desbloquea y puede usarse si cuenta con una licencia válida, de forma similar a como se activa un sistema operativo.

Estado actual

Interfaz funcional construida con Next.js y TypeScript. La capa de persistencia/backend está en revisión — por el momento no hay una base de datos conectada, así que el foco está en la lógica de la interfaz y el flujo de alta y activación.

Funcionalidades
Alta de nuevas máquinas virtuales.
Flujo de activación por licencia, orientado a controlar qué máquinas están habilitadas para su uso.
Panel para visualizar y administrar las máquinas dadas de alta.
Stack técnico

Next.js · TypeScript · Tailwind CSS · ESLint

Demo

vm-licencias.vercel.app
