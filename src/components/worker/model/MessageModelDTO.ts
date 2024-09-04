export class MessageModelDTO {
    id: number;

    key: string;

    message: string;

    constructor(id: number, key: string, message: string) {
        this.id = id;
        this.key = key;
        this.message = message
    }
}
