import type { ValidationError as ClassValidatorErrors } from 'class-validator';

import type { ValidationError } from '../../type';

/**
 * TODO: docs
 *
 * @param   errors
 * @returns
 */
export function parseValidationErrors (
  errors: ClassValidatorErrors[]
): ValidationError[] {
  const validation: ValidationError[] = [];

  function parse (error: ClassValidatorErrors, parent?: string): void {
    const { property } = error;

    const children = error.children;
    if (children) {
      children.forEach(childError => parse(childError, property));
    }

    const constraints = Object.values(error.constraints ?? {});
    if (constraints.length) {
      const key = parent ? `${parent}.${property}` : property;
      validation.push({ [key]: constraints });
    }
  }

  errors.forEach(error => parse(error));

  return validation;
}
