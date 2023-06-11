import { Service, type ServiceOptions } from 'typedi';

import { CONTROLLER, INJECTABLE, MODULE } from '../decorator.constants';
import { Module } from './module';

/**
 * TODO: docs
 *
 * @returns декоратор класса.
 */
export const Injectable = (options?: ServiceOptions): ClassDecorator => {
  const makeInjectable = Service(options);

  // eslint-disable-next-line @typescript-eslint/ban-types
  return <T extends Function> (target: T): T => {
    const isController: unknown = Reflect.getMetadata(CONTROLLER, target);
    if (isController !== undefined) {
      throw new SyntaxError(
        `The ${Injectable.name} and any Controller decorators should not be used in the same class together`
      );
    }

    const isModule: unknown = Reflect.getMetadata(MODULE, target);
    if (isModule !== undefined) {
      throw new SyntaxError(
        `The ${Injectable.name} and ${Module.name} decorators should not be used in the same class together`
      );
    }

    Reflect.defineMetadata(INJECTABLE, Boolean(true), target);

    return makeInjectable(target) as T;
  };
};
