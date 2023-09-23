import type { ActionHandler, ActionSchema } from 'moleculer';

import { ContextPropagator } from '../../../core/moleculer-context';

/**
 * TODO: docs
 *
 * @param   handler
 * @param   action
 * @returns
 */
export const PropagateContextActionMiddleware = {
  localAction: (handler: ActionHandler, action: ActionSchema): ActionHandler =>
    Reflect.get(action, 'propagateContextStorage')
      ? ContextPropagator.propagateCallback(handler)
      : handler,
};
