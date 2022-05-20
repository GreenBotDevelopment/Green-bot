"use strict";
class CommandService {
    constructor(e) {
        this.client = e;
    }
    isVoiceEmpty(e) {
        return !!e && 0 === e.members.filter((e) => !e.user.bot).size;
    }
    async handle(e, n) {
        if (this.client.queue.waitingConnect.find((n) => n.userId === e.member.id && n.serverId === e.guild.id) && !e.channelId && n.channelId) {
            let n = this.client.queue.waitingConnect.find((n) => n.userId === e.member.id && n.serverId === e.guild.id);
            n || console.log("Nah not finally"),
                this.client.queue.emitOp({ socketId: n.id, serverId: e.guild.id, changes: ["JOINED_VC"] }),
                (this.client.queue.waitingConnect = this.client.queue.waitingConnect.filter((e) => e.id !== n.id)),
                this.client.queue.inVoice.push(n);
        }
        if (this.client.queue.inVoice.find((n) => n.userId === e.member.id) && !n.channelId && e.channelId) {
            let n = this.client.queue.inVoice.find((n) => n.userId === e.member.id);
            this.client.queue.emitOp({ socketId: n.id, serverId: e.guild.id, changes: ["LEFT_VC"] }), (this.client.queue.inVoice = this.client.queue.inVoice.filter((e) => e.id !== n.id)), this.client.queue.waitingConnect.push(n);
        }
        const i = this.client.queue.get(e.guild.id);
        if (i && i.player && i.player.connection)
            if (e.member.id === this.client.user.id) {
                if (e.channelId && e.channelId === i.player.connection.channelId && n.channelId && e.channelId !== n.channelId) return n.guild.me.voice.disconnect(), i.delete(!0);
                if (e.channelId && !n.channelId && !i.stopped) return i.delete(!0);
                e.channelId === n.channelId &&
                    e.member.id === n.guild.me.id &&
                    (e.serverMute !== n.serverMute
                        ? n.serverMute
                            ? i.metadata.channel.send({
                                  embeds: [{ color: "#3A871F", author: { name: "Someone muted me for everyone so I paused the player!", icon_url: this.client.user.displayAvatarURL({ size: 512, format: "png" }) } }],
                              }) && i.player.setPaused(n.serverMute)
                            : i.metadata.channel.send({ embeds: [{ color: "#3A871F", author: { name: "Yay! You unmuted me! The music is now resuming!", icon_url: this.client.user.displayAvatarURL({ size: 512, format: "png" }) } }] }) &&
                              i.player.setPaused(n.serverMute)
                        : e.suppress !== n.suppress && (n.suppress && n.guild.me.voice.setRequestToSpeak(!0).catch({}), i.player.setPaused(n.suppress)));
            } else {
                if (e.channelId && e.channelId === i.player.connection.channelId && n.channelId && e.channelId !== n.channelId) {
                    if (!this.isVoiceEmpty(e.member.guild.channels.cache.get(i.player.connection.channelId))) return;
                    setTimeout(() => {
                        this.isVoiceEmpty(e.member.guild.channels.cache.get(i.player.connection.channelId)) && this.client.queue.get(e.guild.id) && (i.metadata.guildDB.h24 || i.destroy(!0));
                    }, 6e5).unref();
                }
                if (e.channelId && !n.channelId && e.channelId === i.player.connection.channelId) {
                    if (!this.isVoiceEmpty(e.member.guild.channels.cache.get(i.player.connection.channelId))) return;
                    setTimeout(() => {
                        this.isVoiceEmpty(e.member.guild.channels.cache.get(i.player.connection.channelId)) && this.client.queue.get(e.guild.id) && (i.metadata.guildDB.h24 || i.destroy(!0));
                    }, 6e5).unref();
                }
            }
        return !0;
    }
}
module.exports = CommandService;
