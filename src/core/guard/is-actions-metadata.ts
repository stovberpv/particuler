import type { ActionsMetadata } from '../../type';

/**
 * TODO: docs
 *
 * @param   target
 * @returns
 */
export function isActionsMetadata (target: unknown): target is ActionsMetadata {
  return target instanceof Map;
}
