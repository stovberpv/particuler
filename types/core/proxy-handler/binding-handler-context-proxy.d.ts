import type { AbstractContext, AbstractFunction } from '../../type';
type SyncProxy = (ctx: AbstractContext, ...args: unknown[]) => unknown;
export declare const bindingHandlerContextSyncProxy: (handler: AbstractFunction, target: object) => SyncProxy;
type AsyncProxy = (ctx: AbstractContext, ...args: unknown[]) => Promise<unknown>;
export declare const bindingHandlerContextAsyncProxy: (handler: AbstractFunction, target: object) => AsyncProxy;
export {};
