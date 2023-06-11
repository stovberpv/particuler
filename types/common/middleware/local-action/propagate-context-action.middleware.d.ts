import type { ActionHandler, ActionSchema } from 'moleculer';
export declare const PropagateContextActionMiddleware: {
    localAction: (handler: ActionHandler, action: ActionSchema) => ActionHandler;
};
