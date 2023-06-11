import type { ServiceHooks, ServiceSchema } from 'moleculer';
type Actions = Required<Pick<ServiceSchema, 'actions'>>;
type Events = Required<Pick<ServiceSchema, 'events'>>;
type Hooks = {
    hooks: Required<ServiceHooks>;
};
export type ModuleSchemaDiscovered = Actions & Events & Hooks;
export {};
