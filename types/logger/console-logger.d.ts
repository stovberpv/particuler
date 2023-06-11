import type { LoggerInterface } from '../interface';
export declare class ConsoleLogger implements LoggerInterface {
    #private;
    set nodeId(nodeId: string);
    get nodeId(): string;
    info(message: string): void;
}
