import type { ActionsControllerMetadata } from '../../type';

/**
 * TODO: docs
 *
 * @param   target
 * @returns
 */
export function isActionsControllerMetadata (target: unknown): target is ActionsControllerMetadata {
  return typeof target === 'boolean';
}
