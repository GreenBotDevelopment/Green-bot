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
        if (type === "join") {
            if (this.client.queue.users.find((n) => n.userId === member.id && n.serverId === member.guild.id  )) {
                    this.client.queue.emitOp({  serverId: member.guild.id,userId: member.id, changes: ["VOICE_UPDATE"], queueData: {channelId: channel_1.id|| member.voiceState.channelId} });
           

            }
        } else if (type === "leave") {
            const queue = this.client.queue.get(member.guild.id);
              if (this.client.queue.users.find((n) => n.userId === member.id && n.serverId === member.guild.id  )) {
                    this.client.queue.emitOp({  serverId: member.guild.id,userId: member.id, changes: ["VOICE_UPDATE"], queueData: {channelId: null} });
            }

            if (queue && queue.player.connection.channelId === channel_1.id) {
                if (!this.isVoiceEmpty(channel_1)) return;
                if (queue.leaveTimeout) clearTimeout(queue.leaveTimeout)
                if(queue.metadata.guildDB.leave_settings && queue.metadata.guildDB.leave_settings.channel_empty === true){
                    queue.destroy(true)
                     return
                }
                queue.leaveTimeout = setTimeout(async () => {
                    if (!this.client.queue.get(member.guild.id)) return;
                    const channel = member.guild.channels.get(channel_1.id)
                    if (!channel) return
                    if (!this.isVoiceEmpty(channel)) return
                    if (!queue.metadata.guildDB.h24) queue.destroy(true)
                }, 1000 * 60 * 5).unref();
            }

        } else if (type === "switch") {
            if(member.id === this.client.user.id){
                if(channel_1.type == 13){
                    this.client.editGuildVoiceState(member.guild.id, { suppress: false, channelID: channel_1.id })
                }
                this.client.queue.emitOp({ changes: ["BOT_JOIN_VC"], serverId: member.guild.id, queueData: { channelId: channel_1.id } })

            }
              if (this.client.queue.users.find((n) => n.userId === member.id && n.serverId === member.guild.id  )) {
                    this.client.queue.emitOp({  serverId: member.guild.id,userId: member.id, changes: ["VOICE_UPDATE"], queueData: {channelId: channel_1.id || member.voiceState.channelId} });
                }

            const queue = this.client.queue.get(member.guild.id);
            if (queue && queue.player.connection.channelId === channel_2.id) {
                if (!this.isVoiceEmpty(channel_2)) return;
                 if(queue.metadata.guildDB.leave_settings && queue.metadata.guildDB.leave_settings.channel_empty === true){
                     queue.destroy(true)
                     return
                }
                if (queue.leaveTimeout) clearTimeout(queue.leaveTimeout)
                queue.leaveTimeout = setTimeout(async () => {
                    if (!this.client.queue.get(member.guild.id)) return;
                    const channel = member.guild.channels.get(channel_2.id)
                    if (!channel) return
                    if (!this.isVoiceEmpty(channel)) return
                    if (!queue.metadata.guildDB.h24) queue.destroy(true)
                }, 1000 * 60 * 5).unref();
            }
        }
    }
}

