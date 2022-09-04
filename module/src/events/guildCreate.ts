import { Guild } from "eris";
import { BaseEvent } from "../abstract/BaseEvent";
import { BaseDiscordClient } from "../BaseDiscordClient";

export default class GuildCreate extends BaseEvent {
    constructor() {
        super({
            name: "guildCreate",
            once: false
        })
    }

    async run(guild: Guild, client: BaseDiscordClient) {
        if (0 == guild.channels.size) return;
        const channel = guild.systemChannelID ? guild.channels.get(guild.systemChannelID) : guild.channels.find((n) =>  n.permissionsOf(client.user.id).has("sendMessages") &&  n.permissionsOf(client.user.id).has("embedLinks"));
        if (!channel || channel.type !== 0) return
        channel.createMessage({
            embeds: [
                {
                    color: 0x3a871f,
                    author: { name: "Thanks for adding Green-bot 👋", icon_url: client.user.avatarURL, url: "https://green-bot.app" },
                    description:
                        "To get started, join a voice channel and send `*play your_song` , don't forget to replace your_song by what you want to play (you can provide a song name, a video link or a playlist link. Check [this tutorial for help](https://youtu.be/CHTr-sy-hQM?t=127).\n A full list of commands is available [here](https://green-bot.app/commands).\n\n If you have any questions or need help with Green-bot, [join the support server](https://discord.gg/greenbot)\n        \n        Here is a guide about how to setup and use Green-bot:\n https://guide.green-bot.app/configuration\n        \n        If you want a next level version of Green-bot with all restrictions off you should check the [**premium version**](https://green-bot.app/premium)",
                },
            ],
        });
    }
}

