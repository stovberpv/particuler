type MethodOriginName = string;
type PropertyName = string;
type PropertyValue = unknown;
type MoleculerProperties = {
    [key: PropertyName]: PropertyValue;
};
export type PropertiesMetadata = Map<MethodOriginName, MoleculerProperties>;
export {};
