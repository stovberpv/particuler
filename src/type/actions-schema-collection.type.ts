import type { ActionSchema } from 'moleculer';

type ActionName = string;

/**
 * TODO: docs
 */
export type ActionsSchemaCollection = { [key: ActionName]: ActionSchema; };
