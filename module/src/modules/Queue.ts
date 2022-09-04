
import fetch from "node-fetch";
import { ExtendedDispatcher } from "./ExtendedDispatcher";
import { BaseDiscordClient } from "../BaseDiscordClient";
import { Context } from "./Context";
import { Node } from "shoukaku";
import { data } from "discord-hybrid-sharding";
import { TextVoiceChannel } from "eris";

// The interface of the socket of a connected using in the dahboard
class socketData {
    id: string;
    serverId: string;
    userId: string;
    channelId?: string;

    constructor(opt) {
        this.id = opt.id;
        this.serverId = opt.serverId;
        this.channelId = opt.channelId;
        this.userId = opt.userId
    }
}

// For sending data to the websocket of the dashboard
class emitData {
    serverId: string;
    changes: Array<"VOICE_UPDATE" | "RECENT_SONGS" | "LEFT_VC" | "NEXT_SONGS" | "CURRENT_SONG" | "DESTROY" | "BOT_JOIN_VC">;
    queueData: object;
    userId?:string;
    socketId?: string;
}

export class QueueManager extends Map {
    client: BaseDiscordClient
    _sockets: Array<socketData>;
    users: Array<socketData>;
    dashURL: string;
    constructor(client: BaseDiscordClient) {
        super();
        this.client = client;
        this._sockets = [];
        this.users = [];
        this.dashURL = "https://dash.green-bot.app/api/socket";
    }

    async addWaiting(socket: socketData) {
        return this._sockets.find((sk) => sk.id === socket.id) || this._sockets.push(socket)
    }
    async addWaitingUser(serverId: string, socketId: string, userId: string) {
        let data = new socketData({ serverId: serverId, userId: userId, id: socketId })
        this.users.find(u => u.id === data.id) || this.users.push(data)
        return true;
    }
    async cleanSocket(socketId: string) {
        this._sockets.find((sk) => sk.id === socketId) && (this._sockets = this._sockets.filter((sk) => sk.id !== socketId));
        this.users.find((sk) => sk.id === socketId) && (this.users = this.users.filter((sk) => sk.id !== socketId));
        return true;

    }
    async cleanSockets(servId: string) {
        (this._sockets = this._sockets.filter((sk) => sk.serverId !== servId));

        return true;

    }
    async emitOp(data: emitData) {
        if(!this._sockets.find(sk=>sk.serverId === data.serverId)) return;
        const fetched = await fetch(this.dashURL, { method: "post", body: JSON.stringify(data), headers: { "Content-Type": "application/json" } });
        if (!fetched || !fetched.ok) return console.log("Something when wrong while sending an op");
        let result = await fetched.json();
        return result.outdated ? (this.cleanSockets(data.serverId), console.log("[Ghot socket] A socket has been just killed"), false) : true;
    }
    async create(context: Context | any, audioNode: Node) {

        let queueData = this.get(context.guild.id);
        if (!context.member.voiceState.channelID) return (context.errorMessage("You need to be in a voice channel to use this command"), null)
        if (queueData) {
            if(queueData && context.me.voiceState.channelID)
            if (queueData && context.me.voiceState.channelID) return queueData;
            let k = this.client.shoukaku.players.get(context.guild.id)
            if (k) k.connection.disconnect()
            let errored: Boolean = false;
            const node = this.client.shoukaku.getNode();
            if (node == undefined) return console.log("bro no node");
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
            if (errored || !player) {
                context.guild.creating = false;

                return null;
            }
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
                        guild: { name: context.guild.name, iconURL: context.guild.iconURL, id: context.guild.id },
                        message: context?.messageController,
                        guildDB: context.guildDB,
                        dj: this.client.user.id
                    },
                    player,
                    audioNode
                );

                // Core Settings for player
                player.setVolume(context.guildDB.defaultVolume / 100)
                context.guildDB.auto_autoplay && (dispatcher.repeat = "autoplay")
                this.set(context.guild.id, dispatcher)
                const channel: TextVoiceChannel = await context.getVoiceChannel()

                channel &&
                13 === channel.type &&
                this.client.editGuildVoiceState(context.guild.id, { suppress: false, channelID: dispatcher.player.connection.channelId})
                if (this._sockets.find((i) => i.serverId === context.guild.id)) {
                    this.client.queue.emitOp({ changes: ["BOT_JOIN_VC"], serverId: context.guild.id, queueData: { channelId: context.member.voiceState.channelID } })
                }
                return dispatcher;
            }
            if (this.client.shoukaku.players.get(context.guild.id)) return (context.errorMessage("It seems that another player is already created or creating!"), null)
            if (!context.member.voiceState.channelID) return;
            if (context.guild.creating) {
                context.errorMessage("The queue is creating please wait....")
                return false
            }
            context.guild.creating = true;
            let errored: Boolean = false;

            const channel: TextVoiceChannel = await context.getVoiceChannel()
            const player: any = await audioNode.joinChannel({
                guildId: context.guild.id,
                shardId: context.guild.shard.id,
                channelId: channel.id,
                deaf: true
            })
                .catch((err) => {
                    console.log(err);
                    context.guild.creating = false;

                    if (this.client.shoukaku.players.get(context.guild.id)) this.client.shoukaku.players.delete(context.guild.id)
                    console.log({
                        guildId: context.guild.id,
                        shardId: context.guild.shard.id,
                        channelId: context.member.voiceState.channelID,
                        deaf: true
                    })
                    errored = true;
                });
            if (errored || !player) {
                context.guild.creating = false;

                return null;
            }
            context.guild.creating = false;
            channel &&
                13 === channel.type &&
                this.client.editGuildVoiceState(context.guild.id, { suppress: false, channelID: channel.id })
            let textChannelId = context.channel.id;
            context.guildDB.textchannel && context.guild.channels.get(context.guildDB.textchannel) && (textChannelId = context.guildDB.textchannel);

            const dispatcher = new ExtendedDispatcher(
                this.client,
                {
                    channelId: textChannelId,
                    guild: { name: context.guild.name, iconURL: context.guild.iconURL, id: context.guild.id },
                    message: context?.messageController,
                    guildDB: context.guildDB,
                    dj: this.client.user.id
                },
                player,
                audioNode
            );

            // Core Settings for player
            player.setVolume(context.guildDB.defaultVolume / 100)
            context.guildDB.auto_autoplay && (dispatcher.repeat = "autoplay")
            this.set(context.guild.id, dispatcher)
            if (this._sockets.find((i) => i.serverId === context.guild.id)) {
                this.client.queue.emitOp({ changes: ["BOT_JOIN_VC"], serverId: context.guild.id, queueData: { botId: context.member.voiceState.channelID } })
            }
            return dispatcher;
        }
    }

    getPlayer(guildId: string) {
        return this.get(guildId)
    }
}

