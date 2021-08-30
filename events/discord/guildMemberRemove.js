const Welcome = require('../../database/models/Welcome');
const Discord = require('discord.js');
const counter = require('../../database/models/counter')
const Canvas = require('canvas');
module.exports = {
    async execute(member, client) {
        let logdb = await Welcome.findOne({ serverID: member.guild.id, reason: 'logs' })
        let logchannele;
        if (!logdb) {
            logchannele = null;
        } else {
            logchannele = member.guild.channels.cache.get(logdb.channelID);

        }
        const verifycount = await counter.findOne({ serverID: member.guild.id })
        if (verifycount) {
            if (member.guild.memberCount !== member.guild.members.cache.size) await member.guild.members.fetch()

            const members = member.guild.members.cache;
            let l = await member.guild.translate("COUNTER")

            let pos = 0;
            let memberc = member.guild.channels.cache.get(verifycount.MembersID)
            if (memberc) {
                pos = pos + 1;
                member.edit({ name: `👦 ${l.a} :${members.filter(member => !member.user.bot).size}` })
            }
            let bot = member.guild.channels.cache.get(verifycount.totalID)
            if (bot) {
                pos = pos + 1;
                bot.edit({ name: `🌎 ${l.c} : ${member.guild.memberCount}` })
            }
            let total = member.guild.channels.cache.get(verifycount.BotsID)
            if (total) {
                pos = pos + 1;
                total.edit({ name: `🤖 Bots :${members.filter(member => member.user.bot).size}` })
            }

        }
        const applyText = (canvas, text) => {
            const ctx = canvas.getContext('2d');
            let fontSize = 70;

            do {
                ctx.font = `${fontSize -= 10}px Bold`;
            } while (ctx.measureText(text).width > canvas.width - 300);

            return ctx.font;
        };
        let welcomedb = await Welcome.findOne({ serverID: member.guild.id, reason: 'leave' })
        if (welcomedb) {

            if (welcomedb.status) {

                if (welcomedb.channelID) {
                    let welcomechannel = member.guild.channels.cache.get(welcomedb.channelID);
                    const canvas = Canvas.createCanvas(800, 400);
                    const ctx = canvas.getContext('2d');

                    ctx.beginPath();
                    ctx.fillStyle = "#A27D4E";
                    ctx.lineWidth = 1.5;
                    ctx.moveTo(220, 110);
                    ctx.lineTo(690, 110);
                    ctx.quadraticCurveTo(730, 110, 730, 140);
                    ctx.quadraticCurveTo(730, 170, 690, 170);
                    ctx.lineTo(220, 170);
                    ctx.lineTo(220, 110);
                    ctx.fill();
                    ctx.stroke();
                    ctx.closePath();

                    ctx.font = '40px "Zen Dots"';
                    ctx.fillStyle = "#fff";
                    ctx.fillText("Au revoir", 290, 155)

                    ctx.beginPath();
                    ctx.fillStyle = "#A27D4E";
                    ctx.lineWidth = 1.5;
                    ctx.moveTo(230, 175);
                    ctx.lineTo(690, 175);
                    ctx.quadraticCurveTo(730, 175, 730, 205);
                    ctx.quadraticCurveTo(730, 235, 690, 235);
                    ctx.lineTo(230, 235);
                    ctx.lineTo(230, 175);
                    ctx.fill();
                    ctx.stroke();
                    ctx.closePath();

                    ctx.font = '25px "Zen Dots"';
                    ctx.fillStyle = "#fff";
                    ctx.fillText(`${member.user.username}`, 290, 215)

                    ctx.beginPath();
                    ctx.fillStyle = "#A27D4E";
                    ctx.lineWidth = 1.5;
                    ctx.moveTo(220, 240);
                    ctx.lineTo(690, 240);
                    ctx.quadraticCurveTo(730, 240, 730, 270);
                    ctx.quadraticCurveTo(730, 300, 690, 300);
                    ctx.lineTo(220, 300);
                    ctx.lineTo(220, 240);
                    ctx.fill();
                    ctx.stroke();
                    ctx.closePath();
                    let a = await member.guild.translate("WEARENOW");

                    ctx.font = '25px "Zen Dots"';
                    ctx.fillStyle = "#fff";
                    ctx.fillText(a.replace("{count}", member.guild.memberCount), 290, 280)

                    ctx.beginPath();
                    ctx.fillStyle = "#fff";
                    ctx.arc(160, 200, 125, 0, Math.PI * 2, true);
                    ctx.fill();

                    ctx.beginPath();
                    ctx.arc(160, 200, 120, 0, Math.PI * 2, true);
                    ctx.closePath();
                    ctx.clip();

                    const avatar = await Canvas.loadImage(member.user.displayAvatarURL({ format: 'jpg' }));
                    ctx.drawImage(avatar, 40, 80, 240, 240);

                    const attachment = new Discord.MessageAttachment(canvas.toBuffer(), `welcome-image.png`);

                    if (welcomechannel) {

                        if (welcomedb.message) {
                            msg = `${welcomedb.message}`
                                .replace(/{user}/g, member)
                                .replace(/{server}/g, member.guild.name)
                                .replace(/{username}/g, member.user.username)

                            .replace(/{tag}/g, member.user.tag)

                            .replace(/{membercount}/g, member.guild.memberCount);
                            if (welcomedb.image) {
                                welcomechannel.send({ content: msg, files: [attachment] });
                            } else {

                                welcomechannel.send(msg);
                            }
                        } else {
                            if (welcomedb.image) {
                                welcomechannel.send({ files: [attachment] });

                            }
                        }

                    }
                }

            }
        }
        let welcomedbe = await Welcome.findOne({ serverID: member.guild.id, reason: 'logs' })
        if (welcomedbe) {
            let logchannel = member.guild.channels.cache.get(welcomedbe.channelID);
            if (!logchannel) return;
            const lang = await member.guild.translate("LEAVE")
            const reportEmbed = new Discord.MessageEmbed()
                .setTitle(lang.title.replace("{username}", member.user.username))
                .setThumbnail(member.user.displayAvatarURL())

            .setDescription(lang.now.replace("{x}", member.guild.memberCount))



            .setFooter(client.footer)

            .setColor("#DA7226");
            logchannel.send({ embeds: [reportEmbed] });

        }
    }

};