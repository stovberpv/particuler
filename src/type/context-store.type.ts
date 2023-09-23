import type { AbstractContext } from './abstract-context.type.js';

/**
 * TODO: docs
 */
export type ContextStore<Context extends AbstractContext> = Map<symbol, Context>;
