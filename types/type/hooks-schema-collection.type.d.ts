import type { ActionHooks } from 'moleculer';
type ActionName = string;
export type HooksSchemaCollection = {
    before: {
        [key: ActionName]: ActionHooks['before'];
    };
    after: {
        [key: ActionName]: ActionHooks['after'];
    };
    error: {
        [key: ActionName]: ActionHooks['error'];
    };
};
export {};
