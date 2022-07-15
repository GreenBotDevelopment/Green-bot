import { BaseDiscordClient } from "../BaseDiscordClient";
import { readdirSync }  from "fs";

export class EventHandler {
    client: BaseDiscordClient
    constructor(client: BaseDiscordClient) {
        this.client = client;
        this.build()
    }
  async  build() {
        const files = readdirSync(`${this.client.location}/module/src/events`);
        for (const t of files) {
            if(t.endsWith(".map")) return
            const commandX = await import(`${this.client.location}/module/src/events/${t}`)
            const c = commandX.default;
            const event = new c()
            event.once ? this.client.once(event.name, (...data) => event.run(...data, this.client)) : this.client.on(event.name, (...data) => event.run(...data, this.client)), 0;
        }
        return this;
    }
}
