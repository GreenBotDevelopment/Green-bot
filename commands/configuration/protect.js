const Discord = require('discord.js');
const Welcome = require('../../database/models/Welcome');
module.exports = {
        name: 'protect',
        description: 'Active ou désactive un protection sur le serveur',
        usage: 'enableAll/disableAll',
        exemple: 'enableAll',
        cat: 'antiraid',
        permissions: ['MANAGE_GUILD'],
        async execute(message, args) {
            if (!args.length) {
                const verifydc = await Welcome.findOne({ serverID: message.guild.id, reason: `anti_dc` })
                const verifyPub = message.guild.settings.protections.anti_pub
                const verifyMaj = await Welcome.findOne({ serverID: message.guild.id, reason: `anti_majs` })
                const verifyMention = await Welcome.findOne({ serverID: message.guild.id, reason: `anti_mentions` })
                const verifySpam = await Welcome.findOne({ serverID: message.guild.id, reason: `anti_spam` })
                let tip = await message.translate("DASHBOARD")
                let cfg = await message.translate("ACTUAL_CONFIG")
                let embedX = new Discord.MessageEmbed()
                    .setAuthor(`${message.author.username}`, message.author.displayAvatarURL({ dynamic: true, size: 512 }))
                    .setColor("#F0B02F")
                    .setTitle(`${message.guild.settings.lang === "fr" ? "Protections du serveur":"Server protections"}`)
                    .setDescription(tip)
                    .addField(cfg.title, `Anti DC : ${verifydc ? "<:IconSwitchIconOn:825378657287274529>": "<:icon_SwitchIconOff:825378603252056116>"}\nAnti Pub : ${verifyPub ? "<:IconSwitchIconOn:825378657287274529>": "<:icon_SwitchIconOff:825378603252056116>"}\nAnti Spam : ${verifySpam ? "<:IconSwitchIconOn:825378657287274529>": "<:icon_SwitchIconOff:825378603252056116>"}\nAnti Majs : ${verifyMaj ? "<:IconSwitchIconOn:825378657287274529>": "<:icon_SwitchIconOff:825378603252056116>"}\nAnti Mentions : ${verifyMention ? "<:IconSwitchIconOn:825378657287274529>": "<:icon_SwitchIconOff:825378603252056116>"}`)
                    .addField(`${message.guild.settings.lang === "fr" ? "`📜` Utilisation":"`📜` Use"}`, `\`${message.guild.settings.prefix}protect enableAll\` : ${message.guild.settings.lang === "fr" ? "Pour activer toutes les protections.":"To enable every protection"} \n\`${message.guild.settings.prefix}protect disableAll\` : ${message.guild.settings.lang === "fr" ? "Pour désactiver toutes les protections":"To disable every protection"}`)
                    .setURL("https://top.gg/bot/783708073390112830/vote")
                    .setThumbnail(url = message.client.user.displayAvatarURL({ dynamic: true, size: 512 }))
                    .setFooter(message.client.footer, message.client.user.displayAvatarURL({ dynamic: true, size: 512 }))
                message.channel.send({ embeds: [embedX] }).then((m) => {
                if (!message.channel.permissionsFor(message.guild.me).has("MANAGE_MESSAGES")) return;
                if (!message.channel.permissionsFor(message.guild.me).has("ADD_REACTIONS")) return;
                m.react("✅")
                const filter = (reaction, user) => reaction.emoji.name === '✅' && user.id === message.author.id;
                const collector = m.createReactionCollector({ filter, time: 1000000 });
                collector.on('collect', r => m.delete());
                collector.on('end', collected => m.reactions.removeAll());
            });
            return;
        } else {
            if (args[0] === "enableAll") {
                let embedA = new Discord.MessageEmbed()
                    .setAuthor(`${message.author.username}`, message.author.displayAvatarURL({ dynamic: true, size: 512 }))
                     .setColor("#F0B02F")
                    .setTitle(`${message.guild.settings.lang === "fr" ? "Activation des protections":"Enabling protections"}`)
                    .setDescription(`<a:green_loading:824308769713815612> ${message.guild.settings.lang === "fr" ? "Activation des protections en cours":"Protections enabling in progress"}`)
                    .setFooter(message.client.footer, message.client.user.displayAvatarURL({ dynamic: true, size: 512 }))
                let msg1 = await message.channel.send({ embeds: [embedA] })
                const sentences = {
                    "a": { "en": "⚠ Sorry {user} , but your account is too new to access the **{server}**, it must be created at least **{days}** days ago", "fr": "⚠ Désolé {user} , mais ton compte est trop récent pour accéder au serveur **{server}**, il doit être crée depuis au moins **{days}** jours" },
                    "b": { "en": "⚠ Attention {user} you mention too many people in your message! If you continue I will be forced to sanction you...", "fr": "⚠ Attention {user} , tu mentionnes trop de personnes dans ton message ! Si tu continues je serait obligé de te sanctionner..." },
                    "c": { "en": "⚠ Attention {user} you put too many capital letters in your message! If you continue I will be forced to sanction you...", "fr": "⚠ Attention {user} , tu met trop de majuscules dans ton message ! Si tu continues je serait obligé de te sanctionner..." },
                    "d": { "en": "⚠ Attention {user} you are sending messages too fast! If you continue I will be forced to sanction you...", "fr": "⚠ Attention {user} , tu envoies des messages trop vite  ! Si tu continues je serait obligé de te sanctionner..." },
                }
                const verifydc = await Welcome.findOne({ serverID: message.guild.id, reason: `anti_dc` })
                const verifyPub = await Welcome.findOne({ serverID: message.guild.id, reason: `anti-invite` })
                const verifyMaj = await Welcome.findOne({ serverID: message.guild.id, reason: `anti_majs` })
                const verifyMention = await Welcome.findOne({ serverID: message.guild.id, reason: `anti_mentions` })
                const verifySpam = await Welcome.findOne({ serverID: message.guild.id, reason: `anti_spam` })
                if (!verifydc) {
                    const verynew = new Welcome({
                        serverID: `${message.guild.id}`,
                        reason: 'anti_dc',
                        channelID: `ptdr`,
                        message: `${sentences.a[message.guild.settings.lang]}`,
                        image: `15`,
                    }).save();
                }
                if (!verifyMention) {
                    const verynew1 = new Welcome({
                        serverID: `${message.guild.id}`,
                        channelID: `5`,
                        reason: 'anti_mentions',
                        message: `${sentences.b[message.guild.settings.lang]}`,
                        image: `5`,
                    }).save();
                }
                if (!verifyMaj) {
                    const verynew3 = new Welcome({
                        serverID: `${message.guild.id}`,
                        channelID: `5`,
                        reason: 'anti_majs',
                        message: `${sentences.c[message.guild.settings.lang]}`,
                        image: `70`,
                    }).save();
                }
                if (!verifyPub) {
                    const verynew4 = new Welcome({
                        serverID: `${message.guild.id}`,
                        reason: 'anti-invite',
                        channelID: 'fdp',
                    }).save();
                }
                if (!verifySpam) {
                    const verynew22 = new Welcome({
                        serverID: `${message.guild.id}`,
                        channelID: `5`,
                        reason: 'anti_spam',
                        message: `${sentences.d[message.guild.settings.lang]}`,
                        image: `6`,
                    }).save();
                }
                let embedAA = new Discord.MessageEmbed()
                    .setAuthor(`${message.author.username}`, message.author.displayAvatarURL({ dynamic: true, size: 512 }))
                    .setColor("#F0B02F")
                    .setTitle(`<:green_members:811167997023485973> ${message.guild.settings.lang === "fr" ? "Activation terminée":"Activation completed"}`)
                    .setDescription(`${message.guild.settings.lang === "fr" ? "Toutes les protections non activées ont été activées":"All non-activated protections have been activated"}`)
                    .setFooter(message.client.footer, message.client.user.displayAvatarURL({ dynamic: true, size: 512 }))
                return msg1.edit({ embeds: [embedAA] })
            } else if (args[0] === "disableAll") {
                let embedWW = new Discord.MessageEmbed()
                    .setAuthor(`${message.author.username}`, message.author.displayAvatarURL({ dynamic: true, size: 512 }))
                    .setColor("#F0B02F")
                    .setTitle(`${message.guild.settings.lang === "fr" ? "Désactivation des protections":"Disabling protections"}`)
                    .setDescription(`<a:green_loading:824308769713815612> ${message.guild.settings.lang === "fr" ? "Désactivation des protections en cours":"Protections disabling in progress"}`)
                    .setFooter(message.client.footer, message.client.user.displayAvatarURL({ dynamic: true, size: 512 }))
                let msg1 = await message.channel.send({ embeds: [embedWW] })
                const verifydc = await Welcome.findOne({ serverID: message.guild.id, reason: `anti_dc` })
                const verifyPub = await Welcome.findOne({ serverID: message.guild.id, reason: `anti-invite` })
                const verifyMaj = await Welcome.findOne({ serverID: message.guild.id, reason: `anti_majs` })
                const verifyMention = await Welcome.findOne({ serverID: message.guild.id, reason: `anti_mentions` })
                const verifySpam = await Welcome.findOne({ serverID: message.guild.id, reason: `anti_spam` })
                if (verifydc) {
                    const verifydc1 = await Welcome.findOneAndDelete({ serverID: message.guild.id, reason: `anti_dc` })
                }
                if (verifyMention) {
                    const verifyMentionA = await Welcome.findOneAndDelete({ serverID: message.guild.id, reason: `anti_mentions` })
                }
                if (verifyMaj) {
                    const verifyMajA = await Welcome.findOneAndDelete({ serverID: message.guild.id, reason: `anti_majs` })
                }
                if (verifyPub) {
                    const verifyPubA = await Welcome.findOneAndDelete({ serverID: message.guild.id, reason: `anti-invite` })
                }
                if (verifySpam) {
                    const verifySpamA = await Welcome.findOneAndDelete({ serverID: message.guild.id, reason: `anti_spam` })
                }
                let embedD = new Discord.MessageEmbed()
                    .setAuthor(`${message.author.username}`, message.author.displayAvatarURL({ dynamic: true, size: 512 }))
                     .setColor("#F0B02F")
                    .setTitle(`<:green_members:811167997023485973> ${message.guild.settings.lang === "fr" ? "Désactivation terminée":"Deactivation completed"}`)
                    .setDescription(`${message.guild.settings.lang === "fr" ? "Toutes les protections activées ont été désactivées":"All activated protections have been disabled"}`)
                    .setFooter(message.client.footer, message.client.user.displayAvatarURL({ dynamic: true, size: 512 }))
                return msg1.edit({ embeds: [embedD] })
            }
        }
    },
};