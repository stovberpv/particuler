import type { AbstractConstructor } from './abstract-constructor.type';
export type ModuleParams = {
    actions?: AbstractConstructor[];
    events?: AbstractConstructor[];
    hooks?: AbstractConstructor[];
};
