const guild = require('../database/models/guild');
const levelModel = require('../database/models/level');
const emoji = require('../emojis.json');
const config = require('../config.json');
const Welcome = require('../database/models/Welcome');
const adventure = require("../database/models/adventure");
const Discord = require('discord.js');
const cooldowns = new Discord.Collection();
module.exports = {


    async execute(message) {
        const { client } = message;
        const footer = client.footer;
        const color = client.color;
        if (message.author.bot) return;
        if (!message) return;
        if (!message.member && !message.author) return;
        let prefixedb = await guild.findOne({ serverID: message.guild.id, reason: `prefix` })
        if (prefixedb) {


        } else {
            const verynew = new guild({
                serverID: `${message.guild.id}`,
                content: `${config.prefix}`,
                reason: 'prefix',
            }).save();


        }
        const userdata = await levelModel.findOne({ serverID: message.guild.id, userID: message.author.id })
        if (userdata) {
            if (userdata.xp + 5 > 100) {
                let levelstsats = await guild.findOne({ serverID: message.guild.id, reason: `level` })
                if (levelstsats) {
                    message.channel.send(` GG ${message.author} , tu viens de passer un niveau ! Tu es désormais au niveau ${userdata.level + 1} !`)
                    const levelupdate = await levelModel.findOneAndUpdate({ serverID: message.guild.id, userID: message.author.id }, { $set: { xp: '0', level: userdata.level + 1, messagec: userdata.messagec + 1 } }, { new: true });


                } else {
                    const levelupdategt = await levelModel.findOneAndUpdate({ serverID: message.guild.id, userID: message.author.id }, { $set: { xp: '0', level: userdata.level + 1, messagec: userdata.messagec + 1 } }, { new: true });

                }
            } else {
                const normalupdate = await levelModel.findOneAndUpdate({ serverID: message.guild.id, userID: message.author.id }, { $set: { xp: `${userdata.xp + 5}`, messagec: userdata.messagec + 1 } }, { new: true });

            }
        } else {
            const verynew = new levelModel({
                serverID: `${message.guild.id}`,
                userID: `${message.author.id}`,
                xp: 5,
                level: 0,
                messagec: 1
            }).save();
        }



        let prefixget = await guild.findOne({ serverID: message.guild.id, reason: `prefix` })
        const prefix = prefixget.content;
        const ischannel = await Welcome.findOne({ serverID: message.guild.id, reason: `interchat` })
        if (ischannel.channelID === message.channel.id) {
          
                const reportEmbed = new Discord.MessageEmbed()
                    .setTitle(`Interchat : Erreur`)


                .setDescription(`Vous avez défini le salon de l'interchat mais pas un serveur correspondant !
            Veuillez faire : \`${prefix}interchat-server <id>\``)



                .setFooter(client.footer)

                .setColor("#DA7226");
                message.channel.send(reportEmbed);
            
        }
        const mentionRegex = RegExp(`^<@!${client.user.id}>$`);
        if (message.content.match(mentionRegex)) {

            const embed = new Discord.MessageEmbed()
                .setColor(message.client.color || '#3A871F')

            .setAuthor(`${message.client.user.username} - Besoin d'aide ?`, message.client.user.displayAvatarURL())
                .setDescription(`Eh je suis \`${message.client.user.username}\` et mon préfixe est \`${prefix}\` , faites \`${prefix}help\` pour la liste des commandes ! `)
                .setTimestamp()
                .setFooter(message.client.footer || 'Green-Bot | Open source bot by 𝖕𝖆𝖚𝖑𝖉𝖇09#9846')

            return message.channel.send({ embed })
        }
        message.mentions.users.forEach(async(u) => {
            let afkdb = await guild.findOne({ serverID: u.id, reason: `afk` })
            if (afkdb) {
                message.channel.send(` ${u.tag} est afk pour la raison : \`${afkdb.content}\``);

            }
        });
        if (!message.content.startsWith(prefix) || message.author.bot) return;

        const args = message.content.slice(prefix.length).trim().split(/ +/);
        const commandName = args.shift().toLowerCase();

        const command = client.commands.get(commandName) ||
            client.commands.find(cmd => cmd.aliases && cmd.aliases.includes(commandName));

        if (!command) {
            return;
        } else {
            if (!message.guild.me.hasPermission("SEND_MESSAGES")) {
                return;

            }
            if (!message.guild.me.hasPermission("EMBED_LINKS")) {
                return message.channel.send(`${emoji.error} Il manque au bot la permission \`EMBED_LINKS\` , qui permet de faire des embeds . Veuillez lui la donner pour son bon fonctionnement.`);

            }
            let commanddb = await guild.findOne({ serverID: message.guild.id, content: message.author.id, reason: `command` })
            if (commanddb) {
                let newcommand = +commanddb.description + 1;
                const levelupdate = await guild.findOneAndUpdate({ serverID: message.guild.id, content: message.author.id, reason: `command` }, { $set: { description: newcommand } }, { new: true });

            } else {
                const verynew = new guild({
                    serverID: `${message.guild.id}`,
                    description: 1,
                    content: `${message.author.id}`,
                    reason: 'command',
                }).save();


            }
        }

        const validatePermissions = (permissions) => {
            const validPermissions = [
                'CREATE_INSTANT_INVITE',
                'KICK_MEMBERS',
                'BAN_MEMBERS',
                'ADMINISTRATOR',
                'MANAGE_CHANNELS',
                'MANAGE_GUILD',
                'ADD_REACTIONS',
                'VIEW_AUDIT_LOG',
                'PRIORITY_SPEAKER',
                'STREAM',
                'VIEW_CHANNEL',
                'SEND_MESSAGES',
                'SEND_TTS_MESSAGES',
                'MANAGE_MESSAGES',
                'EMBED_LINKS',
                'ATTACH_FILES',
                'READ_MESSAGE_HISTORY',
                'MENTION_EVERYONE',
                'USE_EXTERNAL_EMOJIS',
                'VIEW_GUILD_INSIGHTS',
                'CONNECT',
                'SPEAK',
                'MUTE_MEMBERS',
                'DEAFEN_MEMBERS',
                'MOVE_MEMBERS',
                'USE_VAD',
                'CHANGE_NICKNAME',
                'MANAGE_NICKNAMES',
                'MANAGE_ROLES',
                'MANAGE_WEBHOOKS',
                'MANAGE_EMOJIS',
            ]

            for (const permission of permissions) {
                if (!validPermissions.includes(permission)) {
                    console.log(`Unknown permission node "${permission}"`);
                }
            }
        }
        let permissions = command.permissions;

        if (permissions) {
            if (typeof permissions === 'string') {
                permissions = [permissions]
            }

            validatePermissions(permissions);
            for (const permission of permissions) {
                if (!message.member.hasPermission(permission)) {
                    return message.channel.send(`${emoji.error} Il vous manque la permission \`${permission}\` pour utiliser cette commande`);

                }
            }
        }
        let botpermissions = command.botpermissions;

        if (botpermissions) {
            if (typeof botpermissions === 'string') {
                botpermissions = [botpermissions]
            }

            validatePermissions(botpermissions);
            for (const permission of botpermissions) {
                if (!message.guild.me.hasPermission(permission)) {
                    return message.channel.send(`${emoji.error} Il manque au bot la permission \`${permission}\` pour utiliser cette commande`);

                }
            }
        }
        if (command.adventure) {
            let advdb = await adventure.findOne({ UserID: message.author.id, active: true })
            if (!advdb) return message.channel.send(`${emoji.error} Vous devez déja commencer une quete... faite ${prefix}quete-start pour commencer 😉`)
        }
        if (command.guildOnly && message.channel.type === 'dm') {
            return message.reply(`${emoji.error} | je ne peux pas faire cette commande en MP.... !`);
        }
        if (command.owner && message.author.id !== config.ownerID) {
            return message.reply(`${emoji.error}  | Tu dois etre owner du bot pour faire cette commande !`);
        }
        if (command.args === 'user' && !message.mentions.members.first()) {
            if (message.guild.members.cache.get(args[0])) {

            } else {

                let reply = `${emoji.error}  | Cette commande requiert des arguments , ${message.author}!`;

                if (command.usage) {

                    const reportEmbed = new Discord.MessageEmbed()
                        .setTitle(`${emoji.error}  | Erreur d'utlisation `)



                    .addField("Il faut mentionner un utilisateur ou mettre un id !", `\`\`\`diff\n${prefix}${command.name} ${command.usage}\`\`\``)
                        .addField("Exemple", `\`\`\`https\n${prefix}${command.name} ${command.exemple || '#pauldb09'}\`\`\``)


                    .setFooter(footer)

                    .setColor(client.color);
                    message.channel.send(reportEmbed);
                    return;
                }

                return message.channel.send(reply);

            }
        }
        if (command.args === 'channel' && !message.mentions.channels.first()) {
            if (message.guild.channels.cache.get(args[0])) {

            } else {
                if (args[0] === 'disable') {

                } else {
                    let reply = `${emoji.error}  | Cette commande requiert des arguments , ${message.author}!`;

                    if (command.usage) {
                        const reportEmbed = new Discord.MessageEmbed()
                            .setTitle(`${emoji.error}  | Erreur d'utlisation `)



                        .addField("Il faut mentionner un salon ou mettre un id !", `\`\`\`diff\n${prefix}${command.name} ${command.usage}\`\`\``)
                            .addField("Exemple", `\`\`\`diff\n${prefix}${command.name} ${command.exemple || '#salon magnifique'}\`\`\``)


                        .setFooter(footer)

                        .setColor(client.color);
                        message.channel.send(reportEmbed);
                        return;
                    }

                    return message.channel.send(reply);
                }
            }
        }
        if (command.args && !args.length) {
            let reply = `${emoji.error}  | Cette commande requiert des arguments , ${message.author}!`;

            if (command.usage) {
                const reportEmbed = new Discord.MessageEmbed()
                    .setTitle(`${emoji.error}  | Erreur d'utlisation`)



                .addField("Un argument est attendu !", `\`\`\`diff\n${prefix}${command.name} ${command.usage}\`\`\``)



                .setFooter(footer)

                .setColor(config.color);
                if (command.exemple) reportEmbed.addField("Exemple", `\`\`\`diff\n${prefix}${command.name} ${command.exemple}\`\`\``)

                message.channel.send(reportEmbed);
                return;
            }

            return message.channel.send(reply);
        }


        if (!cooldowns.has(command.name)) {
            cooldowns.set(command.name, new Discord.Collection());
        }

        const now = Date.now();
        const timestamps = cooldowns.get(command.name);
        const cooldownAmount = (command.cooldown || 3) * 1000;

        if (timestamps.has(message.author.id)) {
            const expirationTime = timestamps.get(message.author.id) + cooldownAmount;

            if (now < expirationTime) {
                const timeLeft = (expirationTime - now) / 1000;
                return message.reply(`${emoji.error}  merci d'attendre encore ${timeLeft.toFixed(1)} secondes avant de réutliser la commande \`${command.name}\` `);
            }
        }

        timestamps.set(message.author.id, now);
        setTimeout(() => timestamps.delete(message.author.id), cooldownAmount);

        try {
            command.execute(message, args, );
        } catch (error) {
            console.error(error);
            message.channel.send(`${emoji.error} **| Une erreur est survenue lors de l'éxécution de la commande !**`);
        }

    }
};
