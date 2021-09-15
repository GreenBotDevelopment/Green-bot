const guild = require("../../database/models/guild"),
    levelModel = require("../../database/models/level"),
    Warn = require("../../database/models/warn"),
    fetch = require("node-fetch"),
    math = require("mathjs"),
    config = require("../../config"),
    CmdModel = require("../../database/models/cmd"),
    Welcome = require("../../database/models/Welcome"),
    Discord = require("discord.js"),
    { RateLimiter: RateLimiter } = require("discord.js-rate-limiter"),
    rolesRewards = require("../../database/models/rolesRewards"),
    AutoResponders = require('../../database/models/AutoResponders'),
    AutoReactions = require('../../database/models/AutoReactions');
const permes = require("../../util/permissions.json")
let rateLimiter = new RateLimiter(1, 2e3);
const cooldowns = new Discord.Collection;
require("../../util/extenders.js");
let _users = new Map;
module.exports = {
        async execute(e) {
            const { client: t } = e;
            if (e.author.bot) return;
            if ("DM" == e.channel.type) {
                let t = (new Discord.MessageEmbed).setColor("#F0B02F").setTitle("FAQ").setDescription("" + e.client.user.username + " is an English/french multipropose discord bot\nIf you have any questions, you can join the [Support server](https://green-bot.app/discord)").addField("How to invite me ?", "To invite the bot, click on [this](https://discord.com/oauth2/authorize?client_id=783708073390112830&response_type=code&scope=bot%20identify%20guilds&permissions=8) link.\n                If you don't want to give the `Administrator` permission to green bot, just `Send message`, `Read message history` and `embeds links` are enough", !0).addField("How to use the dashboard ?", 'To go on the dashboard, click on [this](https://green-bot.app) link.\n                `1`. Click on the "Login" button.\n                `2`. You will be redirected. Click on accept\n                `3`. Select a guild in the list and start setup the bot !!', !0).addField("The bot isn't responding to my commands", "If you made a command and after 5 seconds you didn't get any reply, check it :\n                    `1`. The bot has the `Send messages`, `Read message history` and `Embed links` permissions\n                    `2`. Green-bot can view the current channel and send messages\n                    If your problem isn't solved, please join the [Support server](https://green-bot.app/discord) and create a ticket in <#814560562481856512>", !1).setURL("https://discord.com/oauth2/authorize?client_id=783708073390112830&scope=bot&response_type=code").setFooter(e.client.footer, e.client.user.displayAvatarURL({ dynamic: !0, size: 512 }));
                e.reply({ embeds: [t] })
            }
            if (!e.guild) return;
            if (e.guild && !e.member) {
                await e.guild.members.fetch(e.author.id);
            }
            let guildDB = await e.guild.fetchDB();
            let we = await e.guild.fetchOwner()
            e.guild.OWNER = we.id
            const n = guildDB.prefix.slice(0, 4);
            e.guild.settings = guildDB
            e.guild.premium = !!guildDB && !!guildDB.premium, e.guild.premiumuserID = !!guildDB && !!guildDB.premiumUserID && guildDB.premiumUserID;
            if (e.content.match(new RegExp(`^<@!?${e.client.user.id}>( |)$`))) {
                console.log("[32m%s[0m", "PING OF THE BOT ", "[0m", `${e.author.tag} Tryed to ping the bot on ${e.guild.name}`);
                let s = await e.translate("BOT_PERMISSIONS");
                if (!e.guild.me.permissions.has("ADMINISTRATOR")) {
                    if (!e.channel.permissionsFor(e.guild.members.cache.get(t.user.id)).has("SEND_MESSAGES")) {
                        if (!e.guild.members.cache.get(t.user.id).permissions.has("ADMINISTRATOR")) {
                            return e.member.send(s.replace("{perm}", "SEND_MESSAGES"));
                        }
                    }
                    if (!e.channel.permissionsFor(e.guild.members.cache.get(t.user.id)).has("EMBED_LINKS")) {
                        if (!e.guild.members.cache.get(t.user.id).permissions.has("ADMINISTRATOR")) {
                            return e.reply(`\`❌\` ${a.replace("{perm}", "EMBED_LINKS")}`)
                        }
                    }
                    if (!e.channel.permissionsFor(e.guild.members.cache.get(t.user.id)).has("READ_MESSAGE_HISTORY")) {
                        if (!e.guild.members.cache.get(t.user.id).permissions.has("ADMINISTRATOR")) {
                            return e.channel.send(s.replace("{perm}", "READ_MESSAGE_HISTORY"));
                        }
                    }
                }
                let a = await e.translate("HELLO_NEED_HELP");
                e.mainMessage(a.replace("{prefix}", n).replace("{prefix}", n))
                console.log("[32m%s[0m", "PING OF THE BOT ", "[0m", `${e.author.tag} pinged the bot succesfully on ${e.guild.name}`);
                return
            }
            if (e.guild.memberCount !== e.guild.members.cache.size && await e.guild.members.fetch(), e.content.startsWith(n) || e.content.startsWith("green ") || e.content.startsWith("<@!783708073390112830>")) {
                let a;
                e.content.startsWith(n) && (a = e.content.slice(n.length).trim().split(/ +/)), e.content.startsWith("green ") && (a = e.content.slice(6).trim().split(/ +/)), e.content.startsWith("<@!783708073390112830>") && (a = e.content.slice(22).trim().split(/ +/));
                const r = a.shift().toLowerCase(),
                    i = t.commands.get(r) || t.commands.find(e => e.aliases && e.aliases.includes(r));
                if (!i) {
                    let t = await CmdModel.findOne({ serverID: e.guild.id, name: r });
                    if (t) {
                        if ("ok" === t.deleteMessage) {
                            const errMsg = await e.translate("DELETE_ERROR")
                            if (!e.deletable) return e.errorMessage(errMsg);
                            await e.delete().catch(t => e.errorMessage(errMsg))
                        }
                        return e.channel.send(t.text.replace("{user}", e.author).replace(/@(everyone)/gi, "everyone").replace(/@(here)/gi, "here"))
                    }
                    return
                } {
                    //let forced = 0;
                    //if (e.guild.settings.backlist) {
                    //     forced = forced + 1
                    //   if (forced >= 15) return console.log(`${e.guild.name} forced`)
                    // let b = await e.translate("BLACKLIST")
                    //return e.reply({ content: b, allowedMentions: { repliedUser: false } })
                    //}
                    if (e.guild.settings.ignored_channel === e.channel.id) {
                        let b = await e.translate("CHANNEL_IGNORED")
                        return e.reply({ content: b, allowedMentions: { repliedUser: false } })
                    }
                    if (i.disabled) {
                        let b = await e.translate("COMMAND_DISABLED")
                        return e.reply({ content: b, allowedMentions: { repliedUser: false } })
                    }
                    const s = e.guild.members.cache.get(e.author.id);
                    console.log("[32m%s[0m", "COMMANDE ", "[0m", `Commande ${i.name} par ${e.author.tag}  sur ${e.guild.name}\nMessage content:\n${e.content}`);

                    let a = await e.translate("BOT_PERMISSIONS");
                    if (!e.guild.me.permissions.has("ADMINISTRATOR")) {
                        if (!e.channel.permissionsFor(e.guild.members.cache.get(t.user.id)).has("SEND_MESSAGES")) {
                            if (!e.guild.members.cache.get(t.user.id).permissions.has("ADMINISTRATOR")) {
                                return e.member.send(a.replace("{perm}", "SEND_MESSAGES"));
                            }
                        }
                        if (!e.channel.permissionsFor(e.guild.members.cache.get(t.user.id)).has("EMBED_LINKS")) {
                            if (!e.guild.members.cache.get(t.user.id).permissions.has("ADMINISTRATOR")) {
                                return e.reply(`\`❌\` ${a.replace("{perm}", "EMBED_LINKS")}`)
                            }

                        }
                        if (!e.channel.permissionsFor(e.guild.members.cache.get(t.user.id)).has("READ_MESSAGE_HISTORY")) {
                            if (!e.guild.members.cache.get(t.user.id).permissions.has("ADMINISTRATOR")) {
                                return e.member.send(a.replace("{perm}", "READ_MESSAGE_HISTORY"));
                            }
                        }
                    }
                }
                if (rateLimiter.take(e.author.id)) return e.react("<:horloge3:830440548053024789>");
                const o = e => {
                    const t = ["CREATE_INSTANT_INVITE", "KICK_MEMBERS", "BAN_MEMBERS", "ADMINISTRATOR", "MANAGE_CHANNELS", "MANAGE_GUILD", "ADD_REACTIONS", "VIEW_AUDIT_LOG", "PRIORITY_SPEAKER", "STREAM", "VIEW_CHANNEL", "SEND_MESSAGES", "SEND_TTS_MESSAGES", "MANAGE_MESSAGES", "EMBED_LINKS", "ATTACH_FILES", "READ_MESSAGE_HISTORY", "MENTION_EVERYONE", "USE_EXTERNAL_EMOJIS", "VIEW_GUILD_INSIGHTS", "CONNECT", "SPEAK", "MUTE_MEMBERS", "DEAFEN_MEMBERS", "MOVE_MEMBERS", "USE_VAD", "CHANGE_NICKNAME", "MANAGE_NICKNAMES", "MANAGE_ROLES", "MANAGE_WEBHOOKS", "MANAGE_EMOJIS"];
                    for (const s of e)
                        if (!t.includes(s)) return void console.log(`Unknown permission node "${s}"`)
                };
                let l = i.botpermissions;
                if (l) {
                    "string" == typeof l && (l = [l]);
                    let s = await e.translate("BOT_PERMISSIONS");
                    o(l);
                    for (const a of l)
                        if (!e.channel.permissionsFor(e.guild.members.cache.get(t.user.id)).has(a)) {
                            if (!e.guild.members.cache.get(t.user.id).permissions.has("ADMINISTRATOR")) {
                                return e.errorMessage(s.replace("{perm}", permes[a] ? permes[a][e.guild.settings.lang] : a));
                            }
                        }
                }
                let d = await e.translate("MISSING_PERMISSIONS"),
                    c = i.permissions;
                if (c) {
                    "string" == typeof c && (c = [c]), o(c);
                    for (const t of c)
                        if (!e.channel.permissionsFor(e.member).has(t)) {
                            if ("MANAGE_GUILD" !== t) return e.errorMessage(d.replace("{perm}", permes[t] ? permes[t][e.guild.settings.lang] : t)); {
                                let a = await e.translate("MISSING_ROLE");
                                if (!e.guild.settings.admin_role) return e.errorMessage(d.replace("{perm}", permes[t] ? permes[t][e.guild.settings.lang] : t));
                                if (AdminRole = e.guild.roles.cache.get(e.guild.settings.admin_role), !AdminRole) return e.errorMessage(d.replace("{perm}", permes[t] ? permes[t][e.guild.settings.lang] : t));
                                if (!e.member.roles.cache) return e.errorMessage(a.replace("{perm}", permes[t] ? permes[t][e.guild.settings.lang] : t).replace("{role}", AdminRole));
                                if (!e.member.roles.cache.has(AdminRole.id)) return e.errorMessage(a.replace("{perm}", permes[t] ? permes[t][e.guild.settings.lang] : t).replace("{role}", AdminRole))
                            }
                        }
                }
                if (i.owner && e.author.id !== e.client.owner.id) return;
                if (i.premium) {
                    const premiumDB = require("../database/models/premium")
                    const premium = await premiumDB.findOne({ userID: e.author.id })
                    if (!premium) {
                        let language = await e.translate("PREMIUM_REQUIRED")
                        const embed = new Discord.MessageEmbed()
                            .setAuthor(`${e.member.user.tag}`, e.member.user.displayAvatarURL())
                            .setDescription(language.err)
                            .setColor(e.guild.settings.color)
                            .setFooter(`${e.client.footer}`, e.client.user.displayAvatarURL({ dynamic: true, size: 512 }))
                        return e.reply({ embeds: [embed], allowedMentions: { repliedUser: false } })
                    }
                }
               
                    let u = await e.translate("ARGS_REQUIRED");
                    if (i.args && !a.length) {
                        let langUsage;
                        if(i.usages){
                            langUsage = await e.translate("USES")
                        }else{
                            langUsage = await e.translate("USES_SING")
   
                        }
                        const t = (new Discord.MessageEmbed).setAuthor(`${e.author.username}`, e.author.displayAvatarURL({ dynamic: !0, size: 512 })).setDescription(`${u.replace("{command}",r)}\n\n**${langUsage}**\n${i.usages ? `${i.usages.map(x=>`\`${n}${x}\``).join("\n")}` : ` \`${n}${r} ${i.usage} \``}`).setFooter(e.client.footer, e.client.user.displayAvatarURL()).setColor("#F0B02F");
                        return void e.reply({ embeds: [t], allowedMentions: { repliedUser: false } })
                    }
                    cooldowns.has(i.name) || cooldowns.set(i.name, new Discord.Collection);
                    const m = Date.now(),
                        g = cooldowns.get(i.name),
                        h = 1e3 * (i.cooldown || 3);
                    if (g.has(e.author.id)) { const t = g.get(e.author.id) + h; if (m < t) { const s = (t - m) / 1e3; let a = await e.translate("COOLDOWN"); return e.mainMessage(a.replace("{time}", s.toFixed(1)).replace("{command}", r)) } }
                    g.set(e.author.id, m), setTimeout(() => g.delete(e.author.id), h);
                    e.command = i
                    try {
                        i.execute(e, a, t, guildDB), await guild.findOne({ serverID: e.guild.id, reason: "delete_msg" }) && setTimeout(() => { e.delete() }, 1200)
                        return
                    } catch (s) {
                        return e.errorOccurred(s)
                    }
               
            }
            if (e.guild.settings.autopost === e.channel.id && e.crosspostable) {
                e.crosspost()
                    .then(() => console.log('Crossposted message'))
                    .catch(console.error);
                let i = await Welcome.findOne({ serverID: e.guild.id, reason: "logs" });
                if (i) {
                    let a = e.guild.channels.cache.get(i.channelID);
                    if (!a) return;
                    const warnEmbed = new Discord.MessageEmbed()
                        .setAuthor(e.member.user.tag, e.member.user.displayAvatarURL())
                        .setColor("#F0B02F")
                        .setThumbnail(url = e.client.user.displayAvatarURL({ dynamic: true, size: 512 }))
                        .setFooter(e.client.footer, e.client.user.displayAvatarURL({ dynamic: true, size: 512 }))
                        .setDescription(`${e.guild.settings.lang === "en" ? `[This message](${e.url}) has been succesfully posted.`:`[Ce message](${e.url}) a bien été posté.`}`)
                    .setTitle("Autopost")
                a.send({ embeds: [warnEmbed] })
        }
    }
            if (e.guild.settings.chatbot === e.channel.id) {
                if(!e.content) return
                e.content = e.content.replace(/@(everyone)/gi, "everyone").replace(/@(here)/gi, "here");
                let s = await e.translate("BOT_PERMISSIONS");
                if (!e.channel.permissionsFor(e.guild.members.cache.get(t.user.id)).has("SEND_MESSAGES")) return e.member.send(s.replace("{perm}", "SEND_MESSAGES"));
                const a = await fetch(`https://api.udit.gq/api/chatbot?message=${encodeURIComponent(e.content)}&gender=${encodeURIComponent("male")}&name=${encodeURIComponent("Green-bot")}`).catch(async s => {
                    return e.errorOccurred(s)
                });
                let r = (await a.json().catch(async s => {
                        return e.errorOccurred(s)
                    })).message.replace("CleverChat", "Green-bot").replace("male", "male"),
                    n = await e.gg(r);
                e.channel.send(Discord.Util.removeMentions(n));
            }
            if (e.guild.settings.count === e.channel.id) {
                if (!e.content && !e.author.bot || e.author.bot && e.author.id !== t.user.id) return e.delete().catch(() => {});
                let s = e.content.trim().split(/ +/),
                    a = Math.abs(s[0]);
                if (!a) return e.delete().catch(() => {});
                NaN !== a && a !== 1 / 0 || e.delete().catch(() => {}), a = Math.round(a);
                const r = await Welcome.findOne({ serverID: e.guild.id, reason: "old_number" });
                if (r) {
                    let t = r.channelID,
                        s = "1",
                        n = math.evaluate(`${t} + ${s}`);
                    a !== n ? e.delete().catch(() => {}) : await Welcome.findOneAndUpdate({ serverID: e.guild.id, reason: "old_number" }, { $set: { channelID: n } }, { new: !0 })
                } else 1 !== a && e.delete().catch(() => {}), new Welcome({ serverID: e.guild.id, reason: "old_number", channelID: "1" }).save();
                return
            }
            if (e.guild.settings.suggestions === e.channel.id) {
                if (!e.content && !e.author.bot || e.author.bot && e.author.id !== t.user.id) return e.delete().catch(() => {});
                const s = await e.translate("SUGGEST"),
                    a = (new Discord.MessageEmbed).setAuthor(`${s.title}`, e.author.displayAvatarURL({ dynamic: true, size: 512 }))
                    .addField(s.field1Desc1, s.field1Desc2, !0).addField(s.field2, `<@${e.author.id}>`, !0).setDescription(e.content.slice(0, 1900)).setFooter("Green-bot - www.green-bot.app", e.client.user.displayAvatarURL({ dynamic: !0, size: 512 })).setColor("#F0F010");
                e.channel.send({ embeds: [a] }).then(function(t) {
                    t.react("✅"), t.react("❌"),
                        new(require("../../database/models/sugg"))({ autorID: e.author.id, messageID: t.id, serverID: t.guild.id, content: e.content, Date: new Date }).save()
                })
                let welcomedb = await Welcome.findOne({ serverID: e.guild.id, reason: 'sugg_log' })
                if (welcomedb) {
                    let logchannel = e.guild.channels.cache.get(welcomedb.channelID);
                    if (!logchannel) return;
                    const embed = new Discord.MessageEmbed()
                        .setColor(e.guild.settings.color)
                        .setTitle(s.Logstitle1)
                        .setAuthor(`${e.author.username}`, e.author.displayAvatarURL({ dynamic: true, size: 512 }))
                        .setDescription(s.Logsdesc1.replace("{member}", e.author).replace("{reason}", e.content))
                        .setFooter('Suggestion ID: ' + e.id)
                        .setTimestamp();
                    logchannel.send({ embeds: [embed] });
                }
                e.delete().catch(() => {})
            }    
                 

                const s = await e.guild.members.fetch(e.author.id).catch(() => {});
                if (!s.permissions.has("ADMINISTRATOR") && !await guild.findOne({ serverID: e.guild.id, reason: "ignoreds_channel", content: e.channel.id })) {
                    const a = await guild.find({ serverID: e.guild.id, reason: "ignoreds_role" });
                    let r = 0;
                    if (0 !== a.length && a.forEach(e => { s.roles.cache && s.roles.cache.has(e.content) && (r += 1) }), 0 == r) {
                        const s = e.guild.settings.protections.antiraid_logs;
                        let a;
                        s && (a = e.guild.channels.cache.get(e.guild.settings.protections.antiraid_logs));
                        const r = await Welcome.findOne({ serverID: e.guild.id, reason: "anti_spam" });
                        if (r)
                            if (_users.has(e.author.id)) {
                                const s = _users.get(e.author.id);
                                if (!(e.createdTimestamp - s.lastMessage.createdTimestamp < 3000 && s.messages.length > 5)) {
                                    if (s.messages.push(e), s.lastMessage = e, s.messages.length >= r.image) {
                                        e.deletable && e.delete().catch();
                                        let n = await Warn.find({ serverID: e.guild.id, manID: e.author.id });
                                        const uniqID = await e.uniqID(10)
                                        e.guild.CreateWarn(e.member, `Spam (${s.messages.length} messages/5s`, e.client, true, true, e.client, uniqID).catch(err => {
                                            console.log("[CreateWarn] : " + err + "")
                                        })
                                       e.warnDM(e.member,`Spam (${s.messages.length} messages/5s`,true)
                                        let i = n.length + 1;
                                        if (i >= r.channelID) {
                                            const r = await e.guild.members.fetch(e.author.id).catch(() => {});
                                            if (r) {
                                                if (!r.bannable) return e.mainMessageT(`⛔ **${e.author.username}** ${e.guild.settings.lang === "fr" ? `A eu trop d'avertisements et devrait être banni mais je ne suis pas assez haut pour le faire !`:`Has had too many warnings and should be banned but I am not high enough to do it!`}
`);
                                                    r.ban({ reason: `${e.guild.settings.lang === "fr" ? `Trops d'avertisements`:`Too many warnings`} (${i}) [Anti spam]` }).then(() => { a && a.send({ embeds: [(new Discord.MessageEmbed).setAuthor("Anti-spam", r.user.displayAvatarURL()).setDescription(`${e.guild.settings.lang === "fr" ? `Du spam a été détecté dans le message de`:`Spam  was detected in the message of`} __**${e.author.tag}**__ . \n __Messages/10s__ : ${s.messages.length}.\n __Sanction__ : Bannisement ( ${e.guild.settings.lang === "fr" ? `il avait **${i}** warns`:`he had **${i}** warns`}).`).setColor(t.color).setFooter(t.footer, t.user.displayAvatarURL())] }), e.mainMessageT(`${e.guild.settings.lang === "fr" ? `⛔ **${e.author.username}** A été banni du serveur car il a eu trop d'avertisements (**${i}**)!`:`⛔ **${e.author.username}** Was banned from the server because he had too many warnings (**${i}**)!`}`) }).catch(t => (console.log(t), e.mainMessageT(`⛔ **${e.author.username}** ${e.guild.settings.lang === "fr" ? `A eu trop d'avertisements et devrait être banni mais je ne suis pas assez haut pour le faire !`:`Has had too many warnings and should be banned but I am not high enough to do it!`}
`)))
                                                }
                                            } else {
                                                let n = e.member;
                                                a && a.send({ embeds: [(new Discord.MessageEmbed).setAuthor("Anti Spam", n.user.displayAvatarURL()).setDescription(`${e.guild.settings.lang === "fr" ? `Du spam a été détecté dans le message de`:`Spam  was detected in the message of`} __**${e.author.tag}**__ . \n __Messages/10s__ : ${s.messages.length}.\n __Sanction__ : Warn ( ${e.guild.settings.lang === "fr" ? `il a désormais **${i}** warns`:`he has now **${i}** warns`}).`).setColor(t.color).setFooter(t.footer, t.user.displayAvatarURL())] });
                                                let o = await e.channel.send({ embeds: [(new Discord.MessageEmbed).setAuthor("Anti-spam", n.user.displayAvatarURL()).setDescription(r.message.replace("{user}", e.author).replace("{tag}", e.author.tag).replace("{username}", e.author.username).replace("{server}", e.guild.name).replace("{WarnsCount}", i)).setColor(e.guild.settings.color).setFooter(e.client.footer, e.client.user.displayAvatarURL())] });
                                                setTimeout(() => { o.delete() }, 100000)
                                                
                                            }
                                        }
                                        setTimeout(() => s.messages.pop(), 1e4)
                                    }
                                } else _users.set(e.author.id, { messages: [], lastMessage: e });
                            if (e.guild.settings.protections.anti_pub && /(discord\.(gg|io|me|li)\/.+|discordapp\.com\/invite\/.+)/i.test(e.content) && !e.channel.permissionsFor(e.member).has("MANAGE_MESSAGES")) {
                                e.delete();
                                let s = await Warn.find({ serverID: e.guild.id, manID: e.author.id });
                                new Warn({ serverID: `${e.guild.id}`, manID: `${e.author.id}`, reason: `${e.guild.settings.lang === "fr" ? `Invitation discord postée`:`Posted an discord invite`}`, date: new Date, moderator: `${t.user.id}` }).save();
                                e.warnDM(e.member,`${e.guild.settings.lang === "fr" ? `Invitation discord postée`:`Posted an discord invite`}`,true)

                                let r = s.length + 1;
                                if (r >= 5) {
                                    const s = await e.guild.members.fetch(e.author.id).catch(() => {});
                                    if (s) {
                                        if (!s.bannable) return e.mainMessageT(`⛔ **${e.author.username}** ${e.guild.settings.lang === "fr" ? `A eu trop d'avertisements et devrait être banni mais je ne suis pas assez haut pour le faire !`:`Has had too many warnings and should be banned but I am not high enough to do it!`}
`);
                                        s.ban({ reason: `Too many warnings (${r}) [Anti pub]` }).then(() => {
                                             e.mainMessageT(` ${e.guild.settings.lang === "fr" ? `⛔ **${e.author.username}** A été banni du serveur car il a eu trop d'avertisements (**${r}**)!`:`⛔ **${e.author.username}** Was banned from the server because he had too many warnings (**${r}**)!`}`),
                                              a && a.send({ embeds: [(new Discord.MessageEmbed).setAuthor("Anti-pub", s.user.displayAvatarURL()).setDescription(`${e.guild.settings.lang === "fr" ? `Une invitation a été détectée dans le message de`:`An invitation was detected in the message of`} __**${e.author.tag}**__ . \n __Message__ : ${e.content.slice(0,200)}.\n __Sanction__ : Ban ( ${e.guild.settings.lang === "fr" ? `il avait **${r}** warns`:`he had **${r}** warns`}).`).setColor(t.color).setFooter(t.footer, t.user.displayAvatarURL())] }) }).catch(t => (console.log(t),
                                               e.mainMessageT(`⛔ **${e.author.username}** ${e.guild.settings.lang === "fr" ? `A eu trop d'avertisements et devrait être banni mais je ne suis pas assez haut pour le faire !`:`Has had too many warnings and should be banned but I am not high enough to do it!`}
`)))
                                }
                            } else {
                                let s = e.member;
                                a && a.send({ embeds: [(new Discord.MessageEmbed).setAuthor("Anti-pub", s.user.displayAvatarURL()).setDescription(`${e.guild.settings.lang === "fr" ? `Une invitation a été détectée dans le message de`:`An invitation was detected in the message of`} __**${e.author.tag}**__ . \n __Message__ : ${e.content.slice(0,200)}.\n __Sanction__ : Warn (${e.guild.settings.lang === "fr" ? `il a désormais **${r}** warns`:`he has now **${r}** warns`}).`).setColor(t.color).setFooter(t.footer, t.user.displayAvatarURL())] });
                                let n = await e.channel.send({ embeds: [(new Discord.MessageEmbed).setAuthor("Anti-pub", s.user.displayAvatarURL()).setDescription(`${e.guild.settings.lang === "fr" ? `⚠ Attention **${e.author.username}** , les invitations sont interdies sur ce serveur ! Si je te reprend , je vais te sanctionner !`:`⚠ Attention **${e.author.username}** , invitations are forbidden on this server ! If I take you back, I will punish you !`}`).setColor(e.guild.settings.color).setFooter(e.client.footer, e.client.user.displayAvatarURL())] });
                                setTimeout(() => { n.delete() }, 100000)
                            }
                        }
                        const n = await Welcome.findOne({ serverID: e.guild.id, reason: "anti_mentions" });
                        if (n) {
                            const s =  (e.mentions.roles ? e.mentions.roles.size : 0) + (e.mentions.everyone ? 1 : 0);
                            if (s >= n.image) {
                                e.deletable && e.delete().catch();
                                let a = await Warn.find({ serverID: e.guild.id, manID: e.author.id });
                                new Warn({ serverID: `${e.guild.id}`, manID: `${e.author.id}`, reason: `${e.guild.settings.lang === "fr" ? `Trop de mentions`:`Too many mentions`} (${s})`, date: new Date, moderator: `${t.user.id}` }).save();
                                e.warnDM(e.member,`${e.guild.settings.lang === "fr" ? `Trop de mentions`:`Too many mentions`} (${s})`,true)

                                let r = a.length + 1;
                                if (r >= n.channelID) {
                                    const t = await e.guild.members.fetch(e.author.id).catch(() => {});
                                    if (t) {
                                        if (!t.bannable) return e.mainMessageT(`⛔ **${e.author.username}** ${e.guild.settings.lang === "fr" ? `A eu trop d'avertisements et devrait être banni mais je ne suis pas assez haut pour le faire !`:`Has had too many warnings and should be banned but I am not high enough to do it!`}
`);
                                        t.ban({ reason: `${e.guild.settings.lang === "fr" ? `Trops d'avertisements`:`Too many warnings`} (${r}) [Anti spam]` }).then(() => { e.mainMessageT(`${e.guild.settings.lang === "fr" ? `⛔ **${e.author.username}** A été banni du serveur car il a eu trop d'avertisements (**${r}**)!`:`⛔ **${e.author.username}** Was banned from the server because he had too many warnings (**${r}**)!`}`) }).catch(t => (console.log(t), e.mainMessageT(`⛔ **${e.author.username}** ${e.guild.settings.lang === "fr" ? `A eu trop d'avertisements et devrait être banni mais je ne suis pas assez haut pour le faire !`:`Has had too many warnings and should be banned but I am not high enough to do it!`}
`)))
                                    }
                                } else e.mainMessageT(n.message.replace("{user}", e.author).replace("{tag}", e.author.tag).replace("{username}", e.author.username).replace("{server}", e.guild.name).replace("{WarnsCount}", r))
                            }
                        }
                        const i = await Welcome.findOne({ serverID: e.guild.id, reason: "anti_majs" });
                        if (i) {
                            const s = e.content.replace(/[^A-Z]/g, "").length / e.content.length * 100;
                            if (s >= i.image && e.content.length >= 10) {
                                e.deletable && e.delete().catch();
                                let a = await Warn.find({ serverID: e.guild.id, manID: e.author.id });
                                new Warn({ serverID: `${e.guild.id}`, manID: `${e.author.id}`, reason: `${e.guild.settings.lang === "fr" ? `Trop de majuscules dans son message (${s}%)`:`Too many caps letters (${s}%)`} `, date: new Date, moderator: `${t.user.id}` }).save();
                                e.warnDM(e.member,`${e.guild.settings.lang === "fr" ? `Trop de majuscules dans votre message (${s}%)`:`Too many caps letters (${s}%)`}`,true)

                                let r = a.length + 1;
                                if (r >= i.channelID) {
                                    const t = await e.guild.members.fetch(e.author.id).catch(() => {});
                                    if (t) {
                                        if (!t.bannable) return e.mainMessageT(`⛔ **${e.author.username}** ${e.guild.settings.lang === "fr" ? `A eu trop d'avertisements et devrait être banni mais je ne suis pas assez haut pour le faire !`:`Has had too many warnings and should be banned but I am not high enough to do it!`}
`);
                                        t.ban({ reason: `${e.guild.settings.lang === "fr" ? `Trops d'avertisements`:`Too many warnings`} (${r}) [Anti caps]` }).then(() => { e.mainMessageT(`${e.guild.settings.lang === "fr" ? `⛔ **${e.author.username}** A été banni du serveur car il a eu trop d'avertisements (**${r}**)!`:`⛔ **${e.author.username}** Was banned from the server because he had too many warnings (**${r}**)!`}`) }).catch(t => (console.log(t), e.mainMessageT(`⛔ **${e.author.username}** ${e.guild.settings.lang === "fr" ? `A eu trop d'avertisements et devrait être banni mais je ne suis pas assez haut pour le faire !`:`Has had too many warnings and should be banned but I am not high enough to do it!`}
`)))
                                    }
                                } else {
                                    let t = e.member,
                                        s = await e.channel.send({ embeds: [(new Discord.MessageEmbed).setAuthor("Anti-caps", t.user.displayAvatarURL()).setDescription(i.message.replace("{user}", e.author).replace("{tag}", e.author.tag).replace("{username}", e.author.username).replace("{server}", e.guild.name).replace("{WarnsCount}", r)).setColor(e.guild.settings.color).setFooter(e.client.footer, e.client.user.displayAvatarURL())] });
                                    setTimeout(() => { s.delete() }, 100000)
                                }
                            }
                        }
                    }
                }
              
              const  message = e
                const list = await AutoResponders.find({ serverID: message.guild.id })
                if(list.length !== 0) {
                let responder = list.filter(r => r.channelID === message.channel.id)
                if (!responder[0] || !responder) {
                    let respondera = list.filter(r => r.channelID === "all")
                    if (!respondera[0] || !respondera) {
                    } else {
                        const finded = respondera[0]
                        if(finded.message) {
                        if (finded.message_reaction === "every") {
                            message.channel.send(finded.message.replace("{user}", message.member).replace("@everyone", "everyone").replace("@here", "here")).then(m => {
                                if (finded.inv === "yes") {
                                    message.delete()
                                }
                                if (finded.del !== "no") {
                                    setTimeout(() => { m.delete() }, finded.del)
                                }
                            })
                        } else if (finded.message_reaction.toLowerCase() === message.content.toLowerCase()) {
                            message.channel.send(finded.message.replace("{user}", message.member).replace("@everyone", "everyone").replace("@here", "here")).then(m => {
                                if (finded.inv === "yes") {
                                    message.delete()
                                }
                                if (finded.del !== "no") {
                                    setTimeout(() => { m.delete() }, finded.del)
                                }
                            })
                        }
                     }
                    }
                } else {
                    if (responder.length > 1 || responder.length !== 0 || responder.length !== 1) {
                        const findeda = responder.filter(r => r.message_reaction === message.content)
                        const finded = findeda[0]
                        if(finded.message){
                        message.channel.send(finded.message.replace("{user}", message.member).replace("@everyone", "everyone").replace("@here", "here")).then(m => {
                            if (finded.inv === "yes") {
                                message.delete()
                            }
                            if (finded.del !== "no") {
                                setTimeout(() => { m.delete() }, finded.del)
                            }
                        })
                    }
                    } else {
                        const finded = responder[0]
                        if(finded.message){
                        if (finded.message_reaction === "every") {
                            message.channel.send(finded.message.replace("{user}", message.member).replace("@everyone", "everyone").replace("@here", "here")).then(m => {
                                if (finded.inv === "yes") {
                                    message.delete()
                                }
                                if (finded.del !== "no") {
                                    setTimeout(() => { m.delete() }, finded.del)
                                }
                            })
                        } else if (finded.message_reaction.toLowerCase() === message.content.toLowerCase()) {
                            message.channel.send(finded.message.replace("{user}", message.member).replace("@everyone", "everyone").replace("@here", "here")).then(m => {
                                if (finded.inv === "yes") {
                                    message.delete()
                                }
                                if (finded.del !== "no") {
                                    setTimeout(() => { m.delete() }, finded.del)
                                }
                            })
                        }
                    }
                    }
                }
               }
                const liste = await AutoReactions.find({ serverID: message.guild.id })
                if(liste.length !== 0) {
                let responder = liste.filter(r => r.channelID === message.channel.id)
                if (!responder[0] || !responder) {
                    let respondera = liste.filter(r => r.channelID === "all")
                    if (!respondera[0] || !respondera) {
                        return
                    } else {
                        const finded = respondera[0]
                        if(!finded || !finded.reaction) return
                        if (finded.message_reaction === "every") {
                           message.react(finded.reaction)
                        } else if (finded.message_reaction.toLowerCase() === message.content.toLowerCase()) {
                            message.react(finded.reaction)
                        }
                    }
                } else {
                    if (responder.length > 1 || responder.length !== 0 || responder.length !== 1) {
                        const findeda = responder.filter(r => r.message_reaction === message.content)
                        const finded = findeda[0]
                        if(!finded || !finded.reaction) return
                        message.react(finded.reaction)
                    } else {
                        const finded = responder[0]
                        if(!finded || !finded.reaction) return
                        if (finded.message_reaction === "every") {
                            message.react(finded.reaction)
                        } else if (finded.message_reaction.toLowerCase() === message.content.toLowerCase()) {
                            message.react(finded.reaction)
                        }
                    }

                }
            }
    
          
            if (!e.content.startsWith(n) || e.content.startsWith("!") || e.content.startsWith("^^") || e.content.startsWith(".")) {
                const t = await levelModel.findOne({ serverID: e.guild.id, userID: e.author.id });
                let s = await rolesRewards.findOne({ serverID: e.guild.id, reason: "messages", level: t ? t.messagec + 1 : 1 });
                if (s) {
                    let t = e.guild.roles.cache.get(s.roleID);
                    t && e.member.roles.add(t);
                    const a = await guild.findOne({ serverID: e.guild.id, reason: "old_role_m" });
                    a ? (e.member.roles.remove(a.description), await guild.findOneAndUpdate({ serverID: e.guild.id, content: e.author.id, reason: "old_role_m" }, { $set: { description: `${t.id}` } }, { new: !0 })) : new guild({ serverID: `${e.guild.id}`, content: `${e.author.id}`, description: `${t.id}`, reason: "old_role_m" }).save()
                }
                if (t)
                    if (t.xp + 5 > 100) {
                        let s = await rolesRewards.findOne({ serverID: e.guild.id, reason: "level", level: t.level + 1 });
                        if (s) {
                            let t = e.guild.roles.cache.get(s.roleID);
                            if(t){
                            t && e.member.roles.add(t);
                            const a = await guild.findOne({ serverID: e.guild.id, reason: "old_role" });
                            a ? (e.member.roles.remove(a.description), await guild.findOneAndUpdate({ serverID: e.guild.id, content: e.author.id, reason: "old_role" }, { $set: { description: `${t.id}` } }, { new: !0 })) : new guild({ serverID: `${e.guild.id}`, content: `${e.author.id}`, description: `${t.id}`, reason: "old_role" }).save()
                        }
                        }
                        if (await guild.findOne({ serverID: e.guild.id, reason: "level" })) {
                            const s = require("canvas"),
                                { registerFont: a } = require("canvas");
                            a("./ZenDots-Regular.ttf", { family: "Zen Dots" });
                            let r = e.member;
                            const n = s.createCanvas(400, 100),
                                i = n.getContext("2d");
                            i.beginPath(), i.lineWidth = 1.5, i.fillStyle = "#3A871F", i.moveTo(80, 40), i.lineTo(330, 40), i.quadraticCurveTo(340, 40, 340, 50), i.quadraticCurveTo(340, 60, 330, 60), i.lineTo(80, 60), i.lineTo(80, 40), i.fill(), i.stroke(), i.font = '13px "Zen Dots"', i.fillStyle = "#fff", i.fillText(`Level ${t.level+1} !`, 100, 55), i.closePath(), i.beginPath(), i.fillStyle = "#fff", i.arc(60, 50, 32, 0, 2 * Math.PI), i.fill(), i.beginPath(), i.arc(60, 50, 30, 0, 2 * Math.PI, !0), i.closePath(), i.clip();
                            const o = await s.loadImage(r.user.displayAvatarURL({ format: "jpg" }));
                            i.drawImage(o, 30, 20, 60, 60);
                            const l = new Discord.MessageAttachment(n.toBuffer(), `newlevel-${r.id}.png`),
                                d = await guild.findOne({ serverID: e.guild.id, reason: "levelChannel" });
                            if (d) {
                                const s = await guild.findOne({ serverID: e.guild.id, reason: "levelMessage" });
                                if (s) {
                                    let a = `${s.content}`.replace("{user}", e.author).replace("{level}", `${t.level+1}`).replace("{username}", e.author.username).replace("{tag}", e.author.tag).replace("{server}", e.guild.name).replace("{messagesCount}", t.messagec + 1);
                                    if ("current" === d.content) {
                                        let t = (new Discord.MessageEmbed).setImage(`attachment://newlevel-${r.id}.png`).setColor(e.guild.settings.color);
                                        e.channel.send({ content: a, embeds: [t], files: [l] })
                                    } else {
                                        let t = e.guild.channels.cache.get(d.content),
                                            s = (new Discord.MessageEmbed).setImage(`attachment://newlevel-${r.id}.png`).setColor(e.guild.settings.color);
                                        t && t.send({ content: a, embeds: [s], files: [l] })
                                    }
                                } else if ("current" === d.content) {
                                    let t = (new Discord.MessageEmbed).setImage(`attachment://newlevel-${r.id}.png`).setColor(e.guild.settings.color);
                                    e.channel.send({ embeds: [t], files: [l] })
                                } else {
                                    let t = e.guild.channels.cache.get(d.content);
                                    if (t) {
                                        let s = (new Discord.MessageEmbed).setImage(`attachment://newlevel-${r.id}.png`).attachFiles(l).setColor(e.guild.settings.color);
                                        t.send({ embeds: [s] })
                                    }
                                }
                            }
                            await levelModel.findOneAndUpdate({ serverID: e.guild.id, userID: e.author.id }, { $set: { xp: "0", level: t.level + 1, messagec: t.messagec + 1 } }, { new: !0 })
                        } else await levelModel.findOneAndUpdate({ serverID: e.guild.id, userID: e.author.id }, { $set: { xp: "0", level: t.level + 1, messagec: t.messagec + 1 } }, { new: !0 })
                    } else await levelModel.findOneAndUpdate({ serverID: e.guild.id, userID: e.author.id }, { $set: { xp: `${t.xp+5}`, messagec: t.messagec + 1 } }, { new: !0 });
                else new levelModel({ serverID: `${e.guild.id}`, userID: `${e.author.id}`, xp: 5, level: 0, messagec: 1 }).save()
            }
        if(!e.author.bot){
                const a = await Welcome.findOne({ serverID: e.guild.id, reason: "interchat" });
                if (a && a.channelID === e.channel.id) {
                    if (!a.message) { const t = (new Discord.MessageEmbed).setTitle("Interchat : Erreur").setDescription(`Vous avez défini le salon de l'interchat mais pas un serveur correspondant !\n            Veuillez faire : \`${e.guild.settings.prefix}interchat\` pour plus d'informations`).setFooter(e.client.footer, e.client.user.displayAvatarURL({ dynamic: !0, size: 512 })).setColor("#F0B02F"); return e.channel.send({ embeds: [t] }) } {
                        let s = t.guilds.cache.get(a.message);
                        if (!s) { const t = (new Discord.MessageEmbed).setTitle("Interchat : Erreur").setDescription("Je ne trouve plus le serveur de l'interchat , il a a peut être été supprimé ou j'ai quitté ce serveur...").setFooter(e.client.footer, e.client.user.displayAvatarURL({ dynamic: !0, size: 512 })).setColor("#F0B02F"); return e.channel.send({ embeds: [t] }) } {
                            const a = await Welcome.findOne({ serverID: s.id, reason: "interchat" });
                            if (a) {
                                let r = s.channels.cache.get(a.channelID);
                                if (r) {
                                    if ("info" === e.content) { const a = (new Discord.MessageEmbed).setTitle("Interchat : Info").setColor("#F0B02F").setDescription(`Vous êtes actuellement en interchat avec le serveur **${s.name}**\n                                    ${s.channels.cache.size} salons\n                                    ${s.roles.cache.size} roles\n                     `).setFooter(t.footer); return e.channel.send({ embeds: [a] }) }
                                    let a = e.author.displayAvatarURL({ dynamic: !0 });
                                    r.createWebhook(e.author.username, { avatar: a }).then(t => {
                                        const s = function(e) { const t = /^.*(gif|png|jpg|jpeg0)$/g; return e.array().filter(e => t.test(e.url)).map(e => e.url) }(e.attachments);
                                        t.send(Discord.Util.removeMentions(e.content), s), setTimeout(function() { t.delete() }, 5e3)
                                    })
                                }
                            }
                        }
                    }
                }
            }
        }
    
};
