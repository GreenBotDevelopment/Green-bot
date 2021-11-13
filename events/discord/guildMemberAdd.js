const Welcome = require("../../database/models/Welcome"),
    guildData = require("../../database/models/guildData"),
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
        const settings = await guildData.findOne({ serverID: e.guild.id })
        if (!settings) return
        let t, r = await Welcome.findOne({ serverID: e.guild.id, reason: "logs" });
        t = r ? e.guild.channels.cache.get(r.channelID) : null;
        const lang = await e.guild.translatee("WELCOME", settings.lang)
        const a = (new Discord.MessageEmbed).setTitle(lang.title.replace("{username}", e.user.username)).setThumbnail(e.user.displayAvatarURL()).setDescription(lang.desc.replace("{x}", e.guild.memberCount).replace("{date}", moment(e.user.createdTimestamp).locale(settings.lang).format("LL, "))).setFooter(s.footer).setColor("#04781B");
        if (t) t.send({ embeds: [a] })
        if (e.user.bot && settings.autorole_bot) {
            let s = e.guild.roles.cache.get(settings.autorole_bot);
            if (s) try { e.roles.add(s, "Bot Autorole plugin") } catch (e) {}
            else return
        } else if (settings.autorole) {
            let s = e.guild.roles.cache.get(settings.autorole);
            if (s) try { e.roles.add(s, "Autorole plugin") } catch (e) {
                t && t.mainMessage("**Autorole error**\nI couldn't give the role, check my permissions", "#EADEDB")
            }
            else t && t.mainMessage("**Autorole error**\nI couldn't give the role, check my permissions", "#EADEDB")

        }
        const l = await Welcome.findOne({ serverID: e.guild.id, reason: "welcome" });
        if (l && l.status && l.channelID) {
            const t = e.guild.channels.cache.get(l.channelID);
            if (!t) return;
            let color;
            if (l.color) {
                color = l.color
            } else {
                color = "#3A871F"
            }
            let r = await e.guild.translatee("WELCOME_NAME", settings.lang),
                a = await e.guild.translatee("WEARENOW", settings.lang);
            const i = Canvas.createCanvas(800, 400),
                n = i.getContext("2d");
            n.beginPath(), n.fillStyle = color, n.lineWidth = 1.5, n.moveTo(220, 110), n.lineTo(690, 110), n.quadraticCurveTo(730, 110, 730, 140), n.quadraticCurveTo(730, 170, 690, 170), n.lineTo(220, 170), n.lineTo(220, 110), n.fill(), n.stroke(), n.closePath(), n.font = '40px "Zen Dots"', n.fillStyle = "#fff", n.fillText(`${r}`, 290, 155), n.beginPath(), n.fillStyle = color, n.lineWidth = 1.5, n.moveTo(230, 175), n.lineTo(690, 175), n.quadraticCurveTo(730, 175, 730, 205), n.quadraticCurveTo(730, 235, 690, 235), n.lineTo(230, 235), n.lineTo(230, 175), n.fill(), n.stroke(), n.closePath(), n.font = '25px "Zen Dots"', n.fillStyle = "#fff", n.fillText(`${e.user.username}`, 290, 215), n.beginPath(), n.fillStyle = color, n.lineWidth = 1.5, n.moveTo(220, 240), n.lineTo(690, 240), n.quadraticCurveTo(730, 240, 730, 270), n.quadraticCurveTo(730, 300, 690, 300), n.lineTo(220, 300), n.lineTo(220, 240), n.fill(), n.stroke(), n.closePath(), n.font = '25px "Zen Dots"', n.fillStyle = "#fff", n.fillText(a.replace("{count}", e.guild.memberCount), 290, 280), n.beginPath(), n.fillStyle = "#fff", n.arc(160, 200, 125, 0, 2 * Math.PI, !0), n.fill(), n.beginPath(), n.arc(160, 200, 120, 0, 2 * Math.PI, !0), n.closePath(), n.clip();
            const m = await Canvas.loadImage(e.user.displayAvatarURL({ format: "jpg" }));
            n.drawImage(m, 40, 80, 240, 240);
            const d = new Discord.MessageAttachment(i.toBuffer(), "welcome-image.png");
            if (t)
                if (l.message) {
                    msg = `${l.message}`.replace(/{user}/g, e).replace(/{server}/g, e.guild.name).replace(/{username}/g, e.user.username).replace(/{inviter}/g, "Unknow").replace(/{invites}/g, "**0**").replace(/{tag}/g, e.user.tag).replace(/{membercount}/g, e.guild.memberCount).replace(/{memberCount}/g, e.guild.memberCount);
                    if (l.image && l.embed) {
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
    }


};