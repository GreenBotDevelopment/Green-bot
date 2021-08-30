const { resolveCategory } = require("../../util/functions");

const Discord = require("discord.js"),
    CmdModel = require("../../database/models/cmd"),
    a = {

        "VIEW_CHANNEL": { "en": "View Channels", "fr": "Voir les salons" },
        "MANAGE_CHANNELS": { "en": "Manage Channels", "fr": "Gérer les salons" },
        "MANAGE_ROLES": { "en": "Manage Roles", "fr": "Gérer les rôles" },
        "MANAGE_EMOJIS": { "en": "Manage Emojis and Stickers", "fr": "Gérer les emojis et les autocollants" },
        "VIEW_AUDIT_LOG": { "en": "View Audit Log", "fr": "Voir les logs du serveur" },
        "VIEW_GUILD_INSIGHTS": { "en": "View Server insights", "fr": "Voir les analyses du serveur" },
        "MANAGE_WEBHOOKS": { "en": "Manage Webhooks", "fr": "Gérer les webhooks" },
        "MANAGE_GUILD": { "en": "Manage Server", "fr": "Gérer le serveur" },
        "CREATE_INSTANT_INVITE": { "en": "Create Invite", "fr": "Créer une invitation" },
        "CHANGE_NICKNAME": { "en": "Change Nickname", "fr": "Changer le pseudo" },
        "MANAGE_NICKNAMES": { "en": "Manage Nicknames", "fr": "Gérers le pseudos" },
        "KICK_MEMBERS": { "en": "Kick Members", "fr": "Expulser des membres" },
        "BAN_MEMBERS": { "en": "Ban Members", "fr": "Bannir des membres" },
        "SEND_MESSAGES": { "en": "Send Messages", "fr": "Envoyer des messages" },
        "EMBED_LINKS": { "en": "Embed Links", "fr": "Intégrer des liens" },
        "ATTACH_FILES": { "en": "Attach Files", "fr": "Joindre des fichiers" },
        "ADD_REACTIONS": { "en": "Add Reaction", "fr": "Ajouter des réactions" },
        "USE_EXTERNAL_EMOJIS": { "en": "Use External Emoji", "fr": "Utiliser des émojis exteriens" },
        "MENTION_EVERYONE": { "en": "Mention @everyone, @here and All Roles", "fr": "Mentionner @everyone, @here et tous les rôles" },
        "MANAGE_MESSAGES": { "en": "Manage Messages", "fr": "Gérer les messages" },
        "READ_MESSAGE_HISTORY": { "en": "Read Message History", "fr": "Voir les anciens messages" },
        "SEND_TTS_MESSAGES": { "en": "Sans Text-to-Speech Messages", "fr": "Envoyer des messages de synthèse vocale" },
        "USE_APPLICATION_COMMANDS": { "en": "Use Slash Commands", "fr": "Utiliser les commandes slash" },
        "CONNECT": { "en": "Connect", "fr": "Se connecter" },
        "SPEAK": { "en": "Speak", "fr": "Parler" },
        "STREAM": { "en": "Video", "fr": "Vidéo" },
        "USE_VAD": { "en": "Use Voice Activity", "fr": "Utiliser la Détection de la voix" },
        "PRIORITY_SPEAKER": { "en": "Priority Speaker", "fr": "Voix prioritaire" },
        "MUTE_MEMBERS": { "en": "Mute Members", "fr": "Rendre les membres muets" },
        "DEAFEN_MEMBERS": { "en": "Deafen Members", "fr": "Mettre en sourdine des membres" },
        "MOVE_MEMBERS": { "en": "Move Members", "fr": "Délpacer des membres" },
        "REQUEST_TO_SPEAK": { "en": "Request to Speak", "fr": "Demande de prise de parole" },
        "MANAGE_THREADS": { "en": "Manage Threads", "fr": "Gérer les threads" },
        "USE_PUBLIC_THREADS": { "en": "Use Publics Threads", "fr": "Utiliser les threads publics" },
        "USE_PRIVATE_THREADS": { "en": "Use Private Threads", "fr": "Utiliser les threads privés" },
        "ADMINISTRATOR": { "en": "Administrator", "fr": "Administrateur" }
    };
