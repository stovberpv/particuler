// import {  } from

import type { LoggerInterface } from '../interface';

/**
 * TODO: docs
 */
export class ConsoleLogger implements LoggerInterface {
  #nodeId = '';

  set nodeId (nodeId: string) {
    this.#nodeId = nodeId;
  }

  get nodeId (): string {
    return this.#nodeId;
  }

  /**
   * TODO: docs
   *
   * @param   message
   * @returns
   */
  info (message: string): void {
    this.#print(
      `[${this.#now()}] INFO  ${this.nodeId}/PARTICULER: ${message}.`
    );
  }

  #now = (): string => new Date().toISOString();

  #print = (message: string): void => console.log(message);
}
