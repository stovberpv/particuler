import type { ServiceEvent } from 'moleculer';

type EventName = string;

/**
 * TODO: docs
 */
export type EventsSchemaCollection = { [key: EventName]: ServiceEvent; };
