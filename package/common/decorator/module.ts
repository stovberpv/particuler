/* eslint-disable @typescript-eslint/ban-types */
/* eslint-disable func-style */
/* eslint-disable @typescript-eslint/naming-convention */

import { Service, type ServiceOptions } from 'typedi';

import type { ModuleParams } from '../../type';
import { INJECTABLE, MODULE } from '../decorator.constants';
import { Injectable } from './injectable';

/**
 * TODO: docs
 *
 * @param   moduleParams
 * @returns декоратор класса.
 */
export const Module = (moduleParams: ModuleParams): ClassDecorator => {
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

  return <T extends Function> (target: T): T => {
    const isInjectable: unknown = Reflect.getMetadata(INJECTABLE, target);
    if (isInjectable) {
      throw new SyntaxError(
        `The ${Module.name} and ${Injectable.name} decorators should not be used in the same class together`
      );
    }

    Reflect.defineMetadata(MODULE, new Map([[target.name, moduleParams]]), target);

    return makeInjectable(target) as T;
  };
};
