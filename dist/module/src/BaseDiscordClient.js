"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BaseDiscordClient = void 0;
const tslib_1 = require("tslib");
const Eris = tslib_1.__importStar(require("eris"));
const dblapi_js_1 = tslib_1.__importDefault(require("dblapi.js"));
const ShoukakuHandler_1 = require("./modules/ShoukakuHandler");
const Queue_1 = require("./modules/Queue");
const EventHandler_1 = require("./modules/EventHandler");
const spotify_1 = require("@tuneorg/spotify");
const CommandHandler_1 = require("./modules/CommandHandler");
const DatabaseManager_1 = require("./modules/DatabaseManager");
const BaseListener_1 = require("./abstract/BaseListener");
const CommandService_1 = require("./modules/CommandService");
const voiceService_1 = require("./modules/voiceService");
const buttonHandler_1 = require("./modules/buttonHandler");
const Collector_1 = require("./modules/Collector");
const sweeperManager_1 = require("./modules/sweeperManager");
const Cluster = require("discord-hybrid-sharding");
class BaseDiscordClient extends Eris.Client {
    location;
    commands;
    commandManager;
    database;
    config;
    collectors;
    cluster;
    voiceHandler;
    shoukaku;
    dbl;
    events;
    server;
    sweepers;
    spotify;
    slashManager;
    queue;
    constructor(options) {
        // Passing options for the eris client
        super(options.token, {
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
        this.shoukaku = new ShoukakuHandler_1.ShoukakuHandler(this);
        this.location = process.cwd();
        this.spotify = new spotify_1.Spotify(options.spotify);
        this.dbl = new dblapi_js_1.default(options.dbl, this);
        this.cluster = new Cluster.Client(this);
        this.collectors = new Collector_1.CollectorManager();
        // Command/Slash Manager //
        this.commands = new CommandHandler_1.CommandLoader(this);
        this.commandManager = new CommandService_1.CommandManager(this);
        this.slashManager = new buttonHandler_1.SlashManager(this);
        // Listenners for events //
        this.voiceHandler = new voiceService_1.voiceService(this);
        this.on("voiceChannelJoin", (member, newChannel) => this.voiceHandler.handle("join", member, newChannel));
        this.on("voiceChannelLeave", (member, oldChannel) => this.voiceHandler.handle("leave", member, oldChannel));
        this.on("voiceChannelSwitch", (member, newChannel, oldChannel) => this.voiceHandler.handle("switch", member, newChannel, oldChannel));
        this.on("messageCreate", m => this.commandManager.handle(m));
        this.on("interactionCreate", i => this.slashManager.handle(i));
        this.on("error", (err) => {
            if (err.toString().includes("Connection reset by peer"))
                return;
            console.log(err);
        });
        // Database //
        this.database = new DatabaseManager_1.DatabaseManager(this);
        // Shoukaku ( For music )
        this.queue = new Queue_1.QueueManager(this);
        // Events
        this.events = new EventHandler_1.EventHandler(this);
        if (this.cluster.maintenance)
            console.log("[Maitainance Mode] Cluster is in maitainance");
        this.sweepers = new sweeperManager_1.sweeperManager(this, {
            sweep: ["client", "emojis", "guildCategories", "stickers", "useless", "guildMembers"],
            timeout: 1000 * 60 * 60 * 10,
            changeStatus: "*help | green-bot.app"
        });
    }
    listenners(debug) {
        const _list = debug ? ["multipleResolves", "uncaughtException", "uncaughtExceptionMonitor", "unhandledRejection", "warning"] : ["uncaughtException", "uncaughtExceptionMonitor", "unhandledRejection"];
        _list.forEach((event) => {
            process.on(event, new BaseListener_1.BaseError(event).handler);
        });
        return Promise;
    }
    hasBotPerm(context, perm, channelVoice) {
        if (context.me.permissions.has("administrator"))
            return true;
        const channel = channelVoice || context.channel;
        let hasPerm = false;
        if (perm === "voiceConnect" && !this.hasBotPerm(context, "viewChannel", channelVoice))
            return false;
        const owerwrites = channel.permissionOverwrites.filter(ow => ow.id === this.user.id || context.me.roles.includes(ow.id));
        if (!owerwrites.length && perm !== "viewChannel" && context.me.permissions.has(perm))
            return true;
        if (!owerwrites.length && channel.permissionsOf(context.me).has(perm))
            return true;
        owerwrites.forEach(owerwrite => {
            if (hasPerm === true || hasPerm === false)
                return;
            const data = owerwrite.json;
            if (data[perm] === undefined)
                return;
            if (data[perm] === true)
                return hasPerm = true;
            if (data[perm] === false)
                return hasPerm = false;
        });
        if (!hasPerm && context.me.permissions.has(perm))
            return true;
        if (!hasPerm && channel.permissionsOf(context.me).has(perm))
            return true;
        return hasPerm;
    }
    async init() {
        await this.connect();
        await this.database.connect();
    }
}
exports.BaseDiscordClient = BaseDiscordClient;
