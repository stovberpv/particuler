import type { EventsControllerMetadata } from '../../type';

/**
 * TODO: docs
 *
 * @param   target
 * @returns
 */
export function isEventsControllerMetadata (target: unknown): target is EventsControllerMetadata {
  return typeof target === 'boolean';
}
