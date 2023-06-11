import type { AbstractConstructor, ModuleSchemaDiscovered } from '../../type';
import { isModulesMetadata } from '../guard';
import { MODULE } from '../../common/decorator.constants';
import { ActionsSchemaDiscovery } from './actions-schema.discovery';
import { EventsSchemaDiscovery } from './events-schema.discovery';
import { HooksSchemaDiscovery } from './hooks-schema.discovery';
import { Container } from '../../common/container';

/**
 * TODO: docs
 *
 * @param   Module
 * @returns
 * @throws  Error
 */
export function * ModuleSchemaDiscovery (
  Module: AbstractConstructor
): Generator<ModuleSchemaDiscovered> {
  const metadata: unknown = Reflect.getMetadata(MODULE, Module);
  if (!isModulesMetadata(metadata)) {
    return;
  }


  /**
   * TODO: пока не понял нужен ли этот функционал
   */
  Container.get(Module);


  for (const [, moduleParams] of metadata) {
    const module: ModuleSchemaDiscovered = {
      actions: {},
      events: {},
      hooks: {
        before: {},
        after: {},
        error: {},
      },
    };


    for (const actionsController of moduleParams.actions ?? []) {
      const actionsSchemaDiscoverer = ActionsSchemaDiscovery(actionsController);
      for (const [actionName, actionSchema] of actionsSchemaDiscoverer) {
        Reflect.set(module.actions, actionName, actionSchema);
      }
    }


    for (const eventsControllers of moduleParams.events ?? []) {
      const eventsSchemaDiscoverer = EventsSchemaDiscovery(eventsControllers);
      for (const [eventName, eventSchema] of eventsSchemaDiscoverer) {
        Reflect.set(module.events, eventName, eventSchema);
      }
    }


    for (const hooksControllers of moduleParams.hooks ?? []) {
      const hooksSchemaDiscoverer = HooksSchemaDiscovery(hooksControllers);
      for (const [hookType, actionName, handler] of hooksSchemaDiscoverer) {
        Reflect.set(module.hooks[hookType], actionName, handler);
      }
    }


    yield module;
  }
}
