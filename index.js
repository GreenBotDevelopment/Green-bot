const fs = require('fs');
const Discord = require('discord.js');
const { Database } = require('quickmongo');
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
const { Player } = require('discord-player');
const player = new Player(client);
client.player = player;
const giveawayModel = require('./database/models/giveaway');
const db = new Database(config.MongoURL);
db.once('ready', async() => {
    if ((await db.get('giveaways')) === null) await db.set('giveaways', []);
    console.log('quicmongo is lready');
});

class GiveawayManagerWithOwnDatabase extends GiveawaysManager {
    // This function is called when the manager needs to get all the giveaway stored in the database.
    async getAllGiveaways() {
        // Get all the giveaway in the database
        return await db.get('giveaways');
    }

    // This function is called when a giveaway needs to be saved in the database (when a giveaway is created or when a giveaway is edited).
    async saveGiveaway(messageID, giveawayData) {
        // Add the new one
        await db.push('giveaways', giveawayData);
        // Don't forget to return something!
        return true;
    }

    async editGiveaway(messageID, giveawayData) {
        // Gets all the current giveaways
        const giveaways = await db.get('giveaways');
        // Remove the old giveaway from the current giveaways ID
        const newGiveawaysArray = giveaways.filter((giveaway) => giveaway.messageID !== messageID);
        // Push the new giveaway to the array
        newGiveawaysArray.push(giveawayData);
        // Save the updated array
        await db.set('giveaways', newGiveawaysArray);
        // Don't forget to return something!
        return true;
    }

    async deleteGiveaway(messageID) {
        // Gets all the current giveaways
        const data = await db.get('giveaways');
        // Remove the giveaway from the array
        const newGiveawaysArray = data.filter((giveaway) => giveaway.messageID !== messageID);
        // Save the updated array
        await db.set('giveaways', newGiveawaysArray);
        // Don't forget to return something!
        return true;
    }
}

const manager = new GiveawayManagerWithOwnDatabase(client, {
    storage: false, // Important - use false instead of a storage path
    updateCountdownEvery: 10000,
    default: {
        botsCanWin: false,
        exemptPermissions: ['ADMINISTRATOR'],
        embedColor: '#2f3136',
        reaction: '🎉'
    }
});
client.manager = manager;
client.manager.on('giveawayReactionAdded', async(giveaway, member, reaction) => {
    if (reaction.message.partial) await reaction.message.fetch();
    let message = reaction.message;
    const find = await giveawayModel.findOne({ serverID: giveaway.guildID, MessageID: giveaway.messageID })
    if (find) {
        if (find.requiredMessages) {
            const levelModel = require('./database/models/level');
            const userdata = await levelModel.findOne({ serverID: giveaway.guildID, userID: member.id })
            if (find.requiredMessages > userdata.messagec) {
                const succese = new Discord.MessageEmbed()
                    .setTitle(`${emojis.error} Participation Refusée`)
                    .setDescription(`Votre participation pour [ce giveaway](${message.url}) a été refusée ! Vous devez avoir ${find.requiredMessages} Messages !!`)
                    .addFields({ name: "🧷 Liens utliles", value: `
[Dashboard](http://green-bot.tk/)-[Inviter le bot](https://discord.com/oauth2/authorize?client_id=${client.user.id}&scope=bot&permissions=8) - [Support](https://discord.gg/nrReAmApVJ) - [Github](https://github.com/pauldb09/Green-bot)` })
                    .setColor('#982318')
                    .setFooter(config.footer)
                member.send(succese)
                reaction.users.remove(member.user);
            } else {
                const succes = new Discord.MessageEmbed()
                    .setTitle(`${emojis.succes} Participation acceptée`)
                    .setDescription(`Votre participation pour [ce giveaway](${message.url}) a été acceptée , vous remplissez les conditions  ! Bonne chance !`)
                    .addFields({ name: "🧷 Liens utliles", value: `
[Dashboard](http://green-bot.tk/)-[Inviter le bot](https://discord.com/oauth2/authorize?client_id=${client.user.id}&scope=bot&permissions=8) - [Support](https://discord.gg/nrReAmApVJ) - [Github](https://github.com/pauldb09/Green-bot)` })
                    .setColor(config.color)
                    .setFooter(config.footer)
                member.send(succes)
            }
        }
    } else {
        const succes = new Discord.MessageEmbed()
            .setTitle(`${emojis.succes} Participation acceptée`)
            .setDescription(`Votre participation pour [ce giveaway](${message.url}) a été acceptée ! Bonne chance !`)
            .addFields({ name: "🧷 Liens utliles", value: `
        [Dashboard](http://green-bot.tk/)-[Inviter le bot](https://discord.com/oauth2/authorize?client_id=${client.user.id}&scope=bot&permissions=8) - [Support](https://discord.gg/nrReAmApVJ) - [Github](https://github.com/pauldb09/Green-bot)` })
            .setColor(config.color)
            .setFooter(config.footer)
        member.send(succes)
    }

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
