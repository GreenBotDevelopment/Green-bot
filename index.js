if(Number(process.version.slice(1).split(".")[0]) < 12) throw new Error("La version de Node.js est inférieure à la 12.0.0. Veuillez vous mettre en v12.0.0 ou plus.");

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
const express = require('express');
const app = express();
const server = require('http').createServer(app);
const TempChannels = require("discord-temp-channels");
const tempChannels = new TempChannels(client);
client.tempChannels = tempChannels;
const Welcome = require('./database/models/Welcome')
const db = new Database(config.MongoURL);
client.db = db;

db.once('ready', async() => {

});
client.once("ready", async() => {
    if ((await db.get('giveaways')) === null) await db.set('giveaways', []);
    console.log('quicmongo is lready');
});
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
        embedColorEnd: '#E3E028',
        embedColor: config.color,
        reaction: '🎉'
    }
});

client.manager = manager;
manager.on('endedGiveawayReactionAdded', async(giveaway, member, reaction) => {
    if (reaction.message.partial) await reaction.message.fetch();
    let message = reaction.message;
    const succese = new Discord.MessageEmbed()
        .setTitle(`${emojis.error} - Giveaway Terminé...`)
        .setURL('http://green-bot.tk/')
        .setDescription(`[Ce giveaway](${message.url}) est terminé... vous ne pouvez donc pas participer.`)
        .addFields({ name: "🧷 Liens utliles", value: `
[Dashboard](http://green-bot.tk/)-[Inviter le bot](https://discord.com/oauth2/authorize?client_id=${client.user.id}&scope=bot&permissions=8) - [Support](https://discord.gg/nrReAmApVJ) - [Github](https://github.com/pauldb09/Green-bot)` })
        .setColor('#982318')
        .setFooter(config.footer)
    member.send(succese)
    return reaction.users.remove(member.user);
});
client.manager.on('giveawayEnded', async(giveaway, winners) => {
            if (giveaway.message.partial) await giveaway.message.fetch();
            let message = giveaway.message;
            const verify = await Welcome.findOne({ serverID: message.guild.id, reason: `giveaway_c` })
            let logschannel;
            if (verify) {
                logschannel = message.guild.channels.cache.get(verify.channelID);
            } else {
                logschannel = null;
            }
            winners.forEach((member) => {
                const logembede = new Discord.MessageEmbed()
                    .setTitle(`${emojis.succes} - Giveaway Gagné `)
                    .setURL('http://green-bot.tk/')
                    .setDescription(`Félicitations **${member.user.username}** vous avez gagné [Ce giveaway](${message.url}) :tada: !\n __Prix__ : \n**${giveaway.prize}**`)
                    .setColor(config.color)
                    .setFooter(config.footer)
                member.send(logembede)
            });
            const logembed = new Discord.MessageEmbed()
                .setTitle(`${emojis.succes} - Giveaway Terminé `)
                .setURL('http://green-bot.tk/')
                .setDescription(`[Ce giveaway](${message.url}) est terminé :tada: !\n __Gagnant(s)__ :\n${winners.map(w=>`<@${w.user.id}>`).join(" ")}`)
        .setColor(config.color)
        .setFooter(config.footer)
    if (logschannel) logschannel.send(logembed)
});
client.manager.on('giveawayReactionAdded', async(giveaway, member, reaction) => {
    if (reaction.message.partial) await reaction.message.fetch();
    let message = reaction.message;
    const verify = await Welcome.findOne({ serverID: message.guild.id, reason: `giveaway_c` })
    let logschannel;
    if (verify) {
        logschannel = message.guild.channels.cache.get(verify.channelID);
    } else {
        logschannel = null;
    }

    const verifyblack = await Welcome.findOne({ serverID: message.guild.id, channelID: member.user.id, reason: `giveaway_black` })
    if (verifyblack) {
        const succese = new Discord.MessageEmbed()
        .setTitle(`${emojis.error} - Participation Refusée`)
        .setURL('http://green-bot.tk/')
        .setDescription(`Votre participation pour [ce giveaway](${message.url}) a été refusée ! Vous avez été blacklisté du système de giveaway .`)
        .addFields({ name: "🧷 Liens utliles", value: `
[Dashboard](http://green-bot.tk/)-[Inviter le bot](https://discord.com/oauth2/authorize?client_id=${client.user.id}&scope=bot&permissions=8) - [Support](https://discord.gg/nrReAmApVJ) - [Github](https://github.com/pauldb09/Green-bot)` })
        .setColor('#982318')
        .setFooter(config.footer)
    member.send(succese)
    reaction.users.remove(member.user);
    const logembed = new Discord.MessageEmbed()
        .setTitle(`${emojis.error} - Participation Refusée `)
        .setURL('http://green-bot.tk/')
        .setDescription(`La participation de ${member} à [ce giveaway](${message.url}) a été refusée .Car il est dans la blacklist des giveaways`)
        .setColor('#982318')
        .setFooter(config.footer)
    if (logschannel) logschannel.send(logembed)
    return;
    }
    const find = await giveawayModel.findOne({ serverID: giveaway.guildID, MessageID: giveaway.messageID })
    if (find) {


        if (find.requiredMessages && find.requiredInvites) {
            const invites = await message.guild.fetchInvites().catch(() => {});

            const memberInvites = invites.filter((i) => i.inviter && i.inviter.id === member.user.id);
            let inviteshas;
            if (memberInvites.size <= 0) {
                inviteshas = 0;
            } else {

                let index = 0;
                memberInvites.forEach((invite) => index += invite.uses);
                inviteshas = index;
            }
            const levelModel = require('./database/models/level');
            const userdata = await levelModel.findOne({ serverID: giveaway.guildID, userID: member.id })



            if (!userdata) {
                const succese = new Discord.MessageEmbed()
                    .setTitle(`${emojis.error} - Participation Refusée`)
                    .setURL('http://green-bot.tk/')
                    .setDescription(`Votre participation pour [ce giveaway](${message.url}) a été refusée ! Vous devez avoir ${find.requiredMessages} Messages !!`)
                    .addFields({ name: "🧷 Liens utliles", value: `
[Dashboard](http://green-bot.tk/)-[Inviter le bot](https://discord.com/oauth2/authorize?client_id=${client.user.id}&scope=bot&permissions=8) - [Support](https://discord.gg/nrReAmApVJ) - [Github](https://github.com/pauldb09/Green-bot)` })
                    .setColor('#982318')
                    .setFooter(config.footer)
                member.send(succese)
                reaction.users.remove(member.user);
                const logembed = new Discord.MessageEmbed()
                    .setTitle(`${emojis.error} - Participation Refusée `)
                    .setURL('http://green-bot.tk/')
                    .setDescription(`La participation de ${member} à [ce giveaway](${message.url}) a été refusée .\n__Conditions__\nMessages : **0/${find.requiredMessages}**\nInvitations : ${inviteshas}/${find.requiredInvites}`)
                    .setColor('#982318')
                    .setFooter(config.footer)
                if (logschannel) logschannel.send(logembed)
                return;
            }
            if (find.requiredMessages < userdata.messagec || find.requiredMessages == userdata.messagec && find.requiredInvites < inviteshas || find.requiredInvites == inviteshas) {
                const succes = new Discord.MessageEmbed()
                    .setTitle(`${emojis.succes} - Participation acceptée`)
                    .setDescription(`Votre participation pour [ce giveaway](${message.url}) a été acceptée , vous remplissez les conditions  ! Bonne chance !`)
                    .addFields({ name: "🧷 Liens utliles", value: `
[Dashboard](http://green-bot.tk/)-[Inviter le bot](https://discord.com/oauth2/authorize?client_id=${client.user.id}&scope=bot&permissions=8) - [Support](https://discord.gg/nrReAmApVJ) - [Github](https://github.com/pauldb09/Green-bot)` })
                    .setColor(config.color)
                    .setURL('http://green-bot.tk/')

                .setFooter(config.footer)
                member.send(succes)
                const logembed = new Discord.MessageEmbed()
                    .setTitle(`${emojis.succes} - Participation Acceptée `)
                    .setDescription(`La participation de ${member} à [ce giveaway](${message.url}) a été acceptée . \n__Conditions__\nMessages : **${userdata.messagec}/${find.requiredMessages}**\nInvitations : ${inviteshas}/${find.requiredInvites}`)
                    .setColor(config.color)
                    .setURL('http://green-bot.tk/')

                .setFooter(config.footer)
                if (logschannel) logschannel.send(logembed)
                return;
            } else {

                const succese = new Discord.MessageEmbed()
                    .setTitle(`${emojis.error} - Participation Refusée`)
                    .setURL('http://green-bot.tk/')

                .setDescription(`Votre participation pour [ce giveaway](${message.url}) a été refusée : \n__Conditions__\nMessages : **${userdata.messagec}/${find.requiredMessages}**\nInvitations : **${inviteshas}/${find.requiredInvites}** `)
                    .addFields({ name: "🧷 Liens utliles", value: `
[Dashboard](http://green-bot.tk/)-[Inviter le bot](https://discord.com/oauth2/authorize?client_id=${client.user.id}&scope=bot&permissions=8) - [Support](https://discord.gg/nrReAmApVJ) - [Github](https://github.com/pauldb09/Green-bot)` })
                    .setColor('#982318')
                    .setFooter(config.footer)
                member.send(succese)
                reaction.users.remove(member.user);
                const logembed = new Discord.MessageEmbed()
                    .setTitle(`${emojis.error} - Participation Refusée `)
                    .setURL('http://green-bot.tk/')

                .setDescription(`La participation de ${member} à [ce giveaway](${message.url}) a été refusée .\n__Conditions__\nMessages : **${userdata.messagec}/${find.requiredMessages}**\nInvitations : ${inviteshas}/${find.requiredInvites}`)
                    .setColor('#982318')
                    .setFooter(config.footer)
                if (logschannel) logschannel.send(logembed)
                return;
            }
        } else {
            if (find.requiredMessages) {
                const levelModel = require('./database/models/level');
                const userdata = await levelModel.findOne({ serverID: giveaway.guildID, userID: member.id })
                if (!userdata) {
                    const succese = new Discord.MessageEmbed()
                        .setTitle(`${emojis.error} - Participation Refusée`)
                        .setDescription(`Votre participation pour [ce giveaway](${message.url}) a été refusée ! Vous devez avoir ${find.requiredMessages} Messages !!`)
                        .addFields({ name: "🧷 Liens utliles", value: `
    [Dashboard](http://green-bot.tk/)-[Inviter le bot](https://discord.com/oauth2/authorize?client_id=${client.user.id}&scope=bot&permissions=8) - [Support](https://discord.gg/nrReAmApVJ) - [Github](https://github.com/pauldb09/Green-bot)` })
                        .setColor('#982318')
                        .setURL('http://green-bot.tk/')

                    .setFooter(config.footer)
                    member.send(succese)
                    reaction.users.remove(member.user);
                    const logembed = new Discord.MessageEmbed()
                        .setTitle(`${emojis.error} - Participation Refusée `)
                        .setDescription(`La participation de ${member} à [ce giveaway](${message.url}) a été refusée . Il a **0** messages /  **${find.requiredMessages}**`)
                        .setColor('#982318')
                        .setURL('http://green-bot.tk/')
                        .setFooter(config.footer)
                    if (logschannel) logschannel.send(logembed)
                    return;
                }
                if (find.requiredMessages > userdata.messagec) {
                    const succese = new Discord.MessageEmbed()
                        .setTitle(`${emojis.error} - Participation Refusée`)
                        .setDescription(`Votre participation pour [ce giveaway](${message.url}) a été refusée ! Vous devez avoir ${find.requiredMessages} Messages !!`)
                        .addFields({ name: "🧷 Liens utliles", value: `
    [Dashboard](http://green-bot.tk/)-[Inviter le bot](https://discord.com/oauth2/authorize?client_id=${client.user.id}&scope=bot&permissions=8) - [Support](https://discord.gg/nrReAmApVJ) - [Github](https://github.com/pauldb09/Green-bot)` })
                        .setColor('#982318')
                        .setURL('http://green-bot.tk/')

                    .setFooter(config.footer)
                    member.send(succese)
                    reaction.users.remove(member.user);
                    const logembed = new Discord.MessageEmbed()
                        .setTitle(`${emojis.error} - Participation Refusée `)
                        .setDescription(`La participation de ${member} à [ce giveaway](${message.url}) a été refusée . Il a **${userdata.messagec}** messages / **${find.requiredMessages}**`)
                        .setColor('#982318')
                        .setURL('http://green-bot.tk/')

                    .setFooter(config.footer)
                    if (logschannel) logschannel.send(logembed)
                    return;
                } else {
                    const succes = new Discord.MessageEmbed()
                        .setTitle(`${emojis.succes} -  Participation acceptée`)
                        .setDescription(`Votre participation pour [ce giveaway](${message.url}) a été acceptée , vous remplissez les conditions  ! Bonne chance !`)
                        .addFields({ name: "🧷 Liens utliles", value: `
    [Dashboard](http://green-bot.tk/)-[Inviter le bot](https://discord.com/oauth2/authorize?client_id=${client.user.id}&scope=bot&permissions=8) - [Support](https://discord.gg/nrReAmApVJ) - [Github](https://github.com/pauldb09/Green-bot)` })
                        .setColor(config.color)
                        .setURL('http://green-bot.tk/')

                    .setFooter(config.footer)
                    member.send(succes)
                    const logembed = new Discord.MessageEmbed()
                        .setTitle(`${emojis.succes} - Participation Accpetée `)
                        .setDescription(`La participation de ${member} à [ce giveaway](${message.url}) a été acceptée . Il a **${userdata.messagec}** messages / **${find.requiredMessages}**`)
                        .setColor(config.color)
                        .setURL('http://green-bot.tk/')

                    .setFooter(config.footer)
                    if (logschannel) logschannel.send(logembed)
                    return;
                }
            }
            if (find.requiredInvites) {
                const invites = await message.guild.fetchInvites().catch(() => {});

                const memberInvites = invites.filter((i) => i.inviter && i.inviter.id === member.user.id);
                let inviteshas;
                if (memberInvites.size <= 0) {
                    inviteshas = 0;
                } else {

                    let index = 0;
                    memberInvites.forEach((invite) => index += invite.uses);
                    inviteshas = index;
                }
                if (inviteshas > find.requiredInvites || inviteshas == find.requiredInvites) {
                    const succes = new Discord.MessageEmbed()
                        .setTitle(`${emojis.succes} - Participation acceptée`)
                        .setDescription(`Votre participation pour [ce giveaway](${message.url}) a été acceptée , vous remplissez les conditions  ! Bonne chance !`)
                        .addFields({ name: "🧷 Liens utliles", value: `
[Dashboard](http://green-bot.tk/)-[Inviter le bot](https://discord.com/oauth2/authorize?client_id=${client.user.id}&scope=bot&permissions=8) - [Support](https://discord.gg/nrReAmApVJ) - [Github](https://github.com/pauldb09/Green-bot)` })
                        .setColor(config.color)
                        .setURL('http://green-bot.tk/')

                    .setFooter(config.footer)
                    member.send(succes)
                    const logembed = new Discord.MessageEmbed()
                        .setTitle(`${emojis.succes} - Participation Acceptée `)
                        .setDescription(`La participation de ${member} à [ce giveaway](${message.url}) a été acceptée . \n__Conditions__\nInvitations : **${inviteshas}/${find.requiredInvites}**`)
                        .setColor(config.color)
                        .setURL('http://green-bot.tk/')
                        .setFooter(config.footer)
                    if (logschannel) logschannel.send(logembed)
                    return;
                } else {
                    const succese = new Discord.MessageEmbed()
                        .setTitle(`${emojis.error} - Participation Refusée`)
                        .setURL('http://green-bot.tk/')
                        .setDescription(`Votre participation pour [ce giveaway](${message.url}) a été refusée : \n__Conditions__\nInvitations : **${inviteshas}/${find.requiredInvites}** `)
                        .addFields({ name: "🧷 Liens utliles", value: `
[Dashboard](http://green-bot.tk/)-[Inviter le bot](https://discord.com/oauth2/authorize?client_id=${client.user.id}&scope=bot&permissions=8) - [Support](https://discord.gg/nrReAmApVJ) - [Github](https://github.com/pauldb09/Green-bot)` })
                        .setColor('#982318')
                        .setFooter(config.footer)
                    member.send(succese)
                    reaction.users.remove(member.user);
                    const logembed = new Discord.MessageEmbed()
                        .setTitle(`${emojis.error} - Participation Refusée `)
                        .setURL('http://green-bot.tk/')
                        .setDescription(`La participation de ${member} à [ce giveaway](${message.url}) a été refusée .\n__Conditions__\nInvitations : ${inviteshas}/${find.requiredInvites}`)
                        .setColor('#982318')
                        .setFooter(config.footer)
                    if (logschannel) logschannel.send(logembed)
                    return;
                }
            }
        }
    } else {
        const succes = new Discord.MessageEmbed()
            .setTitle(`${emojis.succes} Participation acceptée`)
            .setDescription(`Votre participation pour [ce giveaway](${message.url}) a été acceptée ! Bonne chance !`)
            .addFields({ name: "🧷 Liens utliles", value: `
        [Dashboard](http://green-bot.tk/)-[Inviter le bot](https://discord.com/oauth2/authorize?client_id=${client.user.id}&scope=bot&permissions=8) - [Support](https://discord.gg/nrReAmApVJ) - [Github](https://github.com/pauldb09/Green-bot)` })
            .setColor(config.color)
            .setURL('http://green-bot.tk/')

        .setFooter(config.footer)
        member.send(succes)
        const logembed = new Discord.MessageEmbed()
            .setTitle(`${emojis.succes} - Participation acceptée `)
            .setDescription(`La participation de ${member} à [ce giveaway](${message.url}) a été acceptée . `)
            .setColor(config.color)
            .setURL('http://green-bot.tk/')
            .setFooter(config.footer)
        if (logschannel) logschannel.send(logembed)
    }

});
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
client.on("interactionCreate", (interaction) => {
console.log('ok')
  if (interaction.name === "ping") {
    interaction.channel.send("pong");
  }
  if (interaction.name === "test") {
    interaction.channel.send("nice");
  }

});

client.login(config.token);
