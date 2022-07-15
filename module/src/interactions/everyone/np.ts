import { Command } from "../../abstract/QuickCommand";
import { humanizeTime } from "../../modules/ExtendedDispatcher";
export default class Np extends Command {
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
        return { voice: false, dispatcher: true, channel: false };
    }
    run({ ctx: e }) {
        const r = e.dispatcher.current.info;
        e.reply({
            embeds: [
                {
                    color: 0x3a871f,
                    author: { name: "| Now playing", icon_url: e.author.dynamicAvatarURL(), url: "https://green-bot.app" },
                    description: `[${r.title}](https://discord.gg/greenbot) \n\n• __Author:__ ${r.author}\n• __Source:__ ${r.sourceName}\n• __Requester:__ ${
                        r.requester ? r.requester.name : "Unknow"
                    }\n• __Progess:__ ${humanizeTime(e.dispatcher.player.position)} - ${humanizeTime(r.length)}`,
                    thumbnail: { url: `https://img.youtube.com/vi/${r.identifier}/default.jpg` },
                },
            ],
        });
    }
}
