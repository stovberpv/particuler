import type { ValidationMetadata } from '../../type';

/**
 * TODO: docs
 *
 * @param   target
 * @returns
 */
export function isValidationMetadata (
  target: unknown
): target is ValidationMetadata {
  return target instanceof Map;
}
