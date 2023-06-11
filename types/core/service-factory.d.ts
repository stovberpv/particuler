import type { BrokerOptions, ServiceSchema } from 'moleculer';
import type { AbstractConstructor } from '../type';
import type { LoggerInterface } from '../interface';
export declare class ServiceFactory {
    #private;
    useBrokerConfig(config: Pick<BrokerOptions, 'nodeID'>): this;
    useLogger(logger: LoggerInterface): this;
    useService(service: ServiceSchema): this;
    useModules(Modules: AbstractConstructor[]): this;
    create(): ServiceSchema;
}
