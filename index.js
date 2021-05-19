if(Number(process.version.slice(1).split(".")[0]) < 12) throw new Error("La version de Node.js est inférieure à la 12.0.0. Veuillez vous mettre en v12.0.0 ou plus.");

const fs = require('fs');
const Discord = require('discord.js');
const { Database } = require('quickmongo');
const config = require('./config.json');
const footer = config.footer;
const intents = new Discord.Intents();
intents.add(
    'GUILD_MEMBERS',
    'GUILDS',
    'GUILD_VOICE_STATES',
    'GUILD_MESSAGES',
    'GUILD_MESSAGE_REACTIONS',
    'GUILD_BANS',
    'GUILD_INVITES',
    'GUILD_EMOJIS',
    'GUILD_VOICE_STATES',
);
const client = new Discord.Client({
    fetchAllMembers: true,
    autoReconnect: true,
    partials: ['MESSAGE', 'CHANNEL', 'GUILD_MEMBER', 'REACTION', 'GUILD_VOICE_STATES'],
    intents: intents,
});
let Temps = require('./database/models/Temps')
const TempChannels = require("discord-temp-channels");
const tempChannels = new TempChannels(client);
client.tempChannels = tempChannels;
const util = require("util");
const readdir = util.promisify(fs.readdir);
const guildInvites = new Map();
const mongoose = require('mongoose')
const { GiveawaysManager } = require("discord-giveaways");
const { Player } = require('discord-player');
const player = new Player(client, {
    leaveOnEnd: true,
    leaveOnStop: true,
    leaveOnEmpty: true,
    timeout: 0,
    volume: 70,
    quality: 'high',
});
client.player = player;
const db = new Database(config.MongoURL);
client.db = db;
const AutoPoster = require('topgg-autoposter')
const discordTTS = require("discord-tts");

const dbTemps = require("quick.db");
client.dbTemps = dbTemps;
const Voice = require("discord-voice");


client.on("ready", async() => {
     const soice = new vvoice(client, config.MongoURL);
    client.discordVoice = soice;
    if ((await db.get('giveaways')) === null) await db.set('giveaways', []);
    console.log('quicmongo is lready');
    let findTemps = await Temps.find({})
    findTemps.forEach((channelData) => {
        tempChannels.registerChannel(channelData.channelID, {
            childCategory: channelData.categoryID,
            childAutoDeleteIfEmpty: true,
            childAutoDeleteIfOwnerLeaves: true,
            childMaxUsers: channelData.size,
            childBitrate: 64000,
            childFormat: (member, count) => `#${count} | Salon de ${member.user.username}`
        });
    });
});
const ap = AutoPoster(config.topgg, client)

ap.on('posted', () => {
    console.log('Posted stats to Top.gg!')
})
class GiveawayManagerWithOwnDatabase extends GiveawaysManager {
    async getAllGiveaways() {
        return await db.get('giveaways');
    }

    async saveGiveaway(messageID, giveawayData) {
        await db.push('giveaways', giveawayData);
        return true;
    }

    async editGiveaway(messageID, giveawayData) {
        const giveaways = await db.get('giveaways');
        const newGiveawaysArray = giveaways.filter((giveaway) => giveaway.messageID !== messageID);
        newGiveawaysArray.push(giveawayData);
        await db.set('giveaways', newGiveawaysArray);
        return true;
    }

    async deleteGiveaway(messageID) {
        const data = await db.get('giveaways');
        const newGiveawaysArray = data.filter((giveaway) => giveaway.messageID !== messageID);
        await db.set('giveaways', newGiveawaysArray);
        return true;
    }
}

const manager = new GiveawayManagerWithOwnDatabase(client, {
    storage: false,
    updateCountdownEvery: 10000,
    default: {
        botsCanWin: false,
        exemptPermissions: [],
        embedColorEnd: '#4FEA2D',
        embedColor: "#D6EA2D",
        reaction: '🎁'
    }
});

client.manager = manager;

client.commands = new Discord.Collection();
client.guildInvites = guildInvites;
client.footer = footer;

client.owner = config.ownerID;
client.color = config.color;

mongoose.connect(config.MongoURL, { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false }).then(() => {
    console.log("Connécté à la base de données MongoDB");
}).catch((err) => {
    console.log("Je n'ai pas réussi à me connecter à la base de données mongoDB. Erreur:" + err);
});


const init = async() => {
    const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));
    const directories = await readdir("./commands/");
    console.log(`Loading a total of ${directories.length} categories.`);
    directories.forEach(async(dir) => {
        const commands = await readdir("./commands/" + dir + "/");
        commands.filter((cmd) => cmd.split(".").pop() === "js").forEach((cmd) => {
            const command = require(`./commands/${dir}/${cmd}`);

            client.commands.set(command.name, command);
        });
    });
    const evtFiles = await readdir("./events/");
    console.log(`Loading a total of ${evtFiles.length} events.`);
    evtFiles.forEach((file) => {
        const eventName = file.split(".")[0];
        console.log(`Loading Event: ${eventName}`);
        const event = require(`./events/${file}`);
        client.on(eventName, (...args) => event.execute(...args, client));
        delete require.cache[require.resolve(`./events/${file}`)];
    });
    const GFiles = await readdir("./giveaways-events/");
    console.log(`Loading a total of ${GFiles.length} events.`);
    GFiles.forEach((file) => {
        const eventName = file.split(".")[0];
        console.log(`Loading giveaways Event: ${eventName}`);
        const event = require(`./giveaways-events/${file}`);
        client.manager.on(eventName, (...args) => event.execute(...args, client));
        delete require.cache[require.resolve(`./giveaways-events/${file}`)];
    });
    fs.readdir('./player-events/', (err, files) => {
        if (err) return console.error(err);
        files.forEach(file => {
            const event = require(`./player-events/${file}`);
            let eventName = file.split(".")[0];
            console.log(`Loading player event ${eventName}`);
            client.player.on(eventName, event.bind(null, client));
        });
    });
};
init();


client.login(config.token);
