import { isHooksMetadata } from '../../core/guard';
import { HOOKS } from '../decorator.constants';

/**
 * Регистрирует метод в качестве хука.
 *
 * @param   type   тип хука.
 * @param   action имя экшена для которого будет зарегистрирован хук.
 * @returns            декоратор метода.
 */
export function Hook (type: 'before' | 'after' | 'error', action: string): MethodDecorator {
  return (target: object, propertyKey: string | symbol): void => {
    const metadata: unknown = Reflect.getMetadata(HOOKS, target);
    if (isHooksMetadata(metadata)) {
      const hooks = metadata.get(type);
      if (hooks) {
        Reflect.set(hooks, action, String(propertyKey));
      } else {
        metadata.set(type, { [action]: String(propertyKey) });
      }
    } else {
      Reflect.defineMetadata(HOOKS, new Map([[type, { [action]: String(propertyKey) }]]), target);
    }
  };
}
