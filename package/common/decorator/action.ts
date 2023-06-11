import { isActionsMetadata } from '../../core/guard';
import { ACTIONS } from '../decorator.constants';

/**
 * Регистрирует метод в качестве обработчика экшена.
 *
 * @param   [actionName] имя экшена под которым он будет зарегистрирован.
 *                       если имя не указано то обработчик будет зарегистрирован под именем метода.
 * @returns              декоратор метода.
 */
export function Action (actionName?: string): PropertyDecorator {
  return (target: object, propertyKey: string | symbol): void => {
    const alias = actionName ?? String(propertyKey);

    const metadata: unknown = Reflect.getMetadata(ACTIONS, target);
    if (isActionsMetadata(metadata)) {
      metadata.set(String(propertyKey), alias);
    } else {
      Reflect.defineMetadata(ACTIONS, new Map([[propertyKey, alias]]), target);
    }
  };
}
