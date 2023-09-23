import { ContextPropagator } from '../core/moleculer-context';
import type { AbstractContext } from '../type';

/**
 * TODO: docs
 *
 * @returns
 * @throws  `ReferenceError` Context is not initialized or already cleaned up
 */
const InjectContext = <Context extends AbstractContext>(): Context => {
  const ctx = ContextPropagator.claimPropagated<Context>();
  if (!ctx) {
    throw new ReferenceError('Context is not initialized or already cleaned up');
  }

  return ctx;
};

export { InjectContext };
