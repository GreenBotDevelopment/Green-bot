"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const QuickCommand_1 = require("../../abstract/QuickCommand");
const ExtendedDispatcher_1 = require("../../modules/ExtendedDispatcher");
class Queue extends QuickCommand_1.Command {
    get name() {
        return "np";
    }
    get description() {
        return "Shows the current playing track";
    }
    get aliases() {
        return ["song", "current"];
    }
    get category() {
        return "Everyone Commands";
    }
    get checks() {
        return { voice: false, dispatcher: true, };
    }
    run({ ctx: e }) {
        const r = e.dispatcher.current.info;
        e.send({
            embeds: [
                {
                    color: 0x3a871f,
                    author: { name: "| Now playing", icon_url: e.author.dynamicAvatarURL(), url: "https://green-bot.app" },
                    description: `[${r.title}]("https://freesounds.org") \n\n• __Author:__ ${r.author}\n• __Source:__ Freesounds.com\n• __Requester:__ ${r.requester ? r.requester.name : "Unknow"}\n• __Progess:__ ${(0, ExtendedDispatcher_1.humanizeTime)(e.dispatcher.player.position)} - ${(0, ExtendedDispatcher_1.humanizeTime)(r.length)}`,
                },
            ],
        });
    }
}
exports.default = Queue;
