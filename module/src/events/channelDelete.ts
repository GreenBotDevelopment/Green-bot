import { GuildChannel } from "discord.js";
import { Guild } from "eris";
import { BaseEvent } from "../abstract/BaseEvent";
import { BaseDiscordClient } from "../BaseDiscordClient";

export default class GuildCreate extends BaseEvent {
    constructor() {
        super({
            name: "channelDelete",
            once: false
        })
    }

    async run(channel: GuildChannel, client: BaseDiscordClient) {
        const queue = client.queue.get(channel.guild.id)
        if(queue && queue.channelId === channel.id || queue && queue.player.connection.channelId === channel.id) return queue.delete(), console.log("Channel queue deleted")
    }
}

