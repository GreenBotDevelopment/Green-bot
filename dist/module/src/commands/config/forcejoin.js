"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const QuickCommand_1 = require("../../abstract/QuickCommand");
class Skip extends QuickCommand_1.Command {
    get name() {
        return "forcejoin";
    }
    get description() {
        return "Fixes every single problem with the player";
    }
    get category() {
        return "Admin Commands";
    }
    get checks() {
        return { voice: true, };
    }
    async run({ ctx: e }) {
        if (e.dispatcher)
            return e.errorMessage("There's already a dispatcher!");
        const node = e.client.shoukaku.getNode();
        const pl = await node.joinChannel({
            guildId: e.guild.id,
            shardId: e.guild.shard.id,
            channelId: e.member.voiceState.channelID,
            deaf: true
        });
        const queue = await e.client.queue.create(e, node);
        return e.successMessage("Joined your vc!");
    }
}
exports.default = Skip;
