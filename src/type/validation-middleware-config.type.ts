import type { ClassTransformOptions } from 'class-transformer';
import type { ValidatorOptions } from 'class-validator';

export type ValidationMiddlewareConfig = {
  transformationConfig?: ClassTransformOptions;
  validationConfig?: ValidatorOptions;
};
