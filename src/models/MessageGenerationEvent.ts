export interface MessageGenerationEvent extends MessageEvent {
    msgCount: number,
    key: string,
    msg: string,
    millisecond: number
}
