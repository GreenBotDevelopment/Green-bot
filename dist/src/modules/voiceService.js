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
exports.voiceService = void 0;
class voiceService {
    constructor(client) {
        this.client = client;
    }
    isVoiceEmpty(channel) {
        if (!channel)
            return true;
        if (channel.voiceMembers.filter(m => !m.bot).length == 0)
            return true;
        return false;
    }
    handle(type, member, channel_1, channel_2) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this.client.cluster.ready && this.client.cluster.maintenance)
                return;
            if (type === "join") {
                if (this.client.queue.waitingConnect.find((n) => n.userId === member.id && n.serverId === member.guild.id)) {
                    const n = this.client.queue.waitingConnect.find((n) => n.userId === member.id && n.serverId === member.guild.id);
                    const socketId = this.client.queue._sockets.find(s => s.serverId === member.guild.id).id;
                    this.client.queue.emitOp({ socketId: socketId, serverId: member.guild.id, changes: ["JOINED_VC"], queueData: {} });
                    this.client.queue.waitingConnect = this.client.queue.waitingConnect.filter((e) => e.id !== n.id);
                    this.client.queue.inVoice.push(n);
                }
            }
            else if (type === "leave") {
                const queue = this.client.queue.get(member.guild.id);
                if (this.client.queue.inVoice.find((n) => n.userId === member.id)) {
                    const n = this.client.queue.inVoice.find((n) => n.userId === member.id);
                    const socketId = this.client.queue._sockets.find(s => s.serverId === member.guild.id).id;
                    this.client.queue.emitOp({ socketId: socketId, serverId: member.guild.id, changes: ["LEFT_VC"], queueData: {} });
                    this.client.queue.inVoice = this.client.queue.inVoice.filter((e) => e.id !== n.id);
                    this.client.queue.waitingConnect.push(n);
                }
                if (queue && queue.player.connection.channelId === channel_1.id) {
                    if (!this.isVoiceEmpty(channel_1))
                        return;
                    if (queue.leaveTimeout)
                        clearTimeout(queue.leaveTimeout);
                    queue.leaveTimeout = setTimeout(() => __awaiter(this, void 0, void 0, function* () {
                        if (!this.client.queue.get(member.guild.id))
                            return;
                        const channel = member.guild.channels.get(channel_1.id);
                        if (!channel)
                            return;
                        if (!this.isVoiceEmpty(channel))
                            return;
                        if (!queue.metadata.guildDB.h24)
                            queue.destroy(true);
                    }), 1000 * 60 * 5).unref();
                }
            }
            else if (type === "switch") {
                const queue = this.client.queue.get(member.guild.id);
                if (queue && queue.player.connection.channelId === channel_2.id) {
                    if (!this.isVoiceEmpty(channel_2))
                        return;
                    if (queue.leaveTimeout)
                        clearTimeout(queue.leaveTimeout);
                    queue.leaveTimeout = setTimeout(() => __awaiter(this, void 0, void 0, function* () {
                        if (!this.client.queue.get(member.guild.id))
                            return;
                        const channel = member.guild.channels.get(channel_2.id);
                        if (!channel)
                            return;
                        if (!this.isVoiceEmpty(channel))
                            return;
                        if (!queue.metadata.guildDB.h24)
                            queue.destroy(true);
                    }), 1000 * 60 * 5).unref();
                }
            }
        });
    }
}
exports.voiceService = voiceService;
