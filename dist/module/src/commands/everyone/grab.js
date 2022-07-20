"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ExtendedDispatcher_1 = require("../../modules/ExtendedDispatcher");
const QuickCommand_1 = require("../../abstract/QuickCommand");
class Queue extends QuickCommand_1.Command {
    get name() {
        return "grab";
    }
    get description() {
        return "Sends in DM the current track";
    }
    get category() {
        return "Everyone Commands";
    }
    get checks() {
        return { voice: false, dispatcher: true, };
    }
    async run({ ctx: e }) {
        const r = e.dispatcher.current.info;
        const channel = await e.author.getDMChannel();
        channel.createMessage({
            embeds: [
                {
                    color: 0x3a871f,
                    author: { name: `${e.guild.name} - Now playing`, icon_url: e.author.dynamicAvatarURL(), url: "https://green-bot.app" },
                    description: `[${r.title}]($https://discord.gg/greenbot) \n\n• __Author:__ ${r.author}\n• __Source:__ ${r.sourceName}\n• Progess: ${(0, ExtendedDispatcher_1.humanizeTime)(e.dispatcher.player.position)} - ${(0, ExtendedDispatcher_1.humanizeTime)(r.length)}`,
                    thumbnail: { url: `https://img.youtube.com/vi/${r.identifier}/default.jpg` },
                },
            ],
        }),
            e.successMessage("I've sent you a DM!");
    }
}
exports.default = Queue;
