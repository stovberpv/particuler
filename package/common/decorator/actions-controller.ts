import { Service, type ServiceOptions } from 'typedi';

import { ACTIONS_CONTROLLER, CONTROLLER, INJECTABLE } from '../decorator.constants';
import { Injectable } from './injectable';

/**
 * TODO: docs
 *
 * @returns декоратор класса.
 */
export const ActionsController = (): ClassDecorator => {
  /**
   * TODO: docs
   */
  const globalUniqServiceConfig: ServiceOptions = {
    global: true,
    transient: false,
    multiple: false,
    eager: false,
  };

  const makeInjectable = Service(globalUniqServiceConfig);

  // eslint-disable-next-line @typescript-eslint/ban-types
  return <T extends Function> (target: T): T => {
    const isInjectable: unknown = Reflect.getMetadata(INJECTABLE, target);
    if (isInjectable) {
      throw new SyntaxError(
        `The ${ActionsController.name} and ${Injectable.name} decorators should not be used in the same class together`
      );
    }

    Reflect.defineMetadata(CONTROLLER, Boolean(true), target);
    Reflect.defineMetadata(ACTIONS_CONTROLLER, Boolean(true), target);

    return makeInjectable(target) as T;
  };
};
