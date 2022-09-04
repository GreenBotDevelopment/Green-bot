import { Command } from "../../abstract/QuickCommand";
export default class Stats extends Command {
    get name() {
        return "stats";
    }
    get aliases() {
        return ["bi", "botinfo"];
    }
    get category() {
        return "Everyone Commands";
    }
    get description() {
        return "My current info!";
    }
    async run({ ctx: e }) {
        const servers  = await e.client.cluster.broadcastEval("this.guilds.size")
        const allServers = servers.flat(Infinity).reduce((a, b) => a + b)
        e.send({
            embeds: [
                {
                    author: { name: "Green-bot | Infos", url: "https://discord.gg/greenbot", icon_url: e.author.dynamicAvatarURL() },
                    color: 0x3a871f,
                    description: "Green-bot is a free discord music bot wich aims to provide free 24/7 music for everyone!",
                    fields: [
                        { name: "Current node", value: "Node-Europa ( Germany )", inline: true },
                        { name: "Server Count", value: allServers.toLocaleString(), inline: true },
                        { name: "Framework", value: "NodeJS - Lavalink - Shoukaku", inline: true },
                    ],
                    footer: { text: "Want more? Check our premium (green-bot.app/premium)", icon_url: e.client.user.dynamicAvatarURL() },
                },
            ],
        });
    }
}
