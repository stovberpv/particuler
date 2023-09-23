/**
 * TODO: docs
 */
type MethodOriginName = string;

/**
 * TODO: docs
 */
type ValidationResultInjectionIndex = number;

/**
 * TODO: docs
 */
type ValidationClass = new (...args: any[]) => object;

/**
 * TODO: docs
 */
type Validator = [ValidationResultInjectionIndex, ValidationClass];

/**
 * TODO: docs
 */
export type ValidationMetadata = Map<MethodOriginName, Validator>;
