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
class Stop extends QuickCommand_1.Command {
    get name() {
        return "search";
    }
    get description() {
        return "Searchs a track for you!";
    }
    get arguments() {
        return [{ name: "query", type: 3, description: "The track you want to search", required: true }];
    }
    get category() {
        return "Everyone Commands";
    }
    get checks() {
        return { voice: true, };
    }
    run({ ctx: e }) {
        return __awaiter(this, void 0, void 0, function* () {
            const n = e.args[0].value;
            if (!e.dispatcher || !e.dispatcher.player.connection) {
                const channel = yield e.getVoiceChannel();
                if (!e.client.hasBotPerm(e, "voiceConnect", channel))
                    return e.errorMessage("I don't have the required permissions to join your voice channel! I need `View Channels`, `Connect` and `Speak` permission. [Permissions Example](https://cdn.discordapp.com/attachments/904438715974287440/909076558558412810/unknown.png)\n If the problem persists, change the voice channel region to `Europe`");
                if (!e.client.hasBotPerm(e, "voiceSpeak", channel) && 13 !== channel.type)
                    return e.errorMessage("I don't have the permission to speak in your voice channel.\n Please give me the permission to or check this guide to learn how to give me this permissions:\nhttps://guide.green-bot.app/frequent-issues/permissions");
                if (e.guildDB.vcs.length && !e.guildDB.vcs.includes(e.member.voiceState.channelID))
                    return e.errorMessage(e.guildDB.vcs.length > 1
                        ? `I am not allowed to play music in your voice channel.\n Please join one of the following channels: ${e.guildDB.vcs.map((e) => `<#${e}>`).join(",")}`
                        : `I can only play music in the <#${e.guildDB.vcs[0]}> channel.`);
            }
            const t = e.client.shoukaku.getNode(), o = yield e.client.queue.create(e, t);
            if (!o)
                return e.errorMessage("I'm not able to join your voice channel. Please try again");
            t.rest.resolve(`ytmsearch:${n}`).then((t) => {
                if (!t.tracks.length || 0 == t.tracks.length)
                    return e.errorMessage("I didn't find any song on the query you provided!");
                const r = t.tracks
                    .map((e, n) => `**${n + 1}**. [${e.info.title.slice(0, 100)}](https://discord.gg/greenbot)`)
                    .slice(0, 10)
                    .join("\n");
                e.channel
                    .createMessage({
                    embeds: [
                        {
                            color: 0x3a871f,
                            description: `• **${t.tracks.length}** results found for \`${n}\`\n• Send the number of the song that you want to play in this channel. Ex: 1`,
                            fields: [{ name: "Songs list", value: r || "No results" }],
                            author: { name: "Green-bot | Search", icon_url: e.author.dynamicAvatarURL() },
                            footer: { text: "Green-bot | Free music for everyone!", icon_url: e.client.user.dynamicAvatarURL() },
                        },
                    ],
                })
                    .then((msg) => __awaiter(this, void 0, void 0, function* () {
                    e.client.collectors.create({
                        channelId: e.channel.id,
                        time: 60000,
                        filter: (n) => n.author.id === e.author.id,
                        end: (x) => {
                            msg.delete();
                            e.errorMessage("Search timed up!");
                        },
                        exec: (n) => {
                            "cancel" === n.content.toLowerCase()
                                ? (e.client.collectors.stop(e.channel.id), n.delete().catch((e) => { }), e.errorMessage("Canceled"))
                                : isNaN(n.content)
                                    ? e.errorMessage("You must send a valid track number").then((e) => setTimeout(() => e.delete().catch((e) => { }), 4e3))
                                    : t.tracks[n.content - 1]
                                        ? (n.delete().catch((e) => { }),
                                            e.client.collectors.stop(e.channel.id),
                                            msg.delete(),
                                            o.addTrack(t.tracks[n.content - 1], e.author),
                                            void (o.queue.length
                                                ? e.send({
                                                    embeds: [{ description: `Enqueued **[${t.tracks[n.content - 1].info.title.slice(0, 100)}](${t.tracks[n.content - 1].info.uri})** at position **${o.queue.length}**`, color: 0x3a871f }],
                                                })
                                                : null))
                                        : e.errorMessage("You must send a valid track number").then((e) => setTimeout(() => e.delete().catch((e) => { }), 4e3));
                        }
                    });
                }));
            });
        });
    }
}
exports.default = Stop;
