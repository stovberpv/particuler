import type { ActionHooks } from 'moleculer';
type HookType = 'before' | 'after' | 'error';
type ActionName = string;
type Handler = ActionHooks['before'] | ActionHooks['after'] | ActionHooks['error'];
export type HooksSchemaDiscovered = [HookType, ActionName, Handler];
export {};
