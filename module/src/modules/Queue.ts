
import fetch from "node-fetch";
import { ExtendedDispatcher } from "./ExtendedDispatcher";
import { BaseDiscordClient } from "../BaseDiscordClient";
import { Context } from "./Context";
import { Node } from "shoukaku";
import { data } from "discord-hybrid-sharding";

// The interface of the socket of a connected using in the dahboard
class socketData {
    id: string;
    serverId: string;
    userId: string;

    constructor(opt) {
        this.id = opt.id;
        this.serverId = opt.serverId;
        this.userId = opt.userId
    }
}

// For sending data to the websocket of the dashboard
class emitData {
    serverId: string;
    socketId: string;
    changes: Array<"JOINED_VC" | "RECENT_SONGS" | "LEFT_VC" | "NEXT_SONGS" | "CURRENT_SONG" | "DESTROY" | "PLAYER_READY">;
    queueData: object;
}

export class QueueManager extends Map {
    client: BaseDiscordClient
    _sockets: Array<socketData>;
    _waiting: Array<socketData>;
    inVoice: Array<socketData>;
    waitingConnect: Array<socketData>;
    dashURL: string;
    constructor(client: BaseDiscordClient) {
        super();
        this.client = client;
        this._sockets = [];
        this._waiting = [];
        this.inVoice = [];
        this.waitingConnect = [];
        this.dashURL = "https://dash.green-bot.app/api/socket";
    }

