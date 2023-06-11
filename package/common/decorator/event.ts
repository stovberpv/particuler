import { isEventsMetadata } from '../../core/guard';
import { EVENTS } from '../decorator.constants';

/**
 * Регистрирует метод в качестве обработчика евента.
 *
 * @param   [actionName] имя евента под которым он будет зарегистрирован.
 *                       если имя не указано то обработчик будет зарегистрирован под именем метода.
 * @returns              декоратор метода.
 */
export function Event (eventName?: string): MethodDecorator {
  return (target: object, propertyKey: string | symbol): void => {
    const alias = eventName ?? String(propertyKey);

    const metadata: unknown = Reflect.getMetadata(EVENTS, target);
    if (isEventsMetadata(metadata)) {
      metadata.set(String(propertyKey), alias);
    } else {
      Reflect.defineMetadata(EVENTS, new Map([[propertyKey, alias]]), target);
    }
  };
}
