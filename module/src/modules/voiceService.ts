"use strict";

import { Member, StageChannel, TextVoiceChannel, VoiceChannel } from "eris";
import { BaseDiscordClient } from "../BaseDiscordClient";

export class voiceService {
    client: BaseDiscordClient
    constructor(client: BaseDiscordClient) {
        this.client = client;
    }

    isVoiceEmpty(channel: TextVoiceChannel | StageChannel) {
        if (!channel) return true
        if (channel.voiceMembers.filter(m => !m.bot).length == 0) return true;
        return false;
    }

    async handle(type: "join" | "leave" | "switch", member: any, channel_1?: any, channel_2?: any) {
        if (!this.client.cluster.ready && this.client.cluster.maintenance) return
        if (type === "join") {
            if (this.client.queue.waitingConnect.find((n) => n.userId === member.id && n.serverId === member.guild.id)) {
                const n = this.client.queue.waitingConnect.find((n) => n.userId === member.id && n.serverId === member.guild.id);
                const socketId = this.client.queue._sockets.find(s=>s.serverId === member.guild.id).id

                this.client.queue.emitOp({ socketId: socketId, serverId: member.guild.id, changes: ["JOINED_VC"], queueData: {} });
                this.client.queue.waitingConnect = this.client.queue.waitingConnect.filter((e) => e.id !== n.id);
                this.client.queue.inVoice.push(n);
            }
        } else if (type === "leave") {
            const queue = this.client.queue.get(member.guild.id);
            if (this.client.queue.inVoice.find((n) => n.userId === member.id)) {
                const n = this.client.queue.inVoice.find((n) => n.userId === member.id);
                const socketId = this.client.queue._sockets.find(s=>s.serverId === member.guild.id).id
                this.client.queue.emitOp({ socketId: socketId, serverId: member.guild.id, changes: ["LEFT_VC"], queueData: {} });
                this.client.queue.inVoice = this.client.queue.inVoice.filter((e) => e.id !== n.id);
                this.client.queue.waitingConnect.push(n);
            }

            if (queue && queue.player.connection.channelId === channel_1.id) {
                if (!this.isVoiceEmpty(channel_1)) return;
                if (queue.leaveTimeout) clearTimeout(queue.leaveTimeout)
                queue.leaveTimeout = setTimeout(async () => {
                    if (!this.client.queue.get(member.guild.id)) return;
                    const channel = member.guild.channels.get(channel_1.id)
                    if (!channel) return
                    if (!this.isVoiceEmpty(channel)) return
                    if (!queue.metadata.guildDB.h24) queue.destroy(true)
                }, 1000*60*5).unref();
            }

        } else if (type === "switch") {
            const queue = this.client.queue.get(member.guild.id);
            if (queue && queue.player.connection.channelId === channel_2.id) {
                if (!this.isVoiceEmpty(channel_2)) return;
                if (queue.leaveTimeout) clearTimeout(queue.leaveTimeout)
                queue.leaveTimeout = setTimeout(async () => {
                    if (!this.client.queue.get(member.guild.id)) return;
                    const channel = member.guild.channels.get(channel_2.id)
                    if (!channel) return
                    if (!this.isVoiceEmpty(channel)) return
                    if (!queue.metadata.guildDB.h24) queue.destroy(true)
                }, 1000*60*5).unref();
            }
        }
    }
}

