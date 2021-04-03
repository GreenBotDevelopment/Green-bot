const Welcome = require('../database/models/Welcome');
const emoji = require('../emojis.json');
const config = require('../config.json');
const Discord = require('discord.js');
const moment = require('moment')
const Canvas = require('canvas');
module.exports = {

    async execute(member, client) {
        let logdb = await Welcome.findOne({ serverID: member.guild.id, reason: 'logs' })
        if (logdb) {
            let logchannel = member.guild.channels.cache.get(logdb.channelID);


            const reportEmbed = new Discord.MessageEmbed()
                .setTitle(`Arrivée de ${member.user.tag}`)
                .setThumbnail(member.user.displayAvatarURL())

            .setDescription(`Compté crée le ${moment(member.user.createdTimestamp).locale('fr').format('LT ,')} ${moment(member.user.createdTimestamp).locale('fr').format('LL, ')} ${moment(member.user.createdTimestamp).locale('fr').fromNow()}`)

            .setFooter(client.footer)

            .setColor("#04781B");
            if (logchannel) logchannel.send(reportEmbed);
        }
        const applyText = (canvas, text) => {
            const ctx = canvas.getContext('2d');
            let fontSize = 70;

            do {
                ctx.font = `${fontSize -= 10}px Bold`;
            } while (ctx.measureText(text).width > canvas.width - 300);

            return ctx.font;
        };

        const welcomedb = await Welcome.findOne({ serverID: member.guild.id, reason: 'welcome' })
        if (welcomedb) {
            if (welcomedb.status) {
                if (welcomedb.channelID) {
                    const welcomechannel = member.guild.channels.cache.get(welcomedb.channelID);
                    const canvas = Canvas.createCanvas(1024, 450);
                    const ctx = canvas.getContext('2d');

                    const background = await Canvas.loadImage('https://sftool.gov/Content/Images/GPC/gpc-jumbotron-bg.jpg');
                    ctx.drawImage(background, 0, 0, canvas.width, canvas.height);

                    ctx.strokeStyle = '#100101 ';
                    ctx.strokeRect(0, 0, canvas.width, canvas.height);


                    ctx.font = '35px sans-serif';
                    ctx.fillStyle = '#100101 ';
                    ctx.fillText(' BIENVENUE', canvas.width / 10, canvas.height / 3.5);


                    ctx.font = applyText(canvas, `${member.displayName}`);
                    ctx.fillStyle = '#100101 ';

                    ctx.fillText(`${member.displayName}`, canvas.width / 10, canvas.height / 1.8);

                    ctx.font = '35px sans-serif';
                    ctx.fillStyle = '#100101 ';
                    ctx.fillText(`#${member.guild.memberCount} membres dans le serveur`, canvas.width / 10, canvas.height / 1.3);

                    ctx.beginPath();

                    ctx.lineWidth = 10;

                    ctx.strokeStyle = "#03A9F4";

                    ctx.arc(778, 220, 135, 0, Math.PI * 2, true);

                    ctx.stroke();

                    ctx.closePath();

                    ctx.clip();
                    const avatar = await Canvas.loadImage(member.user.displayAvatarURL({ format: 'jpg' }));

                    ctx.drawImage(avatar, 645, 90, 270, 270);

                    const attachment = new Discord.MessageAttachment(canvas.toBuffer(), 'welcome-image.png');
                    if (welcomechannel) {

                        if (welcomedb.message) {

                            if (member.user.bot) {
                                if (welcomedb.image) {
                                    welcomechannel.send(`Le bot ${member} a rejoint le serveur en utilisant l'oAuth2 .`, attachment);
                                } else {

                                    welcomechannel.send(`Le bot ${member} a rejoint le serveur en utilisant l'oAuth2 .`);
                                }
                                return;
                            }
                            const guildInvites = client.guildInvites;
                            const cachedInvites = guildInvites.get(member.guild.id);
                            const newInvites = await member.guild.fetchInvites();
                            guildInvites.set(member.guild.id, newInvites);
                            const usedInvite = newInvites.find(inv => cachedInvites.get(inv.code).uses < inv.uses);
                            if (usedInvite) {
                                member.guild.fetchInvites()
                                    .then

                                    (invites => {
                                    const userInvites = invites.array().filter(o => o.inviter.id === usedInvite.inviter.id);
                                    if (userInvites) {
                                        var userInviteCount = 0;
                                        for (var i = 0; i < userInvites.length; i++) {
                                            var invite = userInvites[i];
                                            userInviteCount += invite['uses'];
                                        }
                                        msg = `${welcomedb.message}`
                                            .replace(/{user}/g, member)
                                            .replace(/{server}/g, member.guild.name)
                                            .replace(/{username}/g, member.user.username)
                                            .replace(/{inviter}/g, usedInvite.inviter)
                                            .replace(/{invites}/g, userInviteCount)
                                            .replace(/{tag}/g, member.user.tag)

                                        .replace(/{membercount}/g, member.guild.memberCount);
                                    } else {
                                        var userInviteCount = 0;
                                        for (var i = 0; i < userInvites.length; i++) {
                                            var invite = userInvites[i];
                                            userInviteCount += invite['uses'];
                                        }
                                        msg = `${welcomedb.message}`
                                            .replace(/{user}/g, member)
                                            .replace(/{server}/g, member.guild.name)
                                            .replace(/{username}/g, member.user.username)
                                            .replace(/{inviter}/g, usedInvite.inviter)
                                            .replace(/{invites}/g, '0')
                                            .replace(/{tag}/g, member.user.tag)

                                        .replace(/{membercount}/g, member.guild.memberCount);
                                    }

                                    if (welcomedb.image) {
                                        welcomechannel.send(`${msg}`, attachment);
                                    } else {

                                        welcomechannel.send(msg);
                                    }
                                })
                            } else {

                                msg = `${welcomedb.message}`
                                    .replace(/{user}/g, member)
                                    .replace(/{server}/g, member.guild.name)
                                    .replace(/{username}/g, member.user.username)
                                    .replace(/{inviter}/g, 'Un inconnu :eyes:')
                                    .replace(/{invites}/g, '0')
                                    .replace(/{tag}/g, member.user.tag)

                                .replace(/{membercount}/g, member.guild.memberCount);
                                if (welcomedb.image) {
                                    welcomechannel.send(`${msg}`, attachment);
                                } else {

                                    welcomechannel.send(msg);
                                }

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
    }
};
