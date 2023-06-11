import type { ServiceEvent, ServiceEventHandler } from 'moleculer';
export declare const PropagateContextEventMiddleware: {
    localEvent: (handler: ServiceEventHandler, event: ServiceEvent) => ServiceEventHandler;
};
