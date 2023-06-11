type PropertyName = string;
type Constraints = string;
export type ValidationError = {
    [key: PropertyName]: Constraints[];
};
export {};
