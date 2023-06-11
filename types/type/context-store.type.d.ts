import type { AbstractContext } from './abstract-context.type.js';
export type ContextStore<Context extends AbstractContext> = Map<symbol, Context>;
