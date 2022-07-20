"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const BaseEvent_1 = require("../abstract/BaseEvent");
class GuildCreate extends BaseEvent_1.BaseEvent {
    constructor() {
        super({
            name: "channelDelete",
            once: false
        });
    }
    async run(channel, client) {
        const queue = client.queue.get(channel.guild.id);
        if (queue && queue.channelId === channel.id || queue && queue.player.connection.channelId === channel.id)
            return queue.delete(), console.log("Channel queue deleted");
    }
}
exports.default = GuildCreate;
