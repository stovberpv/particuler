import type { ActionHooks } from 'moleculer';

type ActionName = string;

/**
 * TODO: docs
 */
export type HooksSchemaCollection = {
  before: { [key: ActionName]: ActionHooks['before']; };
  after: { [key: ActionName]: ActionHooks['after']; };
  error: { [key: ActionName]: ActionHooks['error']; };
};
