import type { ServiceEvent } from 'moleculer';
type EventName = string;
export type EventsSchemaCollection = {
    [key: EventName]: ServiceEvent;
};
export {};
