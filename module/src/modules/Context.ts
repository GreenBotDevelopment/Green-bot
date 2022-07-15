"use strict";
import { BaseDiscordClient } from "../BaseDiscordClient";
import type { guildSchema } from "../models/guildData";
import { Member, Message } from "eris";
import { ExtendedDispatcher } from "./ExtendedDispatcher";


export class Context {
    client: BaseDiscordClient;
    message: Message<any>;
    args: Array<string>;
    guildDB: any;
    me: Member;
    voice: any;
    member: Member;
    messageController?: Message;
    constructor(client: BaseDiscordClient, message: Message<any>, args: Array<string>, data: any, me: Member, member: Member) {
        this.client = client;
        this.message = message;
        this.args = args;
        this.me = me;
        this.member = member;
        this.voice = null;
        this.guildDB = data;
    }
    get guild() {
        return this.me.guild.name ? this.me.guild : this.member.guild.name ? this.member.guild : this.message.channel.guild.name ? this.message.channel : null;
    }
    get channel() {
        return this.message.channel;
    }
    get dispatcher(): ExtendedDispatcher {
        return this.client.queue.get(this.message.guildID);
    }
    async getVoiceChannel() {
        if (this.voice) return this.voice;
        if (this.member.voiceState.channelID && this.guild.channels.size == 0) {
            const chans = await this.guild.getRESTChannels();
            chans.forEach(c => this.guild.channels.set(c.id, c))
        }
        this.member.voiceState.channelID ? (this.voice = this.guild.channels.get(this.member.voiceState.channelID) ? this.guild.channels.get(this.member.voiceState.channelID) : await this.client.getRESTChannel(this.member.voiceState.channelID)) : null
        return this.voice;
    }
    get author() {
        return this.message.author;
    }
    errorMessage(content: string) {
        return this.client.createMessage(this.channel.id, { embeds: [{ description: content, color: 0xc73829 }] });
    }
    send(data: any) {
        return this.client.createMessage(this.channel.id, data);
    }
    successMessage(content: string) {
        return this.client.createMessage(this.channel.id, { embeds: [{ description: content, color: 0x3a871f }] });
    }
    premiumlink(endpoint: string) {
        return this.client.config.premiumUrl + endpoint + "?";
    }
}
