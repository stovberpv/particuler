/**
 * TODO: docs
 */
type MethodOriginName = string;

/**
 * TODO: docs
 */
type PropertyName = string;

/**
 * TODO: docs
 */
type PropertyValue = unknown;

/**
 * TODO: docs
 */
type MoleculerProperties = { [key: PropertyName]: PropertyValue; };

export type PropertiesMetadata = Map<MethodOriginName, MoleculerProperties>;
