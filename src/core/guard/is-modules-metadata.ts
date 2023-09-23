import type { ModulesMetadata } from '../../type';

/**
 * TODO: docs
 *
 * @param   target
 * @returns
 */
export function isModulesMetadata (target: unknown): target is ModulesMetadata {
  return target instanceof Map;
}
