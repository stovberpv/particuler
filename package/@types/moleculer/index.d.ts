import 'moleculer';

declare module 'moleculer' {
  interface ActionSchema {

    /**
     * TODO:
     */
    propagateContextStorage?: boolean;

    paramsValidator?: new (...args: any[]) => object;
  }

  interface ServiceEvent {

    /**
     * TODO:
     */
    propagateContextStorage?: boolean;

    paramsValidator?: new (...args: any[]) => object;
  }

  interface Context {
    locals?: {
      validatedParams?: object;
      [key: string]: unknown;
    };
  }
}
