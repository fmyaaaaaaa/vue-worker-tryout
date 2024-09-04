import {MessageModelDTO} from "../components/worker/model/MessageModelDTO.ts";

/**
 * Message Class. DTO instance is the only constructor for this class
 */
export default class MessageModel {
    id: number;

    key: string;

    message: string;

    constructor(dto: MessageModelDTO) {
        this.id = dto.id;
        this.key = dto.key;
        this.message = dto.message;
    }

    /**
     * Generate a message with the below format
     * Sample: key = VWT, id = 1, message = HelloWorld
     *
     * VWT-1: HelloWorld
     */
    outputMessage() {
        return this.key + "-" + this.id + ": " + this.message
    }
}
