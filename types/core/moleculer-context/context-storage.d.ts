/// <reference types="node" />
import { AsyncLocalStorage } from 'node:async_hooks';
import type { AbstractContext, ContextStore, Optional } from '../../type';
export declare class ContextStorage extends AsyncLocalStorage<ContextStore<AbstractContext>> {
    createStore: (ctx: AbstractContext) => ContextStore<AbstractContext>;
    getStore: () => Optional<ContextStore<AbstractContext>>;
    getContext: <Context extends AbstractContext>() => Optional<Context>;
}
