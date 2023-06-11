import { plainToInstance } from 'class-transformer';
import { validateSync, ValidationError } from 'class-validator';
import {
  Errors,
  type ActionHandler,
  type ActionSchema,
  type Middleware,
} from 'moleculer';

import { isClass, parseValidationErrors } from '../../../core/helper';
import { transformationConfig, validationConfig } from '../../../config';
import type { AbstractContext, ValidationMiddlewareConfig } from '../../../type';

/**
 * TODO: docs
 *
 * @param   config
 * @returns
 */
export const ValidateActionMiddleware = (
  config: ValidationMiddlewareConfig = {
    transformationConfig,
    validationConfig,
  }
): Middleware => ({
  localAction (next: ActionHandler, action: ActionSchema) {
    return function (ctx: AbstractContext): unknown {
      const Validator = action.paramsValidator;
      if (!isClass(Validator)) {
        return next(ctx);
      }


      let errors: ValidationError[];
      let validator: object;

      try {
        validator = plainToInstance(Validator, ctx.params, config.transformationConfig);
        errors = validateSync(validator, config.validationConfig);
      } catch (error) {
        throw new Errors.ValidationError('Unable to validate params');
      }

      if (errors.length) {
        throw new Errors.ValidationError('Invalid params', '', parseValidationErrors(errors));
      }


      if (!Reflect.get(ctx, 'locals')) {
        Reflect.set(ctx, 'locals', Object.create(Object.prototype));
      }

      const locals = Reflect.get(ctx, 'locals');
      if (locals) {
        Reflect.set(locals, 'validatedParams', validator);
      }


      return next(ctx);
    };
  },
});
