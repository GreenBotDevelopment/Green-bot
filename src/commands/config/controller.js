const BaseCommand = require("../../abstract/BaseCommand.js");
class Volume extends BaseCommand {
    get name() {
        return "controller";
    }
    get description() {
        return "Creates a songs request channel";
    }
    get category() {
        return "Admin Commands";
    }
    get permissions() {
        return ["MANAGE_GUILD"];
    }
    get aliases() {
        return ["controler"];
    }
    get playerCheck() {
        return { premium: true };
    }
    get arguments() {
        return [{ name: "channel", description: "The channel you want to set as default text channel. Put disable to disable the default text channek", required: !1 }];
    }
    async run({ ctx: e }) {
        if (e.args[0] && "disable" === e.args[0].toLowerCase())
            return e.guildDB.requestChannel ?
                (e.guild.channels.cache.get(e.guildDB.requestChannel), (e.guildDB.requestChannel = null), e.client.mongoDB.handleCache(e.guildDB), e.succesMessage("The controller channel has been deleted!")) :
                e.errorMessage("The controller is not already set so I can't disable it");
        if (e.guildDB.requestChannel && e.guild.channels.cache.get(e.guildDB.requestChannel)) return e.errorMessage(`The controller channel already exists: <#${e.guildDB.requestChannel}>`);
        let t = e.message.mentions.channels.first();
        if ((t || (t = await e.guild.channels.create("green songs request", { type: "GUILD_TEXT" }).catch((t) => e.errorMessage("Please give me the `Manage channels` permissions to create a controller."))), !t || t.guild.id !== e.guild.id))
            return e.errorMessage("Please provide a valid channel");
        if (((e.guildDB.requestChannel = t.id), !t)) return;
        const n = await t.send({
            embeds: [{
                author: {
                    name: e.guild.name,
                    icon_url: e.guild.icon ? e.guild.iconURL({ dynamic: !0 }) : "https://cdn.discordapp.com/attachments/748897191879245834/782271474450825226/0.png?size=128",
                    url: "https://discord.com/oauth2/authorize?client_id=783708073390112830&scope=bot&permissions=19456",
                },
                description: "Send a music name/link bellow this message to play music.\n[Invite me](https://green-bot.app/invite) | [Premium](https://green-bot.app/premium) | [Vote](https://green-bot.app/vote) | [Commands](https://green-bot.app/commands)",
                image: { url: "https://cdn.discordapp.com/attachments/893185846876975104/900453806549127229/green_bot_banner.png" },
                footer: { text: "Green-bot | Free music for everyone!", icon_url: e.client.user.displayAvatarURL({ dynamic: !0, size: 512 }) },
                color: "#3A871F",
                fields: [{ name: "Now playing", value: "__**Nothing playing**__", inline: !0 }],
            }, ],
            components: [{
                    components: [
                        { customId: "back_button", emoji: "⏮️", style: 2, type: "BUTTON" },
                        { customId: "seek_back_button", emoji: "⏪", style: 2, type: "BUTTON" },
                        { customId: "autoplay", emoji: "🎧", style: 2, type: "BUTTON" },
                        { customId: "seek_button", emoji: "⏩", style: 2, type: "BUTTON" },
                        { customId: "skip", emoji: "⏭️", style: 2, type: "BUTTON" },
                    ],
                    type: "ACTION_ROW",
                },
                {
                    components: [
                        { customId: "pause", emoji: "⏸", style: 2, type: "BUTTON" },
                        { customId: "resume", emoji: "▶", style: 2, type: "BUTTON" },
                        { customId: "stop", emoji: "⏹", style: 2, type: "BUTTON" },
                        { customId: "shuffle", emoji: "🔀", style: 2, type: "BUTTON" },
                        { customId: "loop", emoji: "🔄", style: 2, type: "BUTTON" },
                    ],
                    type: "ACTION_ROW",
                },
            ],
        });
        (e.guildDB.requestChannel = t.id),
        (e.guildDB.requestMessage = n.id),
        e.client.mongoDB.handleCache(e.guildDB),
            e.channel
            .send({
                embeds: [{
                    color: "#3A871F",
                    description: `The controller channel has been successfuly created! ${t}\nJust send the name of a music and join a voice channel to play music!`,
                    footer: { icon_url: e.client.user.displayAvatarURL({ dynamic: !0, size: 512 }), text: "Green-bot | Free music for everyone" },
                    author: { icon_url: e.member.user.displayAvatarURL({ dynamic: !0, size: 512 }), name: e.author.username, url: "https://discord.com/oauth2/authorize?client_id=783708073390112830&scope=bot&permissions=19456" },
                }, ],
            })
            .catch((t) => {
                e.errorMessage("I can't see this channel ");
            });
    }
}
module.exports = Volume;