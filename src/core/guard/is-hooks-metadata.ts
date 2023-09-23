import type { HooksMetadata } from '../../type';

/**
 * TODO: docs
 *
 * @param   target
 * @returns
 */
export function isHooksMetadata (target: unknown): target is HooksMetadata {
  return target instanceof Map;
}
