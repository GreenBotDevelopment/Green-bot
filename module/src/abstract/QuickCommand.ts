import { BaseDiscordClient } from "../BaseDiscordClient";

export class Command{
    client: BaseDiscordClient
    constructor(client) {
        this.client  = client;
        if (this.constructor === Command) throw new TypeError('Abstract class "QuickCommand" cannot be instantiated directly.');
    }

}
