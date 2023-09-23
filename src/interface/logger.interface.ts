/**
 * TODO: docs
 */
export interface LoggerInterface {

  /**
   * TODO: docs & refactor
   */
  set nodeId (nodeId: string);
  get nodeId (): string;

  /**
   * TODO: docs
   *
   * @param message
   */
  info (message: string): void;
}
