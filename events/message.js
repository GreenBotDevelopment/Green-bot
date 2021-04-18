const guild = require('../database/models/guild');
const levelModel = require('../database/models/level');
const emoji = require('../emojis.json');
const Warn = require('../database/models/warn');
const fetch = require("node-fetch");
const math = require('mathjs');
const config = require('../config.json');
const Welcome = require('../database/models/Welcome');
const adventure = require("../database/models/adventure");
const Discord = require('discord.js');
const cooldowns = new Discord.Collection();
require('../util/extenders.js')
module.exports = {


    async execute(message) {
        const { client } = message;
        const footer = client.footer;
        const color = client.color;
        if (message.author.bot) return;
        if (!message.guild) return;

        const verify = await Welcome.findOne({ serverID: message.guild.id, reason: `chatbot`, channelID: message.channel.id })
        if (verify) {
            let messageC = await message.translate(message.content)
            try {
                fetch(`https://api.deltaa.me/chatbot?message=${encodeURIComponent(messageC)}&name=${client.user.username}&user=${encodeURIComponent(message.member.displayName)}&gender=Male`)

                .then(res => res.json())
                    .then(data => {
                        return message.sendT(`${data.message.replace('Deltaa','Pauldb09')}`);
                    });
            } catch (error) {
                console.error(error);
                message.errorMessage(`Le chatbot ne peut pas recevoir votre requete car votre pseudo contient de caractères spéciaux . Il suffit de changer votre pseudo sur ce serveur.`);
            }
            return;

        }
        const automod = await Welcome.findOne({ serverID: message.guild.id, reason: `automod` })
        if (automod) {
            if (/(discord\.(gg|io|me|li)\/.+|discordapp\.com\/invite\/.+)/i.test(message.content)) {
                if (!message.channel.permissionsFor(message.member).has("MANAGE_MESSAGES")) {
                    message.delete();
                    const verynew = new Warn({
                        serverID: `${message.guild.id}`,
                        manID: `${message.author.id}`,
                        reason: `A Posté une invitation`,
                        date: new Date,
                        moderator: `${client.user.id}`
                    }).save()
                    const reportEmbed = new Discord.MessageEmbed()
                        .setTitle(`😒 Invitation....`)


                    .setDescription(`${message.author} pas d'invitations ici , je vous ai ajouté 1 warn , à 3 , c'est le ban `)



                    .setFooter(client.footer)

                    .setColor("#DA7226");
                    return message.channel.send(reportEmbed);
                }
            }
        }

        const verifye = await Welcome.findOne({ serverID: message.guild.id, reason: `count`, channelID: message.channel.id })
        if (verifye) {
            if (!message.content && !message.author.bot ||
                message.author.bot && message.author.id !== client.user.id) return message.delete().catch(() => {});
            let argss = message.content.trim().split(/ +/);
            let number = Math.abs(argss[0]);
            if (!number) return message.delete().catch(() => {});
            if (number === NaN || number === Infinity) {
                message.delete().catch(() => {});
            }
            number = Math.round(number);
            const old = await Welcome.findOne({ serverID: message.guild.id, reason: `old_number` })
            if (old) {
                let older = old.channelID;
                let x = `1`;
                let sum = math.evaluate(`${older} + ${x}`)
                if (number !== sum) {
                    message.delete().catch(() => {});
                } else {
                    const old = await Welcome.findOneAndUpdate({ serverID: message.guild.id, reason: `old_number` }, { $set: { channelID: sum } }, { new: true })

                }
            } else {
                if (number !== 1) {
                    message.delete().catch(() => {});
                }
                const verynew = new Welcome({
                    serverID: message.guild.id,
                    reason: `old_number`,
                    channelID: `1`,
                }).save()
            }
            return;
        }
        let prefixedb = await guild.findOne({ serverID: message.guild.id, reason: `prefix` })
        if (prefixedb) {


        } else {
            const verynew = new guild({
                serverID: `${message.guild.id}`,
                content: `${config.prefix}`,
                reason: 'prefix',
            }).save();


        }
        let prefixget = await guild.findOne({ serverID: message.guild.id, reason: `prefix` })
        const prefix = prefixget.content;

        if (!message.content.startsWith(prefix) || message.content.startsWith('!') || message.content.startsWith('^^') || message.content.startsWith('.')) {
            const userdata = await levelModel.findOne({ serverID: message.guild.id, userID: message.author.id })
            if (userdata) {
                if (userdata.xp + 5 > 100) {
                    let levelstsats = await guild.findOne({ serverID: message.guild.id, reason: `level` })
                    if (levelstsats) {
                        const findlc = await guild.findOne({ serverID: message.guild.id, reason: `levelChannel` })
                        if (findlc) {
                            const levelMessagedb = await guild.findOne({ serverID: message.guild.id, reason: `levelMessage` })
                            if (levelMessagedb) {
                                let levelMessage = `${levelMessagedb.content}`
                                    .replace('{user}', message.author)
                                    .replace('{level}', `${userdata.level + 1}`)
                                    .replace('{username}', message.author.username)
                                    .replace('{tag}', message.author.tag)
                                    .replace('{server}', message.guild.name)
                                    .replace('{messagesCount}', userdata.messagec + 1);
                                if (findlc.content === 'current') {
                                    message.channel.send(levelMessage)
                                } else {
                                    let get = message.guild.channels.cache.get(findlc.content)
                                    if (get) get.send(levelMessage)
                                }

                            } else {
                                let get = message.guild.channels.cache.get(findlc.content)
                                if (get) get.send(`GG ${message.author} , tu viens de passer un niveau ! Tu es désormais au niveau ${userdata.level + 1} !`)

                            }


                        } else {

                        }
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

        }

        const ischannel = await Welcome.findOne({ serverID: message.guild.id, reason: `interchat` })
        if (ischannel) {
            if (ischannel.channelID === message.channel.id) {
                const serv = await Welcome.findOne({ serverID: message.guild.id, reason: `interchat-s` })
                if (!serv) {
                    const reportEmbed = new Discord.MessageEmbed()
                        .setTitle(`Interchat : Erreur`)


                    .setDescription(`Vous avez défini le salon de l'interchat mais pas un serveur correspondant !
            Veuillez faire : \`${prefix}interchat-server <id>\``)



                    .setFooter(client.footer)

                    .setColor("#DA7226");
                    return message.channel.send(reportEmbed);
                } else {
                    let oserver = client.guilds.cache.get(serv.channelID)
                    if (!oserver) {
                        const reportEmbed = new Discord.MessageEmbed()
                            .setTitle(`Interchat : Erreur`)


                        .setDescription(`Je ne trouve plus le serveur de l'interchat , il a a peut être été supprimé ou j'ai quitté ce serveur...`)



                        .setFooter(client.footer)

                        .setColor("#DA7226");
                        return message.channel.send(reportEmbed);
                    } else {
                        const ochannel = await Welcome.findOne({ serverID: oserver.id, reason: `interchat` })
                        if (ochannel) {
                            let dchannel = oserver.channels.cache.get(ochannel.channelID)
                            if (dchannel) {
                                if (message.content === 'info') {
                                    const reportEmbed = new Discord.MessageEmbed()
                                        .setTitle(`Interchat : Info`)


                                    .setDescription(`Vous êtes actuellement en interchat avec le serveur **${oserver.name}**
                                    ${oserver.channels.cache.size} salons
                                    ${oserver.roles.cache.size} roles
                     `)



                                    .setFooter(client.footer)

                                    .setColor(client.color);
                                    return message.channel.send(reportEmbed);
                                }
                                let avatar = message.author.displayAvatarURL({ dynamic: true });

                                function getLinks(attachments) {
                                    const valid = /^.*(gif|png|jpg|jpeg0)$/g
                                    return attachments.array()
                                        .filter(attachments => valid.test(attachments.url))
                                        .map(attachments => attachments.url);
                                }
                                dchannel.createWebhook(message.author.username, { avatar: avatar }).then(msgWebhook => {
                                    const files = getLinks(message.attachments);
                                    msgWebhook.send(message.content, files)


                                    setTimeout(function() {
                                        msgWebhook.delete()
                                    }, 1000 * 5)
                                })
                            }
                        }
                    }
                }


            }
        }
        const mentionRegex = RegExp(`^<@!${client.user.id}>$`);
        if (message.content.match(mentionRegex)) {


            return message.mainMessage(`Eh je suis \`${message.client.user.username}\` et mon préfixe est \`${prefix}\` , faites \`${prefix}help\` pour la liste des commandes !`);
        }
        message.mentions.users.forEach(async(u) => {
            let afkdb = await guild.findOne({ serverID: u.id, reason: `afk` })
            if (afkdb) {
                message.mainMessage(` ${u.tag} est afk pour la raison : \`${afkdb.content}\``);

            }
        });
        if (message.content.startsWith(prefix) || message.content.startsWith(`green `) || message.content.startsWith(`<@783708073390112830> `)) {
            let args;
            if (message.content.startsWith(prefix)) {
                args = message.content.slice(prefix.length).trim().split(/ +/);

            }
            if (message.content.startsWith(`green `)) {
                let text = `green `

                args = message.content.slice(6).trim().split(/ +/);

            }
            if (message.content.startsWith(`<@783708073390112830> `)) {
                let text = `<@783708073390112830> `
                args = message.content.slice(text.length).trim().split(/ +/);

            }
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
                    return message.errorMessage(`Il manque au bot la permission \`EMBED_LINKS\` , qui permet de faire des embeds . Veuillez lui la donner pour son bon fonctionnement.`);

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
            if (message.author.id !== '688402229245509844') {
                if (permissions) {
                    if (typeof permissions === 'string') {
                        permissions = [permissions]
                    }

                    validatePermissions(permissions);
                    for (const permission of permissions) {
                        if (!message.member.hasPermission(permission) && message.author.id !== '688402229245509844') {
                            return message.errorMessage(`Vous devez avoir les permissions suivantes pour faire cette commande : \`${permission}\``);

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
                            return message.errorMessage(`Il manque au bot la permission \`${permission}\` pour utiliser cette commande`);

                        }
                    }
                }
            }
            if (command.adventure) {
                let advdb = await adventure.findOne({ UserID: message.author.id, active: true })
                if (!advdb) return message.errorMessage(`Vous devez déja commencer une quête... faite ${prefix}quete-start pour commencer 😉`)
            }
            if (command.guildOnly && message.channel.type === 'dm') {
                return message.reply(`${emoji.error} - je ne peux pas faire cette commande en MP.... !`);
            }
            if (command.owner && message.author.id !== config.ownerID) {
                return message.errorMessage(`Tu dois etre owner du bot pour faire cette commande !`);
            }
            if (command.args === 'user' && !message.mentions.members.first()) {
                if (message.guild.members.cache.get(args[0])) {

                } else {

                    let reply = `${emoji.error}  - Cette commande requiert des arguments , ${message.author}!`;

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
                        .setTitle(`${emoji.error} - Erreur d'utlisation`)



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
                    return message.errorMessage(`Merci d'attendre encore ${timeLeft.toFixed(1)} secondes avant de réutliser la commande \`${command.name}\` `);
                }
            }

            timestamps.set(message.author.id, now);
            setTimeout(() => timestamps.delete(message.author.id), cooldownAmount);

            try {
                command.execute(message, args, );
            } catch (error) {
                console.error(error);
                message.errorMessage(`Une erreur est survenue lors de l'éxécution de la commande . Veuillez rejoindre le support pour signaler cette erreur :
            https://discord.gg/nrReAmApVJ`);
            }
        }
    }
};