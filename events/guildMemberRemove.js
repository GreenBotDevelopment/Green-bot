const Welcome = require('../database/models/Welcome');
const emoji = require('../emojis.json');
const config = require('../config.json');
const Discord = require('discord.js');
const Canvas = require('canvas');
module.exports = {


    async execute(member, client) {

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
                    const canvas = Canvas.createCanvas(1024, 450);
                    const ctx = canvas.getContext('2d');

                    const background = await Canvas.loadImage('https://tutos-du-web.com/uploads/image.png');
                    ctx.drawImage(background, 0, 0, canvas.width, canvas.height);

                    ctx.strokeStyle = '#100101 ';
                    ctx.strokeRect(0, 0, canvas.width, canvas.height);


                    ctx.font = '35px sans-serif';
                    ctx.fillStyle = '#100101 ';
                    ctx.fillText('AU REVOIR ', canvas.width / 6, canvas.height / 3.5);


                    ctx.font = applyText(canvas, `${member.displayName}`);
                    ctx.fillStyle = '#100101 ';

                    ctx.fillText(`${member.displayName}`, canvas.width / 6, canvas.height / 1.8);


                    ctx.font = '35px sans-serif';
                    ctx.fillStyle = '#100101 ';
                    ctx.fillText(`#${member.guild.memberCount} Membres dans le serveur`, canvas.width / 6, canvas.height / 1.3);



                    ctx.beginPath();

                    ctx.lineWidth = 10;

                    ctx.strokeStyle = "#03A9F4";

                    ctx.arc(778, 220, 135, 0, Math.PI * 2, true);

                    ctx.stroke();

                    ctx.closePath();

                    ctx.clip();
                    const avatar = await Canvas.loadImage(member.user.displayAvatarURL({ format: 'jpg' }));

                    ctx.drawImage(avatar, 645, 90, 270, 270);

                    const attachment = new Discord.MessageAttachment(canvas.toBuffer(), 'leave-image.png');
                    if (welcomechannel) {

                        if (welcomedb.message) {
                            msg = `${welcomedb.message}`
                                .replace(/{user}/g, member)
                                .replace(/{server}/g, member.guild.name)
                                .replace(/{username}/g, member.user.username)

                            .replace(/{tag}/g, member.user.tag)

                            .replace(/{membercount}/g, member.guild.memberCount);
                            if (welcomedb.image) {
                                welcomechannel.send(`${msg}`, attachment);
                            } else {

                                welcomechannel.send(msg);
                            }
                        } else {
                            if (welcomedb.image) {
                                welcomechannel.send(attachment);

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
            const fetchedLogs = await member.guild.fetchAuditLogs({
                limit: 1,
                type: 'MEMBER_KICK',
            });

            const kickLog = fetchedLogs.entries.first();


            if (!kickLog) {
                const reportEmbed = new Discord.MessageEmbed()
                    .setTitle(`Départ de ${member.user.tag}`)
                    .setThumbnail(member.user.displayAvatarURL())

                .setDescription(`${member.guild.memberCount} membres dans le serveur.`)



                .setFooter(client.footer)

                .setColor("#DA7226");
                logchannel.send(reportEmbed);
                return;
            }


            const { executor, target } = kickLog;


            if (target.id === member.id) {
                const reportEmbed = new Discord.MessageEmbed()

                .setDescription(` **${executor.user.tag}** a expulsé **${member.user.tag}** du serveur ! `)
                    .setTitle(`${member.guild.memberCount} membres dans le serveur.`)
                    .setThumbnail(member.user.displayAvatarURL())

                .setFooter(client.footer)

                .setColor("#DA7226");
                logchannel.send(reportEmbed);
                return;
            } else {
                const reportEmbed = new Discord.MessageEmbed()
                    .setTitle(`Départ de ${member.user.tag}`)
                    .setThumbnail(member.user.displayAvatarURL())

                .setDescription(`${member.guild.memberCount} membres dans le serveur.`)



                .setFooter(client.footer)

                .setColor("#DA7226");
                logchannel.send(reportEmbed);
                return;
            }
        }
    }

};
