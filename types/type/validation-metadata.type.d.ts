type MethodOriginName = string;
type ValidationResultInjectionIndex = number;
type ValidationClass = new (...args: any[]) => object;
type Validator = [ValidationResultInjectionIndex, ValidationClass];
export type ValidationMetadata = Map<MethodOriginName, Validator>;
export {};
