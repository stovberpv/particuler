import { Service, type ServiceOptions } from 'typedi';

import { CONTROLLER, HOOKS_CONTROLLER, INJECTABLE } from '../decorator.constants';
import { Injectable } from './injectable';

/**
 * TODO: docs
 *
 * @returns декоратор класса.
 */
export const HooksController = (): ClassDecorator => {
  /**
   * TODO: docs
   */
  const globalServiceConfig: ServiceOptions = {
    global: true,
    transient: false,
    multiple: false,
    eager: false,
  };

  const makeInjectable = Service(globalServiceConfig);

  // eslint-disable-next-line @typescript-eslint/ban-types
  return <T extends Function> (target: T): T => {
    const isInjectable: unknown = Reflect.getMetadata(INJECTABLE, target);
    if (isInjectable) {
      throw new SyntaxError(
        `The ${HooksController.name} and ${Injectable.name} decorators should not be used in the same class together`
      );
    }

    Reflect.defineMetadata(CONTROLLER, Boolean(true), target);
    Reflect.defineMetadata(HOOKS_CONTROLLER, Boolean(true), target);

    return makeInjectable(target) as T;
  };
};
