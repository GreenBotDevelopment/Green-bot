"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const BaseEvent_1 = require("../abstract/BaseEvent");
class Ready extends BaseEvent_1.BaseEvent {
    constructor() {
        super({
            name: "ready",
            once: true
        });
    }
    async run(client) {
        client.config.debug && console.log("[Shard] Bot is ready");
        client.shards.forEach(shard => {
            shard.editStatus("online", { name: "*help | green-bot.app", type: 3 });
        });
    }
}
exports.default = Ready;
