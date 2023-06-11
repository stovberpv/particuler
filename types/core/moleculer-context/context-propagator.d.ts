import type { AbstractContext, AbstractFunction, Optional } from '../../type';
export declare class ContextPropagator {
    #private;
    constructor();
    static propagateImmediate: <Context extends AbstractContext>(fn: AbstractFunction, ctx: Context, ...args: unknown[]) => ReturnType<AbstractFunction>;
    static propagateCallback: <Context extends AbstractContext>(cb: AbstractFunction) => (ctx: Context, ...args: unknown[]) => ReturnType<AbstractFunction>;
    static claimPropagated: <Context extends AbstractContext>() => Optional<Context>;
}
