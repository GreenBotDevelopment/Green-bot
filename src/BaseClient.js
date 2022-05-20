const { Client: Client, Intents: Intents } = require("discord.js"),
    { GUILDS: GUILDS, GUILD_VOICE_STATES: GUILD_VOICE_STATES, GUILD_MESSAGES: GUILD_MESSAGES } = Intents.FLAGS,
    dbl = require("dblapi.js"),
    ShoukakuHandler = require("./modules/ShoukakuHandler.js"),
    Queue = require("./modules/Queue.js"),
    EventHandler = require("./modules/EventHandler.js"),
    { Spotify: Spotify } = require("@tuneorg/spotify"),
    CommandHandler = require("./modules/CommandHandler.js"),
    MongoDB = require("./modules/MongoDB"),
    server = require("./modules/server"),
    interactions = require("./modules/InteractionHandler"),
    CommandService = require("./modules/CommandService"),
    VoiceService = require("./modules/voiceService"),
    Cluster = require("discord-hybrid-sharding"),
    buttonHandler = require("./modules/buttonHandler");
class BaseClient extends Client {
    constructor(e) {
        super({ disableMentions: "everyone", restRequestTimeout: 4e4, restTimeOffset: 600, shards: Cluster.data.SHARD_LIST, shardCount: Cluster.data.TOTAL_SHARDS, intents: [GUILDS, GUILD_VOICE_STATES, GUILD_MESSAGES] }),
            (this.location = process.cwd()),
            (this.dbl = new dbl("eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6Ijc4MzcwODA3MzM5MDExMjgzMCIsImJvdCI6dHJ1ZSwiaWF0IjoxNjQ0NTE2ODA5fQ.QXQBGqZQ3MW5S-fhZxoDKKFNT5b_pzN96wQ_UDsGLaE", this)),
            (this.mongoDB = new MongoDB(this)),
            (this.shoukaku = new ShoukakuHandler(this)),
            (this.queue = new Queue(this)),
            (this.spotify = new Spotify({ clientId: "1e9c2ae3711b48b4a4c857ee73fc569f", clientSecret: "743b7c2b874546dabfda5855dc099b8c", cacheResults: !0, cacheLifetime: 36e5 })),
            (this.commmands = new CommandHandler(this).build()),
            new EventHandler(this).build(),
            new buttonHandler(this).build(),
            (this.interactions = new interactions(this).build()),
            this.mongoDB.connect(),
            (this.cluster = new Cluster.Client(this)),
            (this.cmds = new CommandService(this)),
            (this.voiceService = new VoiceService(this)),
            (this.server = new server(this)),
            this.on("messageCreate", (e) => {
                this.cmds.handle(e);
            }),
            this.on("voiceStateUpdate", (e, i) => {
                this.voiceService.handle(e, i);
            });

            ["multipleResolves", "uncaughtException", "uncaughtExceptionMonitor", "unhandledRejection"].forEach((event) => {
                process.on(event, (e) => {
                    this.error({
                        error: e,
                        location: {
                            type: "PROCESS",
                            file: "BaseClient",
                            event: event
                        }
                    })
                });
            });
            
    }

      /**
     * @description Starts the client.
     * @param {object} options
     * @returns {BaseClient}
     */
       async start(options) {
        if (!options) throw new ClientError("No options provided.");
        this.login(options.token).catch(err => {
            this._ready = false
            console.log(err)
        })
        if (this._ready) return this
        else throw new ClientError("Client can't enter ready do to some errors;")
    }

    /**
     * @description Registers an error
     * @param {objet} options
     * @returns {Boolean}
     */
    async error(options) {
        if (options.error === undefined || options.error === null) throw new ClientError("No error provided.");
        if (options.crash) new ClientError(error);
        console.log(options.error);
        this._errors.push({
            error: options.error,
            date: new Date(),
            location: options.location
        })
        return true
    }
}
module.exports = BaseClient;
