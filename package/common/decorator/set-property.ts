import type { ValidationSchema as Schema } from 'fastest-validator';

import { PROPERTIES } from '../decorator.constants';

/**
 * Задает произвольный параметр `ActionSchema`.
 *
 * @param   key   имя параметра.
 * @param   value значение параметра.
 * @returns       декоратор метода.
 */
export const SetProperty = (key: string, value: unknown): MethodDecorator =>
  (target: object, propertyKey: string | symbol): void => {
    const properties: unknown = Reflect.getMetadata(PROPERTIES, target);
    if (properties instanceof Map) {
      const values = properties.get(propertyKey) as Record<string, unknown>;

      if (values) {
        values[key] = value;
      } else {
        properties.set(propertyKey, { [key]: value });
      }
    } else {
      Reflect.defineMetadata(PROPERTIES, new Map([[propertyKey, { [key]: value }]]), target);
    }
  };

/**
 * Регистрирует обработчик в качестве метода, доступного для инъекции контекста.
 *
 * @param   [propagate] значение параметра.
 * @returns             декоратор метода.
 */
export const PropagateContextStorage = (propagate = true): MethodDecorator =>
  SetProperty('propagateContextStorage', propagate);

/**
 * Задает параметр `summary`.
 *
 * @param   summary значение параметра.
 * @returns         декоратор метода.
 */
export const Summary = (summary: string): MethodDecorator =>
  SetProperty('summary', summary);

/**
 * Задает параметр `description`.
 *
 * @param   description значение параметра.
 * @returns             декоратор метода.
 */
export const Description = (description: string): MethodDecorator =>
  SetProperty('description', description);

/**
 * Задает параметр `requiredPermission`.
 *
 * @param   permissions значение параметра.
 * @returns             декоратор метода.
 */
export const RequiredPermission = (permissions: string): MethodDecorator =>
  SetProperty('requiredPermission', permissions);

/**
 * Задает параметр `visibility`.
 *
 * @param   visibility значение параметра.
 * @returns            декоратор метода.
 */
export const Visibility = (
  visibility: 'published' | 'public' | 'protected' | 'private'
): MethodDecorator =>
  SetProperty('visibility', visibility);

/**
 * Задает параметр `name`.
 *
 * @param   name значение параметра.
 * @returns      декоратор метода.
 */
export const Name = (name: string): MethodDecorator =>
  SetProperty('name', name);

/**
 * Позволяет указать схему валидации параметров.
 *
 * Задает параметр `params`.
 *
 * @param   schema схема валидации параметров.
 * @returns        декоратор метода.
 */
export const Params = (schema: Schema): MethodDecorator =>
  SetProperty('params', schema);

/**
 * Задает параметр `rest`.
 *
 * @param   method метод запроса.
 * @param   path   адрес запроса.
 * @returns        декоратор метода.
 */
export const Rest = (
  method: 'GET' | 'POST' | 'DELETE' | 'PUT' | 'PATCH',
  path: string
): MethodDecorator =>
  SetProperty('rest', { method, path });

export const Get = (path: string): MethodDecorator => Rest('GET', path);
export const Post = (path: string): MethodDecorator => Rest('POST', path);
export const Delete = (path: string): MethodDecorator => Rest('DELETE', path);
export const Put = (path: string): MethodDecorator => Rest('PUT', path);
export const Patch = (path: string): MethodDecorator => Rest('PATCH', path);

/**
 * Позволяет переключить режим работы хендлера евентов из легаси режима на новый.
 *
 * Такое может понадобиться, если в кач-ве хенделра был передан метод класса с привязкой контекса `foo.bar.bind(foo)`.
 * В этом случае молекулер при парсинге метода через `bar.toString()` получит `function bar() { [native code] }`
 * ([toString](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function/toString)),
 * где будет отсутствовать сигнатура метода по которой происходит определение режима работы функции
 *
 * - [service.js#L469](https://github.com/moleculerjs/moleculer/blob/master/src/service.js#L469)
 * - [service.js#L490](https://github.com/moleculerjs/moleculer/blob/master/src/service.js#L490)
 *
 * **Данный декоратор добавляет параметр `context: true` в объект `ServiceEvent`,
 * тем самым принудительно переключая хендлер на новый режим работы**
 *
 * - [service.js#L471](https://github.com/moleculerjs/moleculer/blob/master/src/service.js#L471)
 *
 * @param type режим работы хендлера евентов
 *
 *              - `legacy` - сигнатура хендлера должна выглядеть следующим образом:\
 *                 `(ctx.params, ctx.nodeID, ctx.eventName, ctx) => {}`
 *              - `new` - сигнатура хендлера должна выглядеть следующим образом:\
 *                 `(ctx) => {}`
 */
export const HandlerType = (type: 'legacy' | 'new'): MethodDecorator =>
  SetProperty('context', type === 'new');
