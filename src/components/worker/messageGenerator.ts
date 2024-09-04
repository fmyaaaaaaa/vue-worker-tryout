import {MessageGenerationEvent} from "../../models/MessageGenerationEvent.ts";
import {MessageModelDTO} from "./model/MessageModelDTO.ts";

const sleep = (ms: number): Promise<void> => {
    return new Promise((resolve) => setTimeout(resolve, ms))
}

self.onmessage = async (event: MessageEvent) => {
    const config: MessageGenerationEvent = event.data
    const count = config.msgCount;
    for (let i = 0; i < count; i++) {
        const dto = new MessageModelDTO(
            i,
            config.key,
            config.msg
        )
        postMessage(dto);
        await sleep(config.millisecond)
    }
}
