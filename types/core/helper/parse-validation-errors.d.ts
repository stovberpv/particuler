import type { ValidationError as ClassValidatorErrors } from 'class-validator';
import type { ValidationError } from '../../type';
export declare function parseValidationErrors(errors: ClassValidatorErrors[]): ValidationError[];
