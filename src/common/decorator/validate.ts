import { VALIDATION } from '../decorator.constants';
import { isClass } from '../../core/helper';
import { isValidationMetadata } from '../../core/guard';

/**
 * Извлекает `params` из `ctx` и передает в качестве аргумента функции.
 *
 * @returns декоратор параметра.
 */
export function Validate (): ParameterDecorator {
  return (
    target: object,
    propertyKey: string | symbol | undefined,
    parameterIndex: number
  ): void => {
    if (!propertyKey) {
      return;
    }

    const metadata: unknown = Reflect.getMetadata(VALIDATION, target);

    const paramTypes: unknown = Reflect.getMetadata('design:paramtypes', target, propertyKey);
    if (!Array.isArray(paramTypes)) {
      return;
    }

    const Validator: unknown = paramTypes.at(parameterIndex);
    if (!isClass(Validator)) {
      throw new TypeError(
        `Property ${parameterIndex} at the "${target.constructor.name}.${String(propertyKey)
        }" is not a class`
      );
    }

    if (isValidationMetadata(metadata)) {
      metadata.set(String(propertyKey), [parameterIndex, Validator]);
    } else {
      const metadata = new Map([[propertyKey, [parameterIndex, Validator]]]);

      Reflect.defineMetadata(VALIDATION, metadata, target);
    }
  };
}
