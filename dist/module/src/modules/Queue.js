"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.QueueManager = void 0;
const tslib_1 = require("tslib");
const node_fetch_1 = tslib_1.__importDefault(require("node-fetch"));
const ExtendedDispatcher_1 = require("./ExtendedDispatcher");
// The interface of the socket of a connected using in the dahboard
class socketData {
    id;
    serverId;
    userId;
    constructor(opt) {
        this.id = opt.id;
        this.serverId = opt.serverId;
        this.userId = opt.userId;
    }
}
// For sending data to the websocket of the dashboard
class emitData {
    serverId;
    socketId;
    changes;
    queueData;
}
class QueueManager extends Map {
    client;
    _sockets;
    _waiting;
    inVoice;
    waitingConnect;
    dashURL;
    constructor(client) {
        super();
        this.client = client;
        this._sockets = [];
        this._waiting = [];
        this.inVoice = [];
        this.waitingConnect = [];
        this.dashURL = "https://dash.green-bot.app/api/socket";
    }
    async addWaiting(socket) {
        return this._sockets.find((sk) => sk.id === socket.id) || this._sockets.push(socket), this._waiting.find((sk) => sk.id === socket.id) || this._waiting.push(socket);
    }
    async addWaitingUser(serverId, socketId, userId, isInVoice) {
        const data = new socketData({ serverId: serverId, userId: userId, id: socketId });
        if ("true" === isInVoice) {
            this.inVoice.find((sk) => sk.id === socketId) || this.inVoice.push(data);
        }
        else {
            this.waitingConnect.find((sk) => sk.id === socketId) || this.waitingConnect.push(data);
        }
        return true;
    }
    async removeWaitingUser(socketId) {
        this._waiting.find((sk) => sk.id === socketId) && (this._waiting = this._waiting.filter((sk) => sk.id !== socketId));
        return true;
    }
    async removeWaiting(socketId) {
        this.waitingConnect.find((sk) => sk.id === socketId) && (this.waitingConnect = this.waitingConnect.filter((sk) => sk.id !== socketId));
        return true;
    }
    async cleanSocket(socketId) {
        this._sockets.find((sk) => sk.id === socketId) && (this._sockets = this._sockets.filter((sk) => sk.id !== socketId));
        this._waiting.find((sk) => sk.id === socketId) && (this._waiting = this._waiting.filter((sk) => sk.id !== socketId));
        this.inVoice.find((sk) => sk.id === socketId) && (this.inVoice = this.inVoice.filter((sk) => sk.id !== socketId));
        this.waitingConnect.find((sk) => sk.id === socketId) && (this.waitingConnect = this.waitingConnect.filter((sk) => sk.id !== socketId));
        return true;
    }
    async emitOp(data) {
        const fetched = await (0, node_fetch_1.default)(this.dashURL, { method: "post", body: JSON.stringify(data), headers: { "Content-Type": "application/json" } });
        if (!fetched || !fetched.ok)
            return console.log("Something when wrong while sending an op");
        const result = await fetched.json();
        return result.outdated ? (this.cleanSocket(data.socketId), console.log("[Ghot socket] A socket has been just killed"), false) : true;
    }
    async create(context, audioNode) {
        const queueData = this.get(context.guild.id);
        if (!context.member.voiceState.channelID)
            return (context.errorMessage("You need to be in a voice channel to use this command"), null);
        if (queueData) {
            if (queueData && context.me.voiceState.channelID)
                return queueData;
            const k = this.client.shoukaku.players.get(context.guild.id);
            if (k)
                k.connection.disconnect();
            let errored = false;
            const node = this.client.shoukaku.getNode();
            const player = await node.joinChannel({
                guildId: context.guild.id,
                shardId: context.guild.shard.id,
                channelId: context.member.voiceState.channelID,
                deaf: true
            })
                .catch((err) => {
                console.log(err);
                errored = true;
                context.guild.creating = false;
                queueData.player.connection.disconnect();
                queueData.delete();
                context.errorMessage("The player has been destroyed. Please do the command again");
            });
            if (errored || !player)
                return console.log("still not joining vc");
            queueData.player = player;
            return queueData;
        }
        else {
            if (this.client.shoukaku.players.get(context.guild.id)) {
                const player = this.client.shoukaku.players.get(context.guild.id);
                let textChannelId = context.channel.id;
                context.guildDB.textchannel && context.guild.channels.get(context.guildDB.textchannel) && (textChannelId = context.guildDB.textchannel);
                const dispatcher = new ExtendedDispatcher_1.ExtendedDispatcher(this.client, {
                    channelId: textChannelId,
                    guild: { name: context.guild.name, iconURL: context.guild.iconURL, id: context.guild.id, shard: context.guild.shard },
                    message: context?.messageController,
                    guildDB: context.guildDB,
                    dj: context.author.id
                }, player, audioNode);
                // Core Settings for player
                player.setVolume(context.guildDB.defaultVolume / 100);
                context.successMessage(`Successfully created the player and joined <#${context.member.voiceState.channelID || ""}>!\n\n🆕 You can now manage the music easily from the [Dashboard](https://dash.green-bot.app/app/${context.guild.id})`);
                context.guildDB.auto_autoplay && (dispatcher.repeat = "autoplay");
                this.set(context.guild.id, dispatcher);
                if (this._waiting.find((i) => i.serverId === context.guild.id)) {
                    this._waiting
                        .filter((i) => i.serverId === context.guild.id)
                        .forEach((i) => {
                        this.client.queue.emitOp({ changes: ["PLAYER_READY"], socketId: i.id, serverId: context.guild.id, queueData: {} }), this.removeWaiting(i.id);
                    });
                }
                return dispatcher;
            }
            if (context.guild.creating) {
                context.errorMessage("The queue is creating please wait....");
                return false;
            }
            context.guild.creating = true;
            let errored = false;
            if (this.client.shoukaku.players.get(context.guild.id))
                return (context.errorMessage("It seems that another player is already created or creating!"), null);
            if (!context.member.voiceState.channelID)
                return;
            const player = await audioNode.joinChannel({
                guildId: context.guild.id,
                shardId: context.guild.shard.id,
                channelId: context.member.voiceState.channelID,
                deaf: true
            })
                .catch((err) => {
                console.log(err);
                if (this.client.shoukaku.players.get(context.guild.id))
                    this.client.shoukaku.players.delete(context.guild.id);
                console.log({
                    guildId: context.guild.id,
                    shardId: context.guild.shard.id,
                    channelId: context.member.voiceState.channelID,
                    deaf: true
                });
                errored = true;
                context.guild.creating = false;
            });
            if (errored || !player)
                return null;
            context.guild.creating = false;
            const channel = await context.getVoiceChannel();
            channel &&
                13 === channel.type &&
                this.client.editGuildVoiceState(context.guild.id, { suppress: false, channelID: channel.id });
            let textChannelId = context.channel.id;
            context.guildDB.textchannel && context.guild.channels.get(context.guildDB.textchannel) && (textChannelId = context.guildDB.textchannel);
            const dispatcher = new ExtendedDispatcher_1.ExtendedDispatcher(this.client, {
                channelId: textChannelId,
                guild: { name: context.guild.name, iconURL: context.guild.iconURL, id: context.guild.id, shard: context.guild.shard },
                message: context?.messageController,
                guildDB: context.guildDB,
                dj: context.author.id
            }, player, audioNode);
            // Core Settings for player
            player.setVolume(context.guildDB.defaultVolume / 100);
            context.successMessage(`Successfully created the player and joined <#${context.member.voiceState.channelID || ""}>!\n\n🆕 You can now manage the music easily from the [Dashboard](https://dash.green-bot.app/app/${context.guild.id})`);
            context.guildDB.auto_autoplay && (dispatcher.repeat = "autoplay");
            this.set(context.guild.id, dispatcher);
            if (this._waiting.find((i) => i.serverId === context.guild.id)) {
                this._waiting
                    .filter((i) => i.serverId === context.guild.id)
                    .forEach((i) => {
                    this.client.queue.emitOp({ changes: ["PLAYER_READY"], socketId: i.id, serverId: context.guild.id, queueData: {} }), this.removeWaiting(i.id);
                });
            }
            return dispatcher;
        }
    }
    getPlayer(guildId) {
        return this.get(guildId);
    }
}
exports.QueueManager = QueueManager;
