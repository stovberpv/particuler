import type { HooksControllerMetadata } from '../../type';

/**
 * TODO: docs
 *
 * @param   target
 * @returns
 */
export function isHooksControllerMetadata (target: unknown): target is HooksControllerMetadata {
  return typeof target === 'boolean';
}
