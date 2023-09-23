import type { AbstractContext, AbstractFunction } from '../../type';

type SyncProxy = (ctx: AbstractContext, ...args: unknown[]) => unknown;

/**
 * TODO: docs
 *
 * NOTE: позволяет работать с LegacyHandler
 *
 * @param   handler
 * @param   target
 * @returns
 */
export const bindingHandlerContextSyncProxy = (
  handler: AbstractFunction,
  target: object
): SyncProxy =>
  (ctx: AbstractContext, ...args: unknown[]): unknown =>
    handler.apply(target, [ctx, ...args]);

type AsyncProxy = (ctx: AbstractContext, ...args: unknown[]) => Promise<unknown>;

/**
 * TODO: docs
 *
 * NOTE: позволяет работать с LegacyHandler
 *
 * @param   handler
 * @param   target
 * @returns
 */
export const bindingHandlerContextAsyncProxy = (
  handler: AbstractFunction,
  target: object
): AsyncProxy =>
  // eslint-disable-next-line @typescript-eslint/require-await
  async (ctx: AbstractContext, ...args: unknown[]): Promise<unknown> =>
    handler.apply(target, [ctx, ...args]);
