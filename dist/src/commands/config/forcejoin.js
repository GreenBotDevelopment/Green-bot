"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
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
    run({ ctx: e }) {
        return __awaiter(this, void 0, void 0, function* () {
            if (e.dispatcher)
                return e.errorMessage("There's already a dispatcher!");
            const node = e.client.shoukaku.getNode();
            const pl = yield node.joinChannel({
                guildId: e.guild.id,
                shardId: e.guild.shard.id,
                channelId: e.member.voiceState.channelID,
                deaf: true
            });
            const queue = yield e.client.queue.create(e, node);
            return e.successMessage("Joined your vc!");
        });
    }
}
exports.default = Skip;
