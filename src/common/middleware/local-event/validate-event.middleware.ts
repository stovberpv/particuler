import { plainToInstance } from 'class-transformer';
import { validateSync, type ValidationError } from 'class-validator';
import {
  Errors,
  type Middleware,
  type ServiceEvent,
  type ServiceEventHandler,
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
export const ValidateEventMiddleware = (
  config: ValidationMiddlewareConfig = {
    transformationConfig,
    validationConfig,
  }
): Middleware => ({
  localEvent (next: ServiceEventHandler, event: ServiceEvent) {
    return function (ctx: AbstractContext): unknown {
      const Validator: unknown = Reflect.get(event, 'paramsValidator');
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
