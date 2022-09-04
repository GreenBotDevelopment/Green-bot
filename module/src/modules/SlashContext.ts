"use strict";
import { BaseDiscordClient } from "../BaseDiscordClient";
import { Member, CommandInteraction } from "eris";
import { ExtendedDispatcher } from "./ExtendedDispatcher";


export class SlashContext {
    client: BaseDiscordClient;
    interaction: CommandInteraction<any>;
    args: Array<String>;
    guildDB: any;
    voice: any;
    me: Member;
    member: Member;
    constructor(client: BaseDiscordClient, interaction: CommandInteraction<any>, args: Array<String>, data: any, me: Member, member: Member) {
        this.client = client;
        this.interaction = interaction;
        this.args = args;
        this.me = me;
        this.voice = null;
        this.member = member;
        this.guildDB = data;
    }
    get guild() {
        return this.me.guild.name? this.me.guild : this.member.guild.name? this.member.guild: this.interaction.channel.guild.name? this.interaction.channel : null;
    }
    get channel() {
        return this.interaction.channel;
    }
    get dispatcher(): ExtendedDispatcher {
        return this.client.queue.get(this.interaction.guildID);
    }
        removeRestricted(songs){
        if(this.guildDB.blacklist_songs && !this.guildDB.blacklist_songs.length) return songs;
        return songs.filter(song => !this.guildDB.blacklist_songs.includes(song.info.title ) && !this.guildDB.blacklist_songs.includes(song.info.author))
    }
    filterSongs(user, songs) {
    //  this.client.database.getUser(user).then(userdata => {
      //    userdata.played_music.push(...songs);
        //    this.client.database.updateUser(userdata)

     //s})
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
        return this.member.user;
    }
    errorMessage(content: string) {
        return this.interaction.editOriginalMessage({ embeds: [{ description: content, color: 0xc73829 }] });
    }
    reply(data:any) {
        return this.interaction.editOriginalMessage( data);
    }
    send(data:any) {
        return this.interaction.editOriginalMessage( data);
    }
    successMessage(content: string) {
        return this.interaction.editOriginalMessage({ embeds: [{ description: content, color: 0x3a871f }] });
    }
    premiumlink(endpoint: string) {
        return this.client.config.premiumUrl + endpoint + "?";
    }
}
