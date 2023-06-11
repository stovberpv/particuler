import type { ValidationSchema as Schema } from 'fastest-validator';
export declare const SetProperty: (key: string, value: unknown) => MethodDecorator;
export declare const PropagateContextStorage: (propagate?: boolean) => MethodDecorator;
export declare const Summary: (summary: string) => MethodDecorator;
export declare const Description: (description: string) => MethodDecorator;
export declare const RequiredPermission: (permissions: string) => MethodDecorator;
export declare const Visibility: (visibility: 'published' | 'public' | 'protected' | 'private') => MethodDecorator;
export declare const Name: (name: string) => MethodDecorator;
export declare const Params: (schema: Schema) => MethodDecorator;
export declare const Rest: (method: 'GET' | 'POST' | 'DELETE' | 'PUT' | 'PATCH', path: string) => MethodDecorator;
export declare const Get: (path: string) => MethodDecorator;
export declare const Post: (path: string) => MethodDecorator;
export declare const Delete: (path: string) => MethodDecorator;
export declare const Put: (path: string) => MethodDecorator;
export declare const Patch: (path: string) => MethodDecorator;
export declare const HandlerType: (type: 'legacy' | 'new') => MethodDecorator;
