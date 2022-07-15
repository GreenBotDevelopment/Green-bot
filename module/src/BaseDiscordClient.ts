import * as Eris from "eris";
import dbl from "dblapi.js";
import { ShoukakuHandler } from "./modules/ShoukakuHandler";
import { QueueManager } from "./modules/Queue";
import { EventHandler } from "./modules/EventHandler";
import { Spotify } from "@tuneorg/spotify";
import { CommandLoader } from "./modules/CommandHandler";
import { DatabaseManager } from "./modules/DatabaseManager";
import { BaseError } from "./abstract/BaseListener";
import { Server } from "./modules/server";
import { CommandManager } from "./modules/CommandService";
import { voiceService } from "./modules/voiceService";
import { Client } from "discord-hybrid-sharding";
import { SlashManager } from "./modules/buttonHandler";
import { CollectorManager } from "./modules/Collector";
import { sweeperManager } from "./modules/sweeperManager";
import { Context } from "./modules/Context";
import { SlashContext } from "./modules/SlashContext";
const Cluster = require("discord-hybrid-sharding");


export class BaseDiscordClient extends Eris.Client {
    location: string;
    commands: CommandLoader;
    commandManager: CommandManager;
    database: DatabaseManager;
    config: any;
    collectors: CollectorManager;
    cluster: Client;
    voiceHandler: voiceService;
    shoukaku: ShoukakuHandler;
    dbl: dbl;
    events: EventHandler;
    server?: Server;
    sweepers: sweeperManager;
    spotify: Spotify;
    slashManager: SlashManager;
    queue: QueueManager;
    constructor(options: any) {

        // Passing options for the eris client
        super(options.token,
            {
                firstShardID: Cluster.data.FIRST_SHARD_ID,
                lastShardID: Cluster.data.LAST_SHARD_ID,
                maxShards: Cluster.data.TOTAL_SHARDS,
                restMode: true,
                largeThreshold: 1000000,
                guildCreateTimeout: 1000,
                allowedMentions: { everyone: false, roles: false, users: false },
                autoreconnect: true,
                intents: ["guilds", "guildVoiceStates", "guildMessages"],
                connectionTimeout: 40000,
                maxResumeAttempts: 40,
                messageLimit: 0,
                disableEvents: {
                    "TYPING_START": true,
                    "USER_NOTE_UPDATE": true,
                    "CHANNEL_PINS_UPDATE": true,
                    "MESSAGE_UPDATE": true,
                    "RELATIONSHIP_ADD": true,
                    "RELATIONSHIP_REMOVE": true,
                    "GUILD_UPDATE": true,
                    "CHANNEL_CREATE": true,
                    "CHANNEL_UPDATE": true,
                    "CHANNEL_DELETE": true,
                    "CHANNEL_OVERWRITE_CREATE": true,
                    "CHANNEL_OVERWRITE_UPDATE": true,
                    "CHANNEL_OVERWRITE_DELETE": true,
                    "MEMBER_KICK": true,
                    "MEMBER_PRUNE": true,
                    "MEMBER_BAN_ADD": true,
                    "MEMBER_BAN_REMOVE": true,
                    "MEMBER_UPDATE": true,
                    "MEMBER_ROLE_UPDATE": true,
                    "BOT_ADD	": true,
                    "ROLE_CREATE": true,
                    "ROLE_UPDATE": true,
                    "ROLE_DELETE": true,
                    "INVITE_CREATE": true,
                    "INVITE_UPDATE	": true,
                    "INVITE_DELETE	": true,
                    "WEBHOOK_CREATE": true,
                    "WEBHOOK_UPDATE": true,
                    "WEBHOOK_DELETE": true,
                    "EMOJI_CREATE": true,
                    "EMOJI_UPDATE": true,
                    "EMOJI_DELETE": true,
                    "MESSAGE_DELETE": true,
                    "MESSAGE_BULK_DELETE": true,
                    "MESSAGE_PIN": true,
                    "MESSAGE_UNPIN": true,
                    "INTEGRATION_CREATE": true,
                    "INTEGRATION_UPDATE": true,
                    "INTEGRATION_DELETE": true,
                    "STAGE_INSTANCE_CREATE": true,
                    "STAGE_INSTANCE_UPDATE": true,
                    "STAGE_INSTANCE_DELETE": true,
                    "STICKER_CREATE": true,
                    "STICKER_UPDATE": true,
                    "STICKER_DELETE": true,
                    "GUILD_SCHEDULED_EVENT_CREATE": true,
                    "GUILD_SCHEDULED_EVENT_UPDATE": true,
                    "GUILD_SCHEDULED_EVENT_DELETE": true,
                    "THREAD_CREATE": true,
                    "THREAD_UPDATE": true,
                    "THREAD_DELETE": true,
                    "APPLICATION_COMMAND_PERMISSION_UPDATE": true,
                },
            });

        // Core Things //
        this.config = options;
        this.shoukaku = new ShoukakuHandler(this);
        this.location = process.cwd();
        this.spotify = new Spotify(options.spotify);
        this.dbl = new dbl(options.dbl, this);
        this.cluster = new Cluster.Client(this);
        this.collectors = new CollectorManager();


        // Command/Slash Manager //
        this.commands = new CommandLoader(this);
        this.commandManager = new CommandManager(this);
        this.slashManager = new SlashManager(this);

        // Listenners for events //
        this.voiceHandler = new voiceService(this);
        this.on("voiceChannelJoin", (member, newChannel) => this.voiceHandler.handle("join", member, newChannel));
        this.on("voiceChannelLeave", (member, oldChannel) => this.voiceHandler.handle("leave", member, oldChannel));
        this.on("voiceChannelSwitch", (member, newChannel, oldChannel) => this.voiceHandler.handle("switch", member, newChannel, oldChannel));

        this.on("messageCreate", m => this.commandManager.handle(m));
        this.on("interactionCreate", i => this.slashManager.handle(i))
        this.on("error", (err) => {
            if (err.toString().includes("Connection reset by peer")) return
            console.log(err)
        })

        // Database //
        this.database = new DatabaseManager(this);

        // Shoukaku ( For music )
        this.queue = new QueueManager(this);
        // Events
        this.events = new EventHandler(this);

        if (this.cluster.maintenance) console.log("[Maitainance Mode] Cluster is in maitainance")

        this.sweepers = new sweeperManager(this, {
            sweep: ["client", "emojis", "guildCategories", "stickers", "useless", "guildMembers"],
            timeout: 1000 * 60 * 60 * 10,
            changeStatus: "*help | green-bot.app"
        })
    }
    listenners(debug: boolean) {
        let _list = debug ? ["multipleResolves", "uncaughtException", "uncaughtExceptionMonitor", "unhandledRejection", "warning"] : ["uncaughtException", "uncaughtExceptionMonitor", "unhandledRejection"];
        _list.forEach((event) => {
            process.on(event, new BaseError(event).handler)
        })
        return Promise;
    }

    hasBotPerm(context: Context | SlashContext, perm: any, channelVoice?: Eris.TextVoiceChannel) {
        if (context.me.permissions.has("administrator")) return true;
        let channel = channelVoice || context.channel;
        let hasPerm = false;
        if (perm === "voiceConnect" && !this.hasBotPerm(context, "viewChannel", channelVoice)) return false
        const owerwrites = channel.permissionOverwrites.filter(ow => ow.id === this.user.id || context.me.roles.includes(ow.id))
        if (!owerwrites.length && perm !== "viewChannel" && context.me.permissions.has(perm)) return true
        if (!owerwrites.length && channel.permissionsOf(context.me).has(perm)) return true
        owerwrites.forEach(owerwrite => {
            if (hasPerm === true || hasPerm === false) return;
            const data = owerwrite.json
            if (data[perm] === undefined) return
            if (data[perm] === true) return hasPerm = true;
            if (data[perm] === false) return hasPerm = false;
        })

        if (!hasPerm && context.me.permissions.has(perm)) return true
        if (!hasPerm && channel.permissionsOf(context.me).has(perm)) return true

        return hasPerm;
    }




    async init() {
        await this.connect();
        await this.database.connect();
    }
}

