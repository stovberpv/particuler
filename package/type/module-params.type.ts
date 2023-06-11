import type { AbstractConstructor } from './abstract-constructor.type';

/**
 * TODO: docs & rename
 */
export type ModuleParams = {
  actions?: AbstractConstructor[];
  events?: AbstractConstructor[];
  hooks?: AbstractConstructor[];
};
