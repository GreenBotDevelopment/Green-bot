"use strict";
import { BaseDiscordClient } from "../BaseDiscordClient";
import type { guildSchema } from "../models/guildData";
import { Member, Message } from "eris";
import { ExtendedDispatcher } from "./ExtendedDispatcher";


export class Context {
    client: BaseDiscordClient;
    message: Message<any>;
    args: Array<String>;
    guildDB: any;
    me: Member;
    voice: any;
    member: Member;
    messageController?: Message;
    constructor(client: BaseDiscordClient, message: Message<any>, args: Array<String>, data: any, me: Member, member: Member) {
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
    removeRestricted(songs) {
        if (this.guildDB.blacklist_songs && !this.guildDB.blacklist_songs.length) return songs;
        return songs.filter(song => !this.guildDB.blacklist_songs.includes(song.info.title) && !this.guildDB.blacklist_songs.includes(song.info.author))
    }
    filterSongs(user, songs) {
        //this.client.database.getUser(user).then(userdata => {
          //  userdata.played_music.push(...songs);
          //this.client.database.updateUser(userdata)
       // })
        if (!this.guildDB.max_songs || this.guildDB.max_songs.user == -1 && this.guildDB.max_songs.guild == 10000) return { songs: songs, fullType: "no" }
        let canBe = songs;
        let fullType = "no";

        if (!this.dispatcher) {
            if (this.guildDB.max_songs.user !== -1 && songs.length > this.guildDB.max_songs.user) (canBe = songs.splice(0, this.guildDB.max_songs.user), fullType = "user")
            if (songs.length > this.guildDB.max_songs.guild && fullType !== "user") (canBe = songs.splice(0, this.guildDB.max_songs.guild), fullType = "guild")

        } else {
            let userSongs = this.dispatcher.queue.filter(tr => tr.info.requester.id === user);
            if (this.guildDB.max_songs.user !== -1 && (songs.length + userSongs.length > this.guildDB.max_songs.user)) (canBe = songs.splice(0, this.guildDB.max_songs.user), fullType = "user")
            if ((songs.length + this.dispatcher.queue.length) > this.guildDB.max_songs.guild) {
                let leftSpots = this.guildDB.max_songs.guild - this.dispatcher.queue.length
                canBe = songs.splice(0, leftSpots+1), fullType = "guild"
            }
        }
        return { songs: canBe, fullType: fullType }
    }
    errorMessage(content: string) {
        return this.client.createMessage(this.channel.id, { embeds: [{ description: content, color: 0xc73829 }] });
    }
    send(data: any) {
        return this.client.createMessage(this.channel.id, data);
    }
    reply(data: any) {
        return this.client.createMessage(this.channel.id, data);
    }
    successMessage(content: string) {
        return this.client.createMessage(this.channel.id, { embeds: [{ description: content, color: 0x3a871f }] });
    }
    premiumlink(endpoint: string) {
        return this.client.config.premiumUrl + endpoint + "?";
    }
}
