type MoleculerActionName = string;
type HookHandler = string;

type Hooks = {
  [key: MoleculerActionName]: HookHandler;
};

type HookType = 'before' | 'after' | 'error';

/**
 * TODO: docs
 */
export type HooksMetadata = Map<HookType, Hooks>;
