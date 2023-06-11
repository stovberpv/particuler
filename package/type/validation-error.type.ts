/**
 * TODO: docs
 */
type PropertyName = string;

/**
 * TODO: docs
 */
type Constraints = string;

/**
 * TODO: docs
 */
export type ValidationError = { [key: PropertyName]: Constraints[]; };
