import type { BrokerOptions, ServiceSchema } from 'moleculer';

import { ModuleSchemaDiscovery } from './discovery';
import type { AbstractConstructor } from '../type';
import type { LoggerInterface } from '../interface';
import { ConsoleLogger } from '../logger';

/**
 * TODO: docs
 */
export class ServiceFactory {
  #service: ServiceSchema;

  #Modules: AbstractConstructor[] = [];

  #config: Pick<BrokerOptions, 'nodeID'> = {};

  #logger: LoggerInterface = new ConsoleLogger();

  /**
   * TODO: docs
   *
   * @param   config
   * @returns
   */
  useBrokerConfig (config: Pick<BrokerOptions, 'nodeID'>): this {
    this.#config = config;

    this.#logger.nodeId = this.#config.nodeID ?? '';

    return this;
  }

  /**
   * TODO: docs
   *
   * @param   logger
   * @returns
   */
  useLogger (logger: LoggerInterface): this {
    this.#logger = logger;

    this.#logger.nodeId = this.#config.nodeID ?? '';

    return this;
  }

  /**
   * TODO: docs
   *
   * @param   service
   * @returns
   */
  useService (service: ServiceSchema): this {
    this.#service = service;

    return this;
  }

  /**
   * TODO: docs
   *
   * @param   Modules
   * @returns
   * @throws  ReferenceError
   */
  useModules (Modules: AbstractConstructor[]): this {
    this.#Modules = Modules;

    return this;
  }

  create (): ServiceSchema {
    if (!this.#service) {
      throw new ReferenceError('Service is not defined');
    }

    if (!Array.isArray(this.#service.mixins)) {
      this.#service.mixins = [];
    }

    for (const Module of this.#Modules) {
      const schemas = Array.from(ModuleSchemaDiscovery(Module));

      this.#service.mixins.push(...schemas);

      this.#logger.info(`Module ${Module.name} initialized`);
    }

    return this.#service;
  }
}
