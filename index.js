const fs = require('fs');
const Discord = require('discord.js');
const config = require('./config.json');
const emojis = require('./emojis.json');
if (!config.prefix) return console.error(`ERREUR : Veuillez mettre un préfixe dans le config.json`);
if (!config.token) return console.error(`ERREUR : Veuillez mettre un token dans le config.json`)
const footer = config.footer;

const client = new Discord.Client({
    fetchAllMembers: true,
    autoReconnect: true,
    partials: ['MESSAGE', 'CHANNEL', 'GUILD_MEMBER', 'REACTION']
});
const util = require("util");
const readdir = util.promisify(fs.readdir);
const guildInvites = new Map();
const mongoose = require('mongoose')

const { GiveawaysManager } = require("discord-giveaways");
const manager = new GiveawaysManager(client, {
    storage: "./giveaways.json",
    updateCountdownEvery: 10000,
    default: {
        botsCanWin: false,
        exemptPermissions: [],
        embedColor: "#2f3136",
        reaction: "🎉"
    }
});
const { Player } = require('discord-player');

const player = new Player(client);
client.player = player;
client.manager = manager;
client.manager.on('giveawayReactionAdded', (giveaway, member, reaction) => {
    const succes = new Discord.MessageEmbed()
        .setTitle(`${emojis.succes} Participation acceptée`)
        .setDescription(`Votre participation au giveaway pour **${giveaway.prize}** dans le serveur **${giveaway.message.guild.name}** est acceptée !`)
        .setColor(config.color)
        .setFooter(config.footer)
    member.send(succes)
});
client.commands = new Discord.Collection();
client.guildInvites = guildInvites;
client.footer = footer;

client.owner = config.ownerID;
client.color = config.color;

mongoose.connect(config.MongoURL, { useNewUrlParser: true, useUnifiedTopology: true }).then(() => {
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
};
init();
client.on('message', message => {
    if (message.content === 'l.f') {
        if (!message.member.hasPermission("ADMINISTRATOR"))
            return message.channel.send("<:cancel1:769230483863109632> | **Vous n'avez pas la permission `ADMINISTRATEUR`** !");
        client.emit('guildMemberRemove', message.member);
    }
});
client.login(config.token);
