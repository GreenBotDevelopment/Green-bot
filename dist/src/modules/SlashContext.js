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
exports.SlashContext = void 0;
class SlashContext {
    constructor(client, interaction, args, data, me, member) {
        this.client = client;
        this.interaction = interaction;
        this.args = args;
        this.me = me;
        this.voice = null;
        this.member = member;
        this.guildDB = data;
    }
    get guild() {
        return this.me.guild.name ? this.me.guild : this.member.guild.name ? this.member.guild : this.interaction.channel.guild.name ? this.interaction.channel : null;
    }
    get channel() {
        return this.interaction.channel;
    }
    get dispatcher() {
        return this.client.queue.get(this.interaction.guildID);
    }
    getVoiceChannel() {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.voice)
                return this.voice;
            if (this.member.voiceState.channelID && this.guild.channels.size == 0) {
                const chans = yield this.guild.getRESTChannels();
                chans.forEach(c => this.guild.channels.set(c.id, c));
            }
            this.member.voiceState.channelID ? (this.voice = this.guild.channels.get(this.member.voiceState.channelID) ? this.guild.channels.get(this.member.voiceState.channelID) : yield this.client.getRESTChannel(this.member.voiceState.channelID)) : null;
            return this.voice;
        });
    }
    get author() {
        return this.interaction.member.user;
    }
    errorMessage(content) {
        return this.interaction.editOriginalMessage({ embeds: [{ description: content, color: 0xc73829 }] });
    }
    reply(data) {
        return this.interaction.editOriginalMessage(data);
    }
    send(data) {
        return this.interaction.editOriginalMessage(data);
    }
    successMessage(content) {
        return this.interaction.editOriginalMessage({ embeds: [{ description: content, color: 0x3a871f }] });
    }
    premiumlink(endpoint) {
        return this.client.config.premiumUrl + endpoint + "?";
    }
}
exports.SlashContext = SlashContext;
