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
const BaseEvent_1 = require("../abstract/BaseEvent");
class GuildCreate extends BaseEvent_1.BaseEvent {
    constructor() {
        super({
            name: "channelDelete",
            once: false
        });
    }
    run(channel, client) {
        return __awaiter(this, void 0, void 0, function* () {
            const queue = client.queue.get(channel.guild.id);
            if (queue && queue.channelId === channel.id || queue && queue.player.connection.channelId === channel.id)
                return queue.delete(), console.log("Channel queue deleted");
        });
    }
}
exports.default = GuildCreate;
