import { isAsyncFunction } from 'util/types';

import type {
  AbstractConstructor,
  AbstractFunction,
  HooksSchemaDiscovered,
} from '../../type';
import { isHooksControllerMetadata, isHooksMetadata } from '../guard';
import {
  HOOKS,
  HOOKS_CONTROLLER,
} from '../../common/decorator.constants';
import {
  bindingHandlerContextAsyncProxy,
  bindingHandlerContextSyncProxy,
} from '../proxy-handler';
import { Container } from '../../common/container';

/**
 * TODO: docs
 *
 * NOTE: валидация не реализована
 *
 * @param   Controller
 * @returns
 * @throws  Error
 */
export function * HooksSchemaDiscovery (
  Controller: AbstractConstructor
): Generator<HooksSchemaDiscovered> {
  if (!isHooksControllerMetadata(Reflect.getMetadata(HOOKS_CONTROLLER, Controller))) {
    return;
  }


  const proto = Controller.prototype as AbstractConstructor;


  const hooksMetadata: unknown = Reflect.getMetadata(HOOKS, proto);
  if (!isHooksMetadata(hooksMetadata)) {
    return;
  }

  for (const [hookType, hooks] of hooksMetadata) {
    for (const actionName in hooks) {
      if (!Object.prototype.hasOwnProperty.call(hooks, actionName)) {
        continue;
      }


      const methodOriginName = Reflect.get(hooks, actionName);
      if (!methodOriginName) {
        continue;
      }


      const hooksSchema: { handler?: AbstractFunction; } = {};


      Reflect.set(hooksSchema, 'handler', Reflect.get(proto, methodOriginName));


      // TODO: validation


      /**
       * Сохранение контекста выполнения метода необходимо для возможности
       * использования DI, производимого через конструктор класса.
       *
       * NOTE: Для сохранения сигнаруты функции, вне зависимости от функционала декораторов,
       *       привязка контекста должна происходить в самом конце.
       *
       * NOTE: Для привязки контекста используется один и тот же инстанс.
       *
       * Здесь мы при каждой итерации получаем контроллер из контейнера.
       * Это сделано для того, что избежать создания lexical scope для каждой функции.
       * Иначе это негативно отразится на потребляемой памяти.
       */
      const handler = Reflect.get(hooksSchema, 'handler');
      if (handler) {
        const proxy = isAsyncFunction(handler)
          ? bindingHandlerContextAsyncProxy(handler, Container.get(Controller))
          : bindingHandlerContextSyncProxy(handler, Container.get(Controller));

        Reflect.set(hooksSchema, 'handler', proxy);
      }


      yield [hookType, actionName, Reflect.get(hooksSchema, 'handler')];
    }
  }
}
