import type { AbstractConstructor } from '../../type';

/**
 * TODO: docs
 * FIX: type checking
 *
 * @param   target
 * @returns
 */
export function isClass (target: unknown): target is AbstractConstructor {
  return typeof target === 'function' && target.prototype !== undefined && target.name !== 'Function';
}
