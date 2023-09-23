import type { ActionHooks } from 'moleculer';

type HookType = 'before' | 'after' | 'error';

type ActionName = string;

type Handler = ActionHooks['before'] | ActionHooks['after'] | ActionHooks['error'];

/**
 * TODO: docs
 */
export type HooksSchemaDiscovered = [HookType, ActionName, Handler];
