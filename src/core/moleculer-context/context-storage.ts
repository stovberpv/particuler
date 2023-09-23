import { AsyncLocalStorage } from 'node:async_hooks';

import type {
  AbstractContext,
  ContextStore,
  Optional,
} from '../../type';
import { CONTEXT_TOKEN } from './constants';

/**
 * TODO: docs
 *
 * @augments AsyncLocalStorage
 */
export class ContextStorage extends AsyncLocalStorage<ContextStore<AbstractContext>> {
  /**
   * TODO: docs
   *
   * @param   ctx
   * @returns
   */
  createStore = (ctx: AbstractContext): ContextStore<AbstractContext> =>
    new Map([[CONTEXT_TOKEN, ctx]]);

  /**
   * TODO: docs
   *
   * @returns
   */
  override getStore = (): Optional<ContextStore<AbstractContext>> =>
    super.getStore();

  /**
   * TODO: docs
   *
   * @returns
   */
  getContext = <Context extends AbstractContext> (): Optional<Context> =>
    this.getStore()?.get(CONTEXT_TOKEN) as Context;
}
