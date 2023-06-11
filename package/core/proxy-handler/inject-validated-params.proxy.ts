import type { AbstractContext, AbstractFunction } from '../../type';

type AsyncProxy = (this: object, ctx: AbstractContext) => Promise<unknown>;

/**
 * TODO: docs
 * FIX: не работает с LegacyHandler
 *
 * @param   handler
 * @param   injectValidatedParamsIndex
 * @returns
 */
export const injectValidatedParamsAsyncProxy = (
  handler: AbstractFunction,
  injectValidatedParamsIndex: number
): AsyncProxy =>
  // eslint-disable-next-line @typescript-eslint/require-await
  async function (
    this: object,
    ctx: AbstractContext,
    ...args: unknown[]
  ): Promise<unknown> {
    const locals = Reflect.get(ctx, 'locals') ?? Object.create(Object.prototype) as object;

    const params: unknown[] = [ctx, ...args];

    const validatedParams: unknown = Reflect.get(locals, 'validatedParams');
    if (validatedParams) {
      params.splice(injectValidatedParamsIndex, 0, validatedParams);
    }

    return handler.apply(this, params);
  };


type SyncProxy = (this: object, ctx: AbstractContext) => unknown;

/**
 * TODO: docs
 * FIX: не работает с LegacyHandler
 *
 * @param   handler
 * @param   injectValidatedParamsIndex
 * @returns
 */
export const injectValidatedParamsSyncProxy = (
  handler: AbstractFunction,
  injectValidatedParamsIndex: number
): SyncProxy =>
  function (
    this: object,
    ctx: AbstractContext,
    ...args: unknown[]
  ): unknown {
    const locals = Reflect.get(ctx, 'locals') ?? Object.create(Object.prototype) as object;

    const params: unknown[] = [ctx, ...args];

    const validatedParams: unknown = Reflect.get(locals, 'validatedParams');
    if (validatedParams) {
      params.splice(injectValidatedParamsIndex, 0, validatedParams);
    }

    return handler.apply(this, params);
  };
