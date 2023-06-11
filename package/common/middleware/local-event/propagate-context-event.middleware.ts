import type { ServiceEvent, ServiceEventHandler } from 'moleculer';

import { ContextPropagator } from '../../../core/moleculer-context';

/**
 * TODO: docs
 *
 * @param   handler
 * @param   event
 * @returns
 */
export const PropagateContextEventMiddleware = {
  localEvent: (handler: ServiceEventHandler, event: ServiceEvent): ServiceEventHandler =>
    Reflect.get(event, 'propagateContextStorage')
      ? ContextPropagator.propagateCallback(handler) as ServiceEventHandler
      : handler,
};
