import { isAsyncFunction } from 'util/types';

import type { ServiceEvent } from 'moleculer';

import type {
  AbstractConstructor,
  EventsSchemaDiscovered,
  Optional,
  PropertiesMetadata,
  ValidationMetadata,
} from '../../type';
import { isEventsControllerMetadata, isEventsMetadata } from '../guard';
import {
  EVENTS,
  EVENTS_CONTROLLER,
  PROPERTIES,
  VALIDATION,
} from '../../common/decorator.constants';
import {
  bindingHandlerContextAsyncProxy,
  bindingHandlerContextSyncProxy,
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
export function * EventsSchemaDiscovery (
  Controller: AbstractConstructor
): Generator<EventsSchemaDiscovered> {
  if (!isEventsControllerMetadata(Reflect.getMetadata(EVENTS_CONTROLLER, Controller))) {
    return;
  }


  const proto = Controller.prototype as AbstractConstructor;


  const eventsMetadata: unknown = Reflect.getMetadata(EVENTS, proto);
  if (!isEventsMetadata(eventsMetadata)) {
    return;
  }


  const propertiesMetadata =
    Reflect.getMetadata(PROPERTIES, proto) as Optional<PropertiesMetadata>;

  const validationMetadata =
    Reflect.getMetadata(VALIDATION, proto) as Optional<ValidationMetadata>;


  for (const [methodOriginName, moleculerEventName] of eventsMetadata) {
    const eventSchema: ServiceEvent = {};


    Reflect.set(eventSchema, 'handler', Reflect.get(proto, methodOriginName));


    const values = propertiesMetadata?.get(methodOriginName);
    if (values !== undefined) {
      for (const key in values) {
        if (Object.prototype.hasOwnProperty.call(values, key)) {
          Reflect.set(eventSchema, key, Reflect.get(values, key));
        }
      }
    }


    const validation = validationMetadata?.get(methodOriginName);
    if (validation !== undefined) {
      const [validationResultInjectIndex, Validator] = validation;

      Reflect.set(eventSchema, 'paramsValidator', Validator);

      const handler = Reflect.get(eventSchema, 'handler');
      if (handler) {
        const proxy = isAsyncFunction(handler)
          ? injectValidatedParamsAsyncProxy(handler, validationResultInjectIndex)
          : injectValidatedParamsSyncProxy(handler, validationResultInjectIndex);

        Reflect.set(eventSchema, 'handler', proxy);
      }
    }


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
    const handler = Reflect.get(eventSchema, 'handler');
    if (handler) {
      /**
       * Такой способ передачи контекста, вместо привязки через `handler.bind(this)`
       * нужен из-за логики работы самого молекулера.
       * Хендлеры евентов могут работать в двух режимах
       *
       *  - legacy - `(ctx.params, ctx.nodeID, ctx.eventName, ctx) => {}`
       *  - new    - `(ctx) => {}`
       *
       * Для определения режима работы вызываемый хендлер парсится через метод `toString()`
       * с последующим анализом его сигнатуры.
       *
       * - [service.js#L469](https://github.com/moleculerjs/moleculer/blob/master/src/service.js#L469)
       * - [service.js#L490](https://github.com/moleculerjs/moleculer/blob/master/src/service.js#L490)
       *
       * В случае привязки контекста к методу через `bind()` его сигнатура выглядит как
       * `function foo() { [native code] }`.
       * Из-за этого молекулер не может определить кол-во аргументов и переключается в режим
       * работы - legacy.
       */
      const proxy = isAsyncFunction(handler)
        ? bindingHandlerContextAsyncProxy(handler, Container.get(Controller))
        : bindingHandlerContextSyncProxy(handler, Container.get(Controller));

      Reflect.set(eventSchema, 'handler', proxy);
    }


    yield [moleculerEventName, eventSchema];
  }
}
