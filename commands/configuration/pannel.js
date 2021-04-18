const Discord = require('discord.js');
const sendErrorMessage = require('../../util.js');
const Welcome = require('../../database/models/Welcome');
const emoji = require('../../emojis.json')
const guild = require('../../database/models/guild');

const { stripIndent, oneLine } = require('common-tags');
module.exports = {
        name: 'panel',
        description: 'Affiche les configurations de green-bot sur le serveur',
        aliases: ['setting', 'set', 's', 'config', 'conf'],
        cat: 'configuration',
        permissions: ['MANAGE_GUILD'],
        async execute(message, args) {
            const suggDB = await guild.findOne({ serverID: message.guild.id, reason: `sugg` })
            const chat = await Welcome.findOne({ serverID: message.guild.id, reason: `chatbot` })
            const autorole_bot = await Welcome.findOne({ serverID: message.guild.id, reason: `autorole_bot` })
            const autorole = await Welcome.findOne({ serverID: message.guild.id, reason: `autorole` })

            const logDB = await Welcome.findOne({ serverID: message.guild.id, reason: `logs` })
            const starDB = await Welcome.findOne({ serverID: message.guild.id, reason: `starboard` })
            let prefixget = await guild.findOne({ serverID: message.guild.id, reason: `prefix` })
            const prefix = prefixget.content;
            const welcomeDB = await Welcome.findOne({ serverID: message.guild.id, reason: `welcome` })
            const leaveDB = await Welcome.findOne({ serverID: message.guild.id, reason: `leave` })
            const levelMessagedb = await guild.findOne({ serverID: message.guild.id, reason: `levelMessage` })
            let levelMessage;
            if (levelMessagedb) {
                levelMessage = levelMessagedb.content
            } else {
                levelMessage = "Bravo à  toi {user} , tu viens de passer un niveau , tu es désormais au niveau {level}"
            }
            let levelActive = await guild.findOne({ serverID: message.guild.id, reason: `level` })
            let EditActive = await guild.findOne({ serverID: message.guild.id, reason: `level_edit` })

            const findlc = await guild.findOne({ serverID: message.guild.id, reason: `levelChannel` })
            let levelChannel;
            if (findlc) {
                if (findlc.content) {
                    if (findlc.content === 'current') {
                        levelChannel = findlc.content;

                    } else {
                        levelChannel = message.guild.channels.cache.get(findlc.content);
                    }
                } else {
                    levelChannel = "Non défini";
                }
            } else {
                levelChannel = "Non défini";
            }
            const embed2 = new Discord.MessageEmbed()
                .setAuthor(message.guild.name, message.guild.iconURL())
                .setTitle(`<:panelconfig:830347712330203146> Configuration 2/2`)
                .setDescription('📝 Pour éditer la configuration , rendez vous sur le [Dashboard](http://green-bot.xyz)')

            .addField(`Autorôles`, `**Humains** ${autorole ? `<@&${autorole.channelID}>` : "<:icon_SwitchIconOff:825378603252056116>"}\n**Bots** ${autorole_bot ? `<@&${autorole_bot.channelID}>` : "<:icon_SwitchIconOff:825378603252056116>"}`)

.addField('Salons Particuliers', `Salon du chatbot : ${chat ? chat.channelID? `<#${chat.channelID}>`: "Non défini" : "Non défini"}\nSalon des suggestions : ${suggDB ? suggDB.content ? `<#${suggDB.content}>`: "Non défini" : "Non défini"}\nSalon des logs : ${logDB ? logDB.channelID ? `<#${logDB.channelID}>`: "Non défini" : "Non défini"}\nSalon du starboard : ${starDB  ? starDB.channelID ? `<#${starDB.channelID}>`: "Non défini" : "Non défini"}`)
.setFooter(message.client.footer)
.setColor(message.client.color);
const embed1 = new Discord.MessageEmbed()
                .setAuthor(message.guild.name, message.guild.iconURL())
                .setTitle(`<:panelconfig:830347712330203146> Configuration 1/2`)
                .setDescription('📝 Pour éditer la configuration , rendez vous sur le [Dashboard](http://green-bot.xyz)')
                .addField(`Configuration Générale`, `Préfixe : \`${prefix}\`\nLangue : :flag_fr:  Français`)

            .addField(`Système de Bienvenue ${welcomeDB ? welcomeDB.status ? "<:IconSwitchIconOn:825378657287274529>": "<:icon_SwitchIconOff:825378603252056116>" : "<:icon_SwitchIconOff:825378603252056116>"}`, `**Salon** ${welcomeDB ? welcomeDB.channelID ? `<#${welcomeDB.channelID}>`: "Non défini" : "Non défini"}\n**image** : ${welcomeDB ? welcomeDB.image ? "<:IconSwitchIconOn:825378657287274529>": "<:icon_SwitchIconOff:825378603252056116>" : "<:icon_SwitchIconOff:825378603252056116>"}`,true)
                .addField(`Système de Départ ${leaveDB ? leaveDB.status ? "<:IconSwitchIconOn:825378657287274529>": "<:icon_SwitchIconOff:825378603252056116>" : "<:icon_SwitchIconOff:825378603252056116>"}`, `**Salon** ${leaveDB ? leaveDB.channelID ? `<#${leaveDB.channelID}>`: "Non défini" : "Non défini"}\n**image** : ${leaveDB ? leaveDB.image ? "<:IconSwitchIconOn:825378657287274529>": "<:icon_SwitchIconOff:825378603252056116>" : "<:icon_SwitchIconOff:825378603252056116>"}`,true)
                .addField(`Système de Niveau ${levelActive ?"<:IconSwitchIconOn:825378657287274529>": "<:icon_SwitchIconOff:825378603252056116>"}`, `**Salon** ${levelChannel}\n**Message** : ${levelMessage}\n**Autoriser à modifier sa carte** : ${EditActive ?"<:IconSwitchIconOn:825378657287274529>": "<:icon_SwitchIconOff:825378603252056116>"}`)

.setFooter(message.client.footer)
        .setColor(message.client.color);

        const recon = require("reconlx");
        // Destructure the package
        const ReactionPages = recon.ReactionPages;
        // Use either MessageEmbed or RichEmbed to make pages
        // Keep in mind that Embeds should't have their footers set since the pagination method sets page info there
        
        // Create an array of embeds.
        const pages = [embed1, embed2];
        // Change pages when sending numbers.
        const textPageChange = true;
        // Create an emojilist, first emoji being page back and second emoji being page front. Defaults are set to  ['⏪', '⏩'].
        const emojis = ["◀️", "▶️"];
        // Define a time in ms, defaults are set to 60000ms which is 60 seconds. Time on how long you want the embed to be interactable
        const time = 60000;
        // Call the ReactionPages method, use the <message> parameter to initialize it.
        ReactionPages(message, pages, textPageChange, emojis, time);
        //There you go, now you have embed pages.









    },
};