import type {
  AbstractContext,
  AbstractFunction,
  ContextStore,
  Optional,
} from '../../type';
import { ContextStorage } from './context-storage';

/**
 * Request-scoped MoleculerJS context propagator.
 *
 * __Static class__.
 */
export class ContextPropagator {
  static #storage = new ContextStorage();

  constructor () {
    throw new TypeError(
      "Can't create instance of a class: ContextStorage, No default constructor found"
    );
  }

  /**
   * TODO: docs
   *
   * @param   store
   * @param   fn
   * @param   args
   * @returns
   */
  static #propagate = (
    store: ContextStore<AbstractContext>,
    fn: AbstractFunction,
    ...args: unknown[]
  ): ReturnType<AbstractFunction> =>
    this.#storage.run<ReturnType<AbstractFunction>, unknown[]>(store, fn, ...args);

  /**
   * TODO: docs
   *
   * @param   fn
   * @param   ctx
   * @param   args
   * @returns
   */
  static propagateImmediate = <Context extends AbstractContext> (
    fn: AbstractFunction,
    ctx: Context,
    ...args: unknown[]
  ): ReturnType<AbstractFunction> =>
    this.#propagate(this.#storage.createStore(ctx), fn, ...[ctx, ...args]);

  /**
   * TODO: docs
   *
   * @param   cb
   * @returns
   */
  static propagateCallback = <Context extends AbstractContext> (cb: AbstractFunction) =>
    (ctx: Context, ...args: unknown[]): ReturnType<AbstractFunction> =>
      this.#propagate(this.#storage.createStore(ctx), cb, ...[ctx, ...args]);

  /**
   * TODO: docs
   *
   * @returns
   */
  static claimPropagated = <Context extends AbstractContext> (): Optional<Context> =>
    this.#storage.getContext();
}
