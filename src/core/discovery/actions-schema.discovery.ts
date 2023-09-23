import { isAsyncFunction } from 'util/types';

import type { ActionSchema } from 'moleculer';

import type {
  AbstractConstructor,
  ActionsSchemaDiscovered,
  Optional,
  PropertiesMetadata,
  ValidationMetadata,
} from '../../type';
import { isActionsControllerMetadata, isActionsMetadata } from '../guard';
import {
  ACTIONS,
  ACTIONS_CONTROLLER,
  PROPERTIES,
  VALIDATION,
} from '../../common/decorator.constants';
import {
  injectValidatedParamsAsyncProxy,
  injectValidatedParamsSyncProxy,
} from '../proxy-handler';
import { Container } from '../../common/container';

/**
 * TODO: docs
 *
 * @param   Controller
 * @returns
 * @throws  Error
 */
export function * ActionsSchemaDiscovery (
  Controller: AbstractConstructor
): Generator<ActionsSchemaDiscovered> {
  if (!isActionsControllerMetadata(Reflect.getMetadata(ACTIONS_CONTROLLER, Controller))) {
    return;
  }


  const proto = Controller.prototype as AbstractConstructor;


  const actionsMetadata: unknown = Reflect.getMetadata(ACTIONS, proto);
  if (!isActionsMetadata(actionsMetadata)) {
    return;
  }

  const propertiesMetadata =
    Reflect.getMetadata(PROPERTIES, proto) as Optional<PropertiesMetadata>;

  const validationMetadata =
    Reflect.getMetadata(VALIDATION, proto) as Optional<ValidationMetadata>;


  for (const [methodOriginName, actionName] of actionsMetadata) {
    const actionSchema: ActionSchema = {};


    Reflect.set(actionSchema, 'handler', Reflect.get(proto, methodOriginName));


    const values = propertiesMetadata?.get(methodOriginName);
    if (values !== undefined) {
      for (const key in values) {
        if (Object.prototype.hasOwnProperty.call(values, key)) {
          Reflect.set(actionSchema, key, Reflect.get(values, key));
        }
      }
    }


    const validation = validationMetadata?.get(methodOriginName);
    if (validation !== undefined) {
      const [validationResultInjectIndex, Validator] = validation;

      Reflect.set(actionSchema, 'paramsValidator', Validator);

      const handler = Reflect.get(actionSchema, 'handler');
      if (handler) {
        const proxy = isAsyncFunction(handler)
          ? injectValidatedParamsAsyncProxy(handler, validationResultInjectIndex)
          : injectValidatedParamsSyncProxy(handler, validationResultInjectIndex);

        Reflect.set(actionSchema, 'handler', proxy);
      }
    }


    /**
     * Сохранение контекста выполнения метода необходимо для возможности
     * использования DI, производимого через конструктор класса.
     *
     * NOTE: Для сохранения сигнатуры функции, вне зависимости от функционала декораторов,
     *       привязка контекста должна происходить в самом конце.
     *
     * NOTE: Для привязки контекста используется один и тот же инстанс.
     *
     * Здесь мы при каждой итерации получаем контроллер из контейнера.
     * Это сделано для того, что избежать создания lexical scope для каждой функции.
     * Иначе это негативно отразится на потребляемой памяти.
     */
    const handler = Reflect.get(actionSchema, 'handler');
    if (handler) {
      Reflect.set(actionSchema, 'handler', handler.bind(Container.get(Controller)));
    }


    yield [actionName, actionSchema];
  }
}
