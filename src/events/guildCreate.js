const BaseEvent = require("../abstract/BaseEvent.js");
class GuildCreate extends BaseEvent {
    get name() {
        return "guildCreate";
    }
    get once() {
        return !1;
    }
    async run(e) {
        if (0 == e.channels.cache.length) return;
        const n = e.systemChannel ? e.systemChannel : e.channels.cache.find((n) => "GUILD_TEXT" === n.type && n.permissionsFor(e.me).has("SEND_MESSAGES"));
        n &&
            n.send({
                embeds: [{
                    color: "#3A871F",
                    author: { name: "Thanks for adding Green-bot 👋", icon_url: "https://cdn.discordapp.com/avatars/783708073390112830/f4aabacb3667ba1831d3ca5f7b2e486d.webp?size=512", url: "https://green-bot.app" },
                    description: "To get started, join a voice channel and type `/play`. You can use songs names, video links and playlist links. A full list of commands is available [here](https://green-bot.app/commands).\n\n If you have any questions or need help with Green-bot, [join the support server](https://discord.gg/greenbot)\n        \n        Here is a guide about how to setup Green-bot:\n https://guide.green-bot.app/configuration\n        \n        For exclusives features like **Changing the speed of the music**, **Unlimited queues**, **4 aditional bots**, **Bot customization**, check out [**Green-bot Premium**](https://green-bot.app/premium)",
                }, ],
            });
    }
}
module.exports = GuildCreate;