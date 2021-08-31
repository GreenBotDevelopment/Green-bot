const Discord = require('discord.js');
const { Permissions } = require('discord.js');
const counter = require('../../database/models/counter')

module.exports = {
        name: 'counter',
        description: 'Défini le compteur de membres',
        aliases: ['setcount', 'membercount'],
        cat: 'configuration',
        guildOnly: true,
        usage: 'create/delete/refresh',
        exemple: 'create',
        permissions: ['MANAGE_GUILD'],
        async execute(message, args) {
            const lang = await message.translate("MEMBERCOUNT")
            if (!args.length) {
                let tip = await message.translate("DASHBOARD")
                let embed = new Discord.MessageEmbed()
                    .setAuthor(`${message.author.username}`, message.author.displayAvatarURL({ dynamic: true, size: 512 }))
                    .setColor("#F0B02F")
                    .setTitle(lang.title)
                    .setDescription(tip)
                    .addField(`${message.guild.settings.lang === "fr" ? "`📜` Utilisation":"`📜` Use"}`, lang.desc.replace("{prefix}", message.guild.settings.prefix).replace("{prefix}", message.guild.settings.prefix).replace("{prefix}", message.guild.settings.prefix))
                    .setThumbnail(url = message.client.user.displayAvatarURL({ dynamic: true, size: 512 }))
                    .setFooter(message.client.footer, message.client.user.displayAvatarURL({ dynamic: true, size: 512 }))
                message.reply({ embeds: [embed], allowedMentions: { repliedUser: false } }).then((m) => {
                if (!message.channel.permissionsFor(message.guild.me).has("MANAGE_MESSAGES")) return;
                if (!message.channel.permissionsFor(message.guild.me).has("ADD_REACTIONS")) return;
                m.react("✅")
                const filter = (reaction, user) => reaction.emoji.name === '✅' && user.id === message.author.id;
                const collector = m.createReactionCollector({ filter, time: 1000000 });
                collector.on('collect', r => m.delete());
                collector.on('end', collected => m.reactions.removeAll());
            });
            return;
        }
        if (message.guild.memberCount !== message.guild.members.cache.size) await message.guild.members.fetch()
        if (args[0] === 'delete') {
            const verify = await counter.findOne({ serverID: message.guild.id })
            let pos = 0;
            if (verify) {
                let member = message.guild.channels.cache.get(verify.MembersID)
                if (member) {
                    pos = pos + 1;
                    member.delete()
                }
                let bot = message.guild.channels.cache.get(verify.totalID)
                if (bot) {
                    pos = pos + 1;
                    bot.delete()
                }
                let total = message.guild.channels.cache.get(verify.BotsID)
                if (total) {
                    pos = pos + 1;
                    total.delete()
                }
                let categoria = message.guild.channels.cache.find(c => c.name == `${message.guild.settings.lang === "fr" ? "🌟 Stats du serveur":"🌟 Server stats"}` && c.type == "GUILD_CATEGORY");
                if (categoria) await categoria.delete()
                const del = await counter.findOneAndDelete({ serverID: message.guild.id })
                if (pos == 3) {
                    return message.succesMessage(lang.deleted)
                } else {
                    return message.succesMessage(lang.delete.replace("{pos}", pos))
                }
            } else {
                return message.errorMessage(lang.not)
            }
        } else if (args[0] === 'create') {
            const verify = await counter.findOne({ serverID: message.guild.id })
            if (verify) {
                return message.errorMessage(lang.already.replace("{prefix}", message.guild.settings.prefix))
            } else {
                const members = message.guild.members.cache;
                let categoria = message.guild.channels.cache.find(c => c.name == `${message.guild.settings.lang === "fr" ? "🌟 Stats du serveur":"🌟 Server stats"}` && c.type == "GUILD_CATEGORY");
                if (!categoria) categoria = await message.guild.channels.create(`${message.guild.settings.lang === "fr" ? "🌟 Stats du serveur":"🌟 Server stats"}`, {
                    type: "GUILD_CATEGORY",
                    position: 1,
                    permissionOverwrites: [{
                            id: message.guild.id,
                            deny: ['CONNECT', 'SPEAK'],
                            allow: ['VIEW_CHANNEL'],
                        },
                    ],
                }).catch();
                message.guild.channels.create(`👦 ${message.guild.settings.lang === "fr" ? "Humains":"Humans"}: ${members.filter(member => !member.user.bot).size}`, { type: "GUILD_VOICE", parent: categoria.id }).then(
                    (chan1) => {
                        message.guild.channels.create(`🤖 Bots: ${members.filter(member => member.user.bot).size}`, { type: "GUILD_VOICE", parent: categoria.id }).then(
                            (chan2) => {
                                message.guild.channels.create(`🌎 ${message.guild.settings.lang === "fr" ? "Count":"count"}: ${message.guild.memberCount}`, { type: "GUILD_VOICE", parent: categoria.id }).then(
                                    (chan3) => {
                                        const verynew = new counter({
                                            serverID: `${message.guild.id}`,
                                            MembersID: `${chan1.id}`,
                                            BotsID: `${chan2.id}`,
                                            totalID: `${chan3.id}`
                                        }).save();
                                        return message.succesMessage(lang.create)
                                    });
                            });
                    });
            }
        } else if (args[0] === 'refresh') {
            const verify = await counter.findOne({ serverID: message.guild.id })
            if (verify) {
                let pos = 0;
                const members = message.guild.members.cache;
                let member = message.guild.channels.cache.get(verify.MembersID)
                if (member) {
                    pos = pos + 1;
                    member.edit({ name: `👦 ${message.guild.settings.lang === "fr" ? "Humains":"Humans"}: ${members.filter(member => !member.user.bot).size}` })
                }
                let bot = message.guild.channels.cache.get(verify.totalID)
                if (bot) {
                    pos = pos + 1;
                    bot.edit({ name: `🌎 ${message.guild.settings.lang === "fr" ? "Count":"count"}: ${message.guild.memberCount}` })
                }
                let total = message.guild.channels.cache.get(verify.BotsID)
                if (total) {
                    pos = pos + 1;
                    total.edit({ name: `🤖 Bots: ${members.filter(member => member.user.bot).size}` })
                }
                if (pos == 3) {
                    return message.succesMessage(lang.refreshed)
                } else {
                    return message.succesMessage(lang.refresh.replace("{pos}", pos))
                }
            } else {
                return message.errorMessage(lang.not)
            }
        } else {
            let tip = await message.translate("DASHBOARD")
                let embed = new Discord.MessageEmbed()
                    .setAuthor(`${message.author.username}`, message.author.displayAvatarURL({ dynamic: true, size: 512 }))
                    .setColor("#F0B02F")
                    .setTitle(lang.title)
                    .setDescription(tip)
                    .addField(`${message.guild.settings.lang === "fr" ? "`📜` Utilisation":"`📜` Use"}`, lang.desc.replace("{prefix}", message.guild.settings.prefix).replace("{prefix}", message.guild.settings.prefix).replace("{prefix}", message.guild.settings.prefix))
                    .setThumbnail(url = message.client.user.displayAvatarURL({ dynamic: true, size: 512 }))
                    .setFooter(message.client.footer, message.client.user.displayAvatarURL({ dynamic: true, size: 512 }))
                message.reply({ embeds: [embed], allowedMentions: { repliedUser: false } }).then((m) => {
                if (!message.channel.permissionsFor(message.guild.me).has("MANAGE_MESSAGES")) return;
                if (!message.channel.permissionsFor(message.guild.me).has("ADD_REACTIONS")) return;
                m.react("✅")
                const filter = (reaction, user) => reaction.emoji.name === '✅' && user.id === message.author.id;
                const collector = m.createReactionCollector({ filter, time: 1000000 });
                collector.on('collect', r => m.delete());
                collector.on('end', collected => m.reactions.removeAll());
            });
            return;
        }
    },
};