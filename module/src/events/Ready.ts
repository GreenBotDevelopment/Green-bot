import { BaseEvent } from "../abstract/BaseEvent";

export default class Ready extends BaseEvent {
    constructor() {
        super({
            name: "ready",
            once: true
        })
    }

    async run(client) {
        client.config.debug && console.log("[Shard] Bot is ready")
        client.shards.forEach(shard => {
            shard.editStatus("online", { name: "*help | green-bot.app", type: 3 })
        })
    }
}
