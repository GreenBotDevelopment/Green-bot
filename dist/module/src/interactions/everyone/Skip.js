"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const QuickCommand_1 = require("../../abstract/QuickCommand");
class Skip extends QuickCommand_1.Command {
    get name() {
        return "skip";
    }
    get description() {
        return "Skips the currently playing song";
    }
    get aliases() {
        return ["next", "s"];
    }
    get category() {
        return "Everyone Commands";
    }
    get checks() {
        return { voice: true, dispatcher: true, channel: true };
    }
    async run({ ctx: e }) {
        if ((e.dispatcher.player.paused && e.dispatcher.pause(false), 0 == e.dispatcher.queue.length && "autoplay" !== e.dispatcher.repeat))
            return e.errorMessage(`Nothing next in the queue. Use \`/queue\` to see the server's queue.\nWant to try autoplay? do \`/autoplay\``);
        const channel = e.guild.channels.get(e.dispatcher.player.connection.channelId);
        if (channel && channel.voiceMembers.filter(m => !m.bot).length >= 2 && e.guildDB.vote_skip) {
            if (e.dispatcher.voting)
                return e.errorMessage("Another vote for skipping the current track is already running.");
            e.send({
                embeds: [{ author: { name: `${e.author.username} requested to skip the current track! Vote!`, icon_url: e.author.dynamicAvatarURL(), url: "https://discord.gg/synAXZtQHM" }, color: 0x3a871f }],
                components: [{ components: [{ custom_id: "vote", style: 3, type: 2, label: "Vote to skip!" }], type: 1 }],
            })
                .then((t) => {
                let r = 0, s = [];
                e.dispatcher.voting = true;
                const o = (function (e) {
                    return Math.round((e + 1) / 2);
                })(channel.voiceMembers.filter(m => !m.bot).length);
                e.client.collectors.create({
                    channelId: e.channel.id,
                    type: "button",
                    time: 60000,
                    filter: (e) => e.data && "vote" === e.data.custom_id,
                    end: (x) => {
                        e.dispatcher && e.dispatcher.voting && (e.dispatcher.voting = false),
                            r !== o &&
                                t.edit({
                                    embeds: [{ author: { name: "Vote cancelled! Please do the command again!", icon_url: e.author.dynamicAvatarURL(), url: "https://discord.gg/synAXZtQHM" }, color: 0x3a871f }],
                                    components: [{ components: [{ custom_id: "vote", style: 3, disabled: true, type: 2, label: "Vote to skip the current track!" }], type: 1 }],
                                });
                    },
                    exec: (i) => {
                        if (!i.member.voiceState.channelID || e.member.voiceState.channelID !== e.me.voiceState.channelID)
                            return i.createMessage({ embeds: [{ description: "You have already voted!", color: 0xc73829 }], ephemeral: true });
                        if (s.includes(i.member.id))
                            return i.createMessage({ embeds: [{ description: "You have already voted!", color: 0xc73829 }], ephemeral: true });
                        s.push(i.member.id),
                            r++,
                            i.createMessage({ embeds: [{ author: { name: `${i.member.user.username} voted to skip! (${r}/${o})`, icon_url: i.member.user.dynamicAvatarURL(), url: "https://discord.gg/synAXZtQHM" }, color: 0x3a871f }] })
                                .then(() => {
                                setTimeout(() => (i.deleteOriginalMessage()), 15000);
                            }),
                            r === o && (e.client.collectors.stop(e.channel.id), (e.dispatcher.voting = false), e.dispatcher.skip(), e.send({
                                embeds: [{ author: { name: `Skipping the track after ${r} positive votes!`, icon_url: e.guild.iconURL, url: "https://discord.gg/synAXZtQHM" }, color: 0x3a871f }],
                                components: [{ components: [{ custom_id: "vote", style: 3, type: 2, label: "Vote to skip!", disabled: true }], type: 1 }],
                            }), t.delete().catch((e) => { }));
                    }
                });
            });
        }
        else if (e.guildDB.djroles && e.guildDB.djroles.length) {
            if (!this.checkDJ)
                return e.errorMessage("You need to have the DJ role or the `Manage messages` permissions to use this command.");
            e.dispatcher.skip(), e.send("**⏩ *Skipping* 👍**");
        }
        else
            e.dispatcher.skip(), e.send("**⏩ *Skipping* 👍**");
    }
    checkDJ(e) {
        let t = false;
        return (e.guildDB.djroles && e.guildDB.djroles.length && e.member.roles.find((t) => e.guildDB.djroles.includes(t)) && (t = true),
            e.dispatcher && e.dispatcher.metadata.dj == e.member.id && (t = true),
            e.member.permissions.has("manageGuild") && (t = true),
            t);
    }
}
exports.default = Skip;
