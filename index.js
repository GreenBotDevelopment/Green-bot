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
        embedColor: "#FF0000",
        reaction: "🎉"
    }
});
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

    for (const file of commandFiles) {
        const command = require(`./commands/${file}`);
        client.commands.set(command.name, command);
    }
    const rrcommands = fs.readdirSync('./commands/rolereaction').filter(file => file.endsWith('.js'));
    for (const rrfile of rrcommands) {
        const command = require(`./commands/rolereaction/${rrfile}`);
        client.commands.set(command.name, command);
    }
    const admincommands = fs.readdirSync('./commands/moderation').filter(file => file.endsWith('.js'));

    for (const afile of admincommands) {
        const command = require(`./commands/moderation/${afile}`);
        client.commands.set(command.name, command);
    }
    const funcommands = fs.readdirSync('./commands/fun').filter(file => file.endsWith('.js'));

    for (const ffile of funcommands) {
        const command = require(`./commands/fun/${ffile}`);
        client.commands.set(command.name, command);
    }
    const utilcommands = fs.readdirSync('./commands/utilities').filter(file => file.endsWith('.js'));

    for (const ufile of utilcommands) {
        const command = require(`./commands/utilities/${ufile}`);
        client.commands.set(command.name, command);
    }
    const pcommands = fs.readdirSync('./commands/pictures').filter(file => file.endsWith('.js'));

    for (const pfile of pcommands) {
        const command = require(`./commands/pictures/${pfile}`);
        client.commands.set(command.name, command);
    }
    const ownercommands = fs.readdirSync('./commands/owner').filter(file => file.endsWith('.js'));

    for (const ofile of ownercommands) {
        const command = require(`./commands/owner/${ofile}`);
        client.commands.set(command.name, command);
    }
    const configcommands = fs.readdirSync('./commands/configuration').filter(file => file.endsWith('.js'));

    for (const cfile of configcommands) {
        const command = require(`./commands/configuration/${cfile}`);
        client.commands.set(command.name, command);
    }
    const levelcommands = fs.readdirSync('./commands/level').filter(file => file.endsWith('.js'));

    for (const lfile of levelcommands) {
        const command = require(`./commands/level/${lfile}`);
        client.commands.set(command.name, command);
    }
    const rpgcommands = fs.readdirSync('./commands/rpg').filter(file => file.endsWith('.js'));

    for (const rgrfile of rpgcommands) {
        const command = require(`./commands/rpg/${rgrfile}`);
        client.commands.set(command.name, command);
    }
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
