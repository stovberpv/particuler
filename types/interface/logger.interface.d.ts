export interface LoggerInterface {
    set nodeId(nodeId: string);
    get nodeId(): string;
    info(message: string): void;
}