module.exports = {
        name: "help",
        description: "  Affiche une liste de toutes les commandes actuelles, triées par catégorie. Peut être utilisé en conjonction avec une commande pour plus d'informations.",
        aliases: ["commands", "aide", "cmd", "h"],
        usage: "[command name]",
        usages: ["help <command>", "help <category>", "help commands"],
        guildOnly: true,
        cat: "utilities",
        async execute(e, s, client, guildDB) {
            if (!s.length) {
                let r = await e.translate("HELP_LIENS_UTILES"),
                    lang = await e.translate("HELP_COMMAND")
                l = await e.translate("CLIQ");
                const embed = new Discord.MessageEmbed()
                    .setTitle(lang.title)
                    .setURL(client.links.commands)
                    .setColor(e.guild.settings.color)
                    .setAuthor(e.author.username, e.author.displayAvatarURL({ dynamic: !0, size: 512 }))
                    .setFooter(client.footer, e.client.user.displayAvatarURL({ dynamic: !0, size: 512 }))
                    .setDescription(lang.desc.replace("{guild}", e.guild.name).replace("{prefix}", e.guild.settings.prefix).replace("{prefix}", e.guild.settings.prefix).replace("{prefix}", e.guild.settings.prefix).replace("{prefix}", e.guild.settings.prefix).replace("{prefix}", e.guild.settings.prefix).replace("{prefix}", e.guild.settings.prefix))
                    .addField(`${r[0]}`, `[\`${l}\`](${client.links.website})`, !0)
                    .addField(`${r[1]}`, `[\`${l}\`](${client.links.support})`, !0)
                    .addField(`${r[2]}`, `[\`${l}\`](${client.links.invite})`, !0);
                let sended = true;
                e.author.send({ embeds: [embed] }).catch((err) => {
                    e.channel.send({ embeds: [embed] })
                    sended = null
                }).then(m => {
                    if (sended) return e.reply({ content: lang.dm, })
                })
            } else {
                const t = client.commands
                const c = s[0].toLowerCase(),
                    u = t.get(c) || t.find((e) => e.aliases && e.aliases.includes(c));
                if (c === "commands" || c === "all" || c === "commande" || c === "commandess") {
                    console.log("bAH")
                    const { commands: t } = e.client;
                    let r = await e.translate("HELP_LIENS_UTILES"),
                        l = await e.translate("CLIQ"),
                        o = await e.translate("HELP_FOOTER"),
                        x = await e.translate("HELP_TIP");
                    d = await e.translate("COMMANDS_LIST");
                    const m = e.guild.settings.prefix;
                    let E = await e.translate("HELP_CAT");
                    const p = new Discord.MessageEmbed()
                        .setColor(e.guild.settings.color)
                        .setAuthor(e.author.username, e.author.displayAvatarURL({ dynamic: !0, size: 512 }))
                        .setFooter(o.replace("{prefix}", m), e.client.user.displayAvatarURL({ dynamic: !0, size: 512 }))
                        .addFields({
                            name: " Antiraid  ",
                            value: t
                                .filter((e) => "antiraid" === e.cat)
                                .map((e) => `\`${e.name}\``)
                                .join(", "),
                        })
                        .addFields({
                            name: ` ${E[0]}  `,
                            value: t
                                .filter((e) => "moderation" === e.cat)
                                .map((e) => `\`${e.name}\``)
                                .join(", "),
                        })
                        .setDescription(x.replace("{lang}", e.guild.settings.lang).replace("{prefix}", m))
                        .addFields({
                            name: " Configuration  ",
                            value: t
                                .filter((e) => "configuration" === e.cat)
                                .map((e) => `\`${e.name}\``)
                                .join(", "),
                        })
                        .addFields({
                            name: ` ${E[1]} `,
                            value: t
                                .filter((e) => "music" === e.cat)
                                .map((e) => `\`${e.name}\``)
                                .join(", "),
                        })
                        .addFields({
                            name: ` ${E[2]}  `,
                            value: t
                                .filter((e) => "levelling" === e.cat)
                                .map((e) => `\`${e.name}\``)
                                .join(", "),
                        });


                    if (e.guild.settings.games_enabled !== null) {
                        p.addFields({
                            name: ` ${E[4]}  `,
                            value: t
                                .filter((e) => "games" === e.cat)
                                .map((e) => `\`${e.name}\``)
                                .join(", "),
                        })
                    }
                    if (e.guild.settings.util_enabled !== null) {
                        p.addFields({
                            name: `${E[3]}  `,
                            value: t
                                .filter((e) => "utilities" === e.cat)
                                .map((e) => `\`${e.name}\``)
                                .join(", "),
                        });
                    }
                    p.addField(`${r[0]}`, `[\`${l}\`](https://green-bot.app/)`, !0),
                        p.addField(`${r[1]}`, `[\`${l}\`](https://discord.gg/nrReAmApVJ)`, !0),
                        p.addField(`${r[2]}`, `[\`${l}\`](https://discord.com/oauth2/authorize?client_id=783708073390112830&permissions=8&scope=bot)`, !0),
                        e.reply({ embeds: [p], allowedMentions: { repliedUser: false } }).catch(async(s) => {
                            console.log(s)
                        })

                    return
                }
                if (!u || u.cat === "owner" || u.owner) {
                    const checkCat = await resolveCategory(c, client)
                    if (checkCat) {
                        if (client.devMode.enabled) console.log(checkCat)
                        if (checkCat.name === "games" && e.guild.settings.games_enabled !== true) {
                            let language = await e.translate("CAT_DISABLED")
                            const embed = new Discord.MessageEmbed()
                                .setAuthor(`${e.member.user.tag}`, e.member.user.displayAvatarURL())
                                .setDescription(`${language.desc} ${e.member.permissions.has("MANAGE_GUILD") ? `${language.admin.replace("{guildID}", `${e.guild.id}`)}`:""}`)
                                .setTitle(language.title)
                                .setColor(e.guild.settings.color)
                                .setFooter(`${e.client.footer}`, e.client.user.displayAvatarURL({ dynamic: true, size: 512 }))
                            return e.reply({ embeds: [embed], allowedMentions: { repliedUser: false } })
                        } else if (checkCat.name === "utilities" && e.guild.settings.util_enabled == null) {
                            let language = await e.translate("CAT_DISABLED")
                            const embed = new Discord.MessageEmbed()
                                .setAuthor(`${e.member.user.tag}`, e.member.user.displayAvatarURL())
                                .setDescription(`${language.desc} ${e.member.permissions.has("MANAGE_GUILD") ? `${language.admin.replace("{guildID}", `${e.guild.id}`)}`:""}`)
                                .setTitle(language.title)
                                .setColor(e.guild.settings.color)
                                .setFooter(`${e.client.footer}`, e.client.user.displayAvatarURL({ dynamic: true, size: 512 }))
                            return e.reply({ embeds: [embed], allowedMentions: { repliedUser: false } })
                        }
                        let r = await e.translate("HELP_LIENS_UTILES"),
                            l = await e.translate("CLIQ");
                        const embed = new Discord.MessageEmbed()
                            .setTitle(checkCat.name)
                            .setColor(e.guild.settings.color)
                            .setURL(client.links.commands)
                            .setAuthor(e.author.username, e.author.displayAvatarURL({ dynamic: !0, size: 512 }))
                            .setFooter(client.footer, e.client.user.displayAvatarURL({ dynamic: !0, size: 512 }))
                            .setDescription(`${client.commands.filter(c => c.cat === checkCat.name.toLowerCase()).map(c => `\`${c.name}\``)}`)
                            .addField(`${r[0]}`, `[\`${l}\`](${client.links.website})`, !0)
                            .addField(`${r[1]}`, `[\`${l}\`](${client.links.support})`, !0)
                            .addField(`${r[2]}`, `[\`${l}\`](${client.links.invite})`, !0)
                        return e.reply({ embeds: [embed], allowedMentions: { repliedUser: false } })
                    } else {
                        let s = await e.translate("HELP_ERROR")
                        return e.errorMessage(s.replace("{text}", c));
                    }
                }
                let E = await e.gg(u.description);
                const lang = await e.translate("HELP")

                function link(msg) {
                    return `${msg}`
                };
                const p = new Discord.MessageEmbed()
                    .setTitle(`${u.name}`)
                    .setURL(client.links.commands)
                    .setDescription(E || "No desc")
                    .setFooter(e.client.footer)
                    .setColor(e.guild.settings.color)
                    .addField("> Usage", `${link(`\`${e.guild.settings.prefix}${u.name} ${u.usage || ""}\``)}`, !0)
                    .addField("> Example", `${link(`\`${u.exemple ? `${e.guild.settings.prefix}${u.name} ${u.exemple}` : "No example"}\``)}`, !0)
                    .addField("> Statut", ""+lang.s+": "+u.disabled ? "<:IconSwitchIconOn:825378657287274529>" : "<:icon_SwitchIconOff:825378603252056116>"+"\n Dm: " + `${u.guildOnly ? "<:icon_SwitchIconOff:825378603252056116>" : "<:IconSwitchIconOn:825378657287274529>"}`, !0)
                    .addField("> Aliases", `${link(`\`${u.aliases ? u.aliases.map((e) => `${e}`).join(", ") || "No aliases" : "No aliases"}\``)}`, !0)
                    .addField("> Cooldown", `${link(`${u.cooldown ? `\`${u.cooldown}s\`` : "`3s`"}`)}`, !0)
                    .addField("> Permissions", `${link(`\`${u.permissions ? u.permissions.map((c) => `${a[c][e.guild.settings.lang]}`)||lang.perms : lang.perms}\``)}`)
                    .addField("> Bot permissions", `${link(`\`${u.botpermissions ? `${u.botpermissions.map((c) =>`${a[c][e.guild.settings.lang]}`)||lang.bot}` : lang.bot}\``)}`);
      return e.reply({ embeds: [p] , allowedMentions: { repliedUser: false } })
         }
        
               
            
    },
};