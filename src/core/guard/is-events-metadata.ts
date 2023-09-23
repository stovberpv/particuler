import type { EventsMetadata } from '../../type';

/**
 * TODO: docs
 *
 * @param   target
 * @returns
 */
export function isEventsMetadata (target: unknown): target is EventsMetadata {
  return target instanceof Map;
}