    async addWaiting(socket: socketData) {
        return this._sockets.find((sk) => sk.id === socket.id) || this._sockets.push(socket), this._waiting.find((sk) => sk.id === socket.id) || this._waiting.push(socket);
    }
    async addWaitingUser(serverId: string, socketId: string, userId: string, isInVoice: string | Boolean) {
        let data = new socketData({ serverId: serverId, userId: userId, id: socketId })
        if ("true" === isInVoice) {
            this.inVoice.find((sk) => sk.id === socketId) || this.inVoice.push(data)
        } else {
            this.waitingConnect.find((sk) => sk.id === socketId) || this.waitingConnect.push(data)
        }
        return true;
    }
    async removeWaitingUser(socketId: string) {
        this._waiting.find((sk) => sk.id === socketId) && (this._waiting = this._waiting.filter((sk) => sk.id !== socketId));
        return true;
    }
    async removeWaiting(socketId: string) {
        this.waitingConnect.find((sk) => sk.id === socketId) && (this.waitingConnect = this.waitingConnect.filter((sk) => sk.id !== socketId));
        return true;
    }
    async cleanSocket(socketId: string) {
        this._sockets.find((sk) => sk.id === socketId) && (this._sockets = this._sockets.filter((sk) => sk.id !== socketId));
        this._waiting.find((sk) => sk.id === socketId) && (this._waiting = this._waiting.filter((sk) => sk.id !== socketId));
        this.inVoice.find((sk) => sk.id === socketId) && (this.inVoice = this.inVoice.filter((sk) => sk.id !== socketId));
        this.waitingConnect.find((sk) => sk.id === socketId) && (this.waitingConnect = this.waitingConnect.filter((sk) => sk.id !== socketId));
        return true;

    }
    async emitOp(data: emitData) {
        const fetched = await fetch(this.dashURL, { method: "post", body: JSON.stringify(data), headers: { "Content-Type": "application/json" } });
        if (!fetched || !fetched.ok) return console.log("Something when wrong while sending an op");
        let result = await fetched.json();
        return result.outdated ? (this.cleanSocket(data.socketId), console.log("[Ghot socket] A socket has been just killed"), false) : true;
    }
    async create(context: Context | any, audioNode: Node) {

        let queueData = this.get(context.guild.id);
        if (!context.member.voiceState.channelID) return (context.errorMessage("You need to be in a voice channel to use this command"), null)
        if (queueData) {
            if (queueData && context.me.voiceState.channelID) return queueData;
            let k = this.client.shoukaku.players.get(context.guild.id)
            if(k) k.connection.disconnect()
            let errored: Boolean = false;
            const node = this.client.shoukaku.getNode()
            const player = await node.joinChannel({
                guildId: context.guild.id,
                shardId: context.guild.shard.id,
                channelId: context.member.voiceState.channelID,
                deaf: true
            })
                .catch((err) => {
                    console.log(err)
                    errored = true;
                    context.guild.creating = false;
                    queueData.player.connection.disconnect()
                    queueData.delete();
                    context.errorMessage("The player has been destroyed. Please do the command again")
                });
            if (errored || !player) return console.log("still not joining vc");
            queueData.player = player;
            return queueData;
        } else {
            if (this.client.shoukaku.players.get(context.guild.id)) {
                let player = this.client.shoukaku.players.get(context.guild.id)

                let textChannelId = context.channel.id;
                context.guildDB.textchannel && context.guild.channels.get(context.guildDB.textchannel) && (textChannelId = context.guildDB.textchannel);

                const dispatcher = new ExtendedDispatcher(
                    this.client,
                    {
                        channelId: textChannelId,
                        guild: { name: context.guild.name, iconURL: context.guild.iconURL, id: context.guild.id, shard: context.guild.shard },
                        message: context?.messageController,
                        guildDB: context.guildDB,
                        dj: context.author.id
                    },
                    player,
                    audioNode
                );

                // Core Settings for player
                    player.setVolume(context.guildDB.defaultVolume / 100)
                context.successMessage(`Successfully created the player and joined <#${context.member.voiceState.channelID || ""}>!\n\n🆕 You can now manage the music easily from the [Dashboard](https://dash.green-bot.app/app/${context.guild.id})`)
                context.guildDB.auto_autoplay && (dispatcher.repeat = "autoplay")
                this.set(context.guild.id, dispatcher)
                if (this._waiting.find((i) => i.serverId === context.guild.id)) {
                    this._waiting
                        .filter((i) => i.serverId === context.guild.id)
                        .forEach((i) => {
                            this.client.queue.emitOp({ changes: ["PLAYER_READY"], socketId: i.id, serverId: context.guild.id, queueData: {} }), this.removeWaiting(i.id);
                        })
                }
                return dispatcher;
            }
            if (context.guild.creating) {
                context.errorMessage("The queue is creating please wait....")
                return false
            }
            context.guild.creating = true;
            let errored: Boolean = false;
            if (this.client.shoukaku.players.get(context.guild.id)) return (context.errorMessage("It seems that another player is already created or creating!"), null)
            if (!context.member.voiceState.channelID) return;
            const player: any = await audioNode.joinChannel({
                guildId: context.guild.id,
                shardId: context.guild.shard.id,
                channelId: context.member.voiceState.channelID,
                deaf: true
            })
                .catch((err) => {
                    console.log(err);
                    if (this.client.shoukaku.players.get(context.guild.id)) this.client.shoukaku.players.delete(context.guild.id)
                    console.log({
                        guildId: context.guild.id,
                        shardId: context.guild.shard.id,
                        channelId: context.member.voiceState.channelID,
                        deaf: true
                    })
                    errored = true;
                    context.guild.creating = false;
                });
            if (errored || !player) return null;
            context.guild.creating = false;
            const channel = await context.getVoiceChannel()
            channel &&
                13 === channel.type &&
                this.client.editGuildVoiceState(context.guild.id, { suppress: false, channelID: channel.id })
            let textChannelId = context.channel.id;
            context.guildDB.textchannel && context.guild.channels.get(context.guildDB.textchannel) && (textChannelId = context.guildDB.textchannel);

            const dispatcher = new ExtendedDispatcher(
                this.client,
                {
                    channelId: textChannelId,
                    guild: { name: context.guild.name, iconURL: context.guild.iconURL, id: context.guild.id,shard: context.guild.shard },
                    message: context?.messageController,
                    guildDB: context.guildDB,
                    dj: context.author.id
                },
                player,
                audioNode
            );

            // Core Settings for player
            player.setVolume(context.guildDB.defaultVolume / 100)
            context.successMessage(`Successfully created the player and joined <#${context.member.voiceState.channelID || ""}>!\n\n🆕 You can now manage the music easily from the [Dashboard](https://dash.green-bot.app/app/${context.guild.id})`)
            context.guildDB.auto_autoplay && (dispatcher.repeat = "autoplay")
            this.set(context.guild.id, dispatcher)
            if (this._waiting.find((i) => i.serverId === context.guild.id)) {
                this._waiting
                    .filter((i) => i.serverId === context.guild.id)
                    .forEach((i) => {
                        this.client.queue.emitOp({ changes: ["PLAYER_READY"], socketId: i.id, serverId: context.guild.id, queueData: {} }), this.removeWaiting(i.id);
                    })
            }
            return dispatcher;
        }
    }

    getPlayer(guildId: string) {
        return this.get(guildId)
    }
}

