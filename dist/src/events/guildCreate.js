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
            name: "guildCreate",
            once: false
        });
    }
    run(guild) {
        return __awaiter(this, void 0, void 0, function* () {
            if (0 == guild.channels.size)
                return;
            const channel = guild.systemChannelID ? guild.channels.get(guild.systemChannelID) : guild.channels.find((n) => n.permissionsOf("783708073390112830").has("sendMessages") && n.permissionsOf("783708073390112830").has("embedLinks"));
            if (!channel || channel.type !== 0)
                return;
            channel.createMessage({
                embeds: [
                    {
                        color: 0x3a871f,
                        author: { name: "Thanks for adding Green-bot 👋", icon_url: "https://cdn.discordapp.com/avatars/783708073390112830/f4aabacb3667ba1831d3ca5f7b2e486d.webp?size=512", url: "https://green-bot.app" },
                        description: "To get started, join a voice channel and type `/play` in a text channel  (Then you can provide a song name, a video link or a playlist link. Check [this tutorial for help](https://youtu.be/CHTr-sy-hQM?t=127).\n A full list of commands is available [here](https://green-bot.app/commands).\n\n If you have any questions or need help with Green-bot, [join the support server](https://discord.gg/greenbot)\n        \n        Here is a guide about how to setup and use Green-bot:\n https://guide.green-bot.app/configuration\n        \n        For exclusives features like **Bypass vote-locks**, **24/7 Music**, **Better Audio filters**, **Autoplay**, check out [**Green-bot Premium**](https://green-bot.app/premium) for only **2.50$** a month!",
                    },
                ],
            });
        });
    }
}
exports.default = GuildCreate;
