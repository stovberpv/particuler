import type { AbstractContext, AbstractFunction } from '../../type';
type AsyncProxy = (this: object, ctx: AbstractContext) => Promise<unknown>;
export declare const injectValidatedParamsAsyncProxy: (handler: AbstractFunction, injectValidatedParamsIndex: number) => AsyncProxy;
type SyncProxy = (this: object, ctx: AbstractContext) => unknown;
export declare const injectValidatedParamsSyncProxy: (handler: AbstractFunction, injectValidatedParamsIndex: number) => SyncProxy;
export {};
