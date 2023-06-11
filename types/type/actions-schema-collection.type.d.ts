import type { ActionSchema } from 'moleculer';
type ActionName = string;
export type ActionsSchemaCollection = {
    [key: ActionName]: ActionSchema;
};
export {};
