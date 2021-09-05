const Welcome = require("../../database/models/Welcome"),
    counter = require("../../database/models/counter"),
    guild = require("../../database/models/guild"),
    guildData = require("../../database/models/guildData"),
    config = require("../../config.js"),
    Discord = require("discord.js"),
    moment = require("moment"),
    Canvas = require("canvas"),
    { registerFont: registerFont } = require("canvas");
registerFont("./ZenDots-Regular.ttf", { family: "Zen Dots" }), module.exports = {
    async execute(e, s) {
        const ping = await Welcome.findOne({ serverID: e.guild.id, reason: "autoping" });
        if (ping && ping.status) {
            const t = e.guild.channels.cache.get(ping.channelID);
            if (!t) return;
            t.send({ content: ping.message.replace("{user}", e) }).then(m => {
                setTimeout(() => { m.delete() }, ping.image)
            })
        }
        const ai = await Welcome.findOne({ serverID: e.guild.id, reason: "verification" });
        if (ai && !e.verified) return
         const settings = await guildData.findOne({ serverID: e.guild.id })
if(s.log) console.log(settings)
         let t, r = await Welcome.findOne({ serverID: e.guild.id, reason: "logs" });
        t = r ? e.guild.channels.cache.get(r.channelID) : null;
        const lang = await e.guild.translatee("WELCOME", settings.lang)
        const a = (new Discord.MessageEmbed).setTitle(lang.title.replace("{username}", e.user.username)).setThumbnail(e.user.displayAvatarURL()).setDescription(lang.desc.replace("{x}", e.guild.memberCount).replace("{date}", moment(e.user.createdTimestamp).locale(settings.lang).format("LL, "))).setFooter(s.footer).setColor("#04781B");
        if (t) t.send({ embeds: [a] })
        if (e.user.bot) {
            if (settings.autonick_bot) {
                let t = s.content ? s.content.replace("{username}", e.user.username) : e.user.username;
                await e.setNickname(t, "Auto nick for bots")
            }
            if (settings.autorole_bot) {
                let s = e.guild.roles.cache.get(settings.autorole_bot);
                if (s) try { e.roles.add(s, "Bot Autorole plugin") } catch (e) {
                    t && t.mainMessage("**Bot autorole**\nI couldn't give the role, check my permissions", "#EADEDB")
                }
                else t && t.mainMessage("**Bot autorole**\nI couldn't give the role, check my permissions", "#EADEDB")
            }
        } else {
            if (settings.autonick) {
                let t = settings.autonick ? settings.autonick.replace("{username}", e.user.username) : e.user.username;
                await e.setNickname(t, "Auto nick system")
            }
            if (settings.autorole) {
                let s = e.guild.roles.cache.get(settings.autorole);
                if (s) try { e.roles.add(s, "Autorole plugin") } catch (e) {
                    t && t.mainMessage("**Autorole error**\nI couldn't give the role, check my permissions", "#EADEDB")
                }
                else t && t.mainMessage("**Autorole error**\nI couldn't give the role, check my permissions", "#EADEDB")
            }
        }
        const unknow = await e.guild.translatee("UNKNOW_INVITE", settings.lang)
        const l = await Welcome.findOne({ serverID: e.guild.id, reason: "welcome" });
        if (l && l.status && l.channelID) {
            const t = e.guild.channels.cache.get(l.channelID);
            if (!t) return;
            let r = await e.guild.translatee("WELCOME_NAME", settings.lang),
                a = await e.guild.translatee("WEARENOW", settings.lang);
            const i = Canvas.createCanvas(800, 400),
                n = i.getContext("2d");
            n.beginPath(), n.fillStyle = "#3A871F", n.lineWidth = 1.5, n.moveTo(220, 110), n.lineTo(690, 110), n.quadraticCurveTo(730, 110, 730, 140), n.quadraticCurveTo(730, 170, 690, 170), n.lineTo(220, 170), n.lineTo(220, 110), n.fill(), n.stroke(), n.closePath(), n.font = '40px "Zen Dots"', n.fillStyle = "#fff", n.fillText(`${r}`, 290, 155), n.beginPath(), n.fillStyle = "#3A871F", n.lineWidth = 1.5, n.moveTo(230, 175), n.lineTo(690, 175), n.quadraticCurveTo(730, 175, 730, 205), n.quadraticCurveTo(730, 235, 690, 235), n.lineTo(230, 235), n.lineTo(230, 175), n.fill(), n.stroke(), n.closePath(), n.font = '25px "Zen Dots"', n.fillStyle = "#fff", n.fillText(`${e.user.username}`, 290, 215), n.beginPath(), n.fillStyle = "#3A871F", n.lineWidth = 1.5, n.moveTo(220, 240), n.lineTo(690, 240), n.quadraticCurveTo(730, 240, 730, 270), n.quadraticCurveTo(730, 300, 690, 300), n.lineTo(220, 300), n.lineTo(220, 240), n.fill(), n.stroke(), n.closePath(), n.font = '25px "Zen Dots"', n.fillStyle = "#fff", n.fillText(a.replace("{count}", e.guild.memberCount), 290, 280), n.beginPath(), n.fillStyle = "#fff", n.arc(160, 200, 125, 0, 2 * Math.PI, !0), n.fill(), n.beginPath(), n.arc(160, 200, 120, 0, 2 * Math.PI, !0), n.closePath(), n.clip();
            const m = await Canvas.loadImage(e.user.displayAvatarURL({ format: "jpg" }));
            n.drawImage(m, 40, 80, 240, 240);
            const d = new Discord.MessageAttachment(i.toBuffer(), "welcome-image.png");
            if (t)
                if (l.message) {
                    if (e.user.bot) {
                        const r = await e.guild.translatee("BOT_ADDED", settings.lang);
                        return void e.guild.fetchAuditLogs().then(async a => {
                            let i = "";
                            if ("BOT_ADD" === a.entries.first().action && (i = a.entries.first().executor.id), l.image && l.embed) {
                                let a = (new Discord.MessageEmbed).setColor(s.color).setDescription(r.replace("{bot}", e).replace("{adder}", i ? `<@${i}>` : unknow)).setImage("attachment://welcome-image.png");
                                t.send({ embeds: [a], files: [d] })
                            } else if (l.image) t.send({ content: r.replace("{bot}", e).replace("{adder}", i ? `<@${i}>` : unknow), files: [d] });
                            else if (l.embed) {
                                let a = (new Discord.MessageEmbed).setColor(s.color).setDescription(r.replace("{bot}", e).replace("{adder}", i ? `<@${i}>` : unknow));
                                t.send({ embeds: [a] })
                            } else t.send(r.replace("{bot}", e).replace("{adder}", i ? `<@${i}>` : unknow))
                        })
                    }
                    const r = s.guildInvites;
                    let a = r.get(e.guild.id);
                    const i = await e.guild.invites.fetch().catch(() => {});
                    if (a || i && (r.set(e.guild.id, i), a = i), i) {
                        r.set(e.guild.id, i);
                        const n = i.find(e => a.get(e.code).uses < e.uses);
                        if (n) {
                            const r = i.array().filter(e => e.inviter.id === n.inviter.id);
                            if (r) {
                                for (var o = 0, c = 0; c < r.length; c++) { o += r[c].uses }
                                msg = `${l.message}`.replace(/{user}/g, e).replace(/{server}/g, e.guild.name).replace(/{username}/g, e.user.username).replace(/{inviter}/g, n ? `${n.inviter}` : unknow).replace(/{invites}/g, `**${o}**`).replace(/{tag}/g, e.user.tag).replace(/{membercount}/g, e.guild.memberCount)
                            } else msg = `${l.message}`.replace(/{user}/g, e).replace(/{server}/g, e.guild.name).replace(/{username}/g, e.user.username).replace(/{inviter}/g, n ? `${n.inviter}` : unknow).replace(/{invites}/g, "**0**").replace(/{tag}/g, e.user.tag).replace(/{membercount}/g, e.guild.memberCount);
                            if (l.image && l.embed) {
                                let e = (new Discord.MessageEmbed).setColor(s.color).setDescription(msg).setImage("attachment://welcome-image.png");
                                t.send({ embeds: [e], files: [d] })
                            } else if (l.image) t.send({ content: msg, files: [d] });
                            else if (l.embed) {
                                let e = (new Discord.MessageEmbed).setColor(s.color).setDescription(msg);
                                t.send({ embeds: [e] })
                            } else t.send(msg)
                        } else if (msg = `${l.message}`.replace(/{user}/g, e).replace(/{server}/g, e.guild.name).replace(/{username}/g, e.user.username).replace(/{inviter}/g, unknow).replace(/{invites}/g, "0").replace(/{tag}/g, e.user.tag).replace(/{membercount}/g, e.guild.memberCount), l.image && l.embed) {
                            let e = (new Discord.MessageEmbed).setColor(s.color).setDescription(msg).setImage("attachment://welcome-image.png");
                            t.send({ embeds: [e], files: [d] })
                        } else if (l.image) t.send({ content: msg, files: [d] });
                        else if (l.embed) {
                            let e = (new Discord.MessageEmbed).setColor(s.color).setDescription(msg);
                            t.send({ embeds: [e] })
                        } else t.send(msg)
                    } else if (msg = `${l.message}`.replace(/{user}/g, e).replace(/{server}/g, e.guild.name).replace(/{username}/g, e.user.username).replace(/{inviter}/g, unknow).replace(/{invites}/g, "0").replace(/{tag}/g, e.user.tag).replace(/{membercount}/g, e.guild.memberCount), l.image && l.embed) {
                        let e = (new Discord.MessageEmbed).setColor(s.color).setDescription(msg).setImage("attachment://welcome-image.png");
                        t.send({ embeds: [e], files: [d] })
                    } else if (l.image) t.send({ content: msg, files: [d] });
                    else if (l.embed) {
                        let e = (new Discord.MessageEmbed).setColor(s.color).setDescription(msg);
                        t.send({ embeds: [e] })
                    } else t.send(msg)
                } else if (l.image)
                if (l.embed) {
                    let e = (new Discord.MessageEmbed).setColor(s.color).setImage("attachment://welcome-image.png");
                    t.send({ embeds: [e], files: [d] })
                } else t.send({ attachments: [d] })
        }


        const i = await counter.findOne({ serverID: e.guild.id });
        if (i) {
            e.guild.memberCount !== e.guild.members.cache.size && await e.guild.members.fetch();
            let la = await e.guild.translatee("COUNTER", settings.lang)
            const s = e.guild.members.cache;
            let r = 0,
                a = e.guild.channels.cache.get(i.MembersID);
            a && (r += 1, a.edit({ name: `👦 ${la.a} : ${s.filter(e=>!e.user.bot).size}` }));
            let n = e.guild.channels.cache.get(i.totalID);
            n && (r += 1, n.edit({ name: `🌎 ${la.c} : ${e.guild.memberCount}` }));
            let l = e.guild.channels.cache.get(i.BotsID);
            l && (r += 1, l.edit({ name: `🤖 Bots : ${s.filter(e=>e.user.bot).size}` }))
        }
        const n = await guild.findOne({ serverID: e.guild.id, reason: "joindm" });
        if (n && !e.user.bot) {
            let s = `${n.content}\n\n-Sent from ${e.guild.name}`.replace(/{user}/g, e).replace(/{member}/g, e).replace(/{server}/g, e.guild.name).replace(/{username}/g, e.user.username).replace(/{tag}/g, e.user.tag).replace(/{membercount}/g, e.guild.memberCount);
            e.send(s)
        }

        const RaidLogs = settings.protections.antiraid_logs ? e.guild.channels.cache.get(settings.protections.antiraid_logs) : null
        const g = await Welcome.findOne({ serverID: e.guild.id, reason: "anti_dc" });
        if (g) {
            const lang = await e.guild.translatee("ANTI_DC", settings.lang)
            e.user.createdTimestamp > Date.now() - 864e5 * g.image && (e.send(g.message.replace("{user}", e).replace("{tag}", e.user.tag).replace("{username}", e.user.username).replace("{server}", e.guild.name).replace("{days}", g.image)), await e.kick({ reason: lang.title }), RaidLogs && RaidLogs.send({ embeds: [(new Discord.MessageEmbed).setAuthor(lang.title, e.user.displayAvatarURL()).setDescription(lang.desc.replace("{date}", moment(e.user.createdTimestamp).locale(settings.lang).fromNow()).replace("{tag}", e.user.tag)).setColor(s.color).setFooter(s.footer, s.user.displayAvatarURL())] }))
        }
    }
};
