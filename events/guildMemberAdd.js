const Welcome = require('../database/models/Welcome');
const emoji = require('../emojis.json');
const counter = require('../database/models/counter')
const guild = require('../database/models/guild');

const config = require('../config.json');
const Discord = require('discord.js');
const moment = require('moment')
const Canvas = require('canvas');
module.exports = {


        async execute(member, client) {
            let logdb = await Welcome.findOne({ serverID: member.guild.id, reason: 'logs' })
            let logchannel;
            if (!logdb) {
                logchannel = null;
            } else {
                logchannel = member.guild.channels.cache.get(logdb.channelID);

            }


            const reportEmbed = new Discord.MessageEmbed()
                .setTitle(`Arrivée de ${member.user.tag}`)
                .setThumbnail(member.user.displayAvatarURL())

            .setDescription(`Compté crée le ${moment(member.user.createdTimestamp).locale('fr').format('LT ,')} ${moment(member.user.createdTimestamp).locale('fr').format('LL, ')} ${moment(member.user.createdTimestamp).locale('fr').fromNow()}`)



            .setFooter(client.footer)

            .setColor("#04781B");
            if (logchannel) logchannel.send(reportEmbed);

            if (!member.user.bot) {
                const autonicke = await guild.findOne({ serverID: member.guild.id, reason: `autonick` });
                if (autonicke) {
                    let texte = autonicke.content ? autonicke.content.replace('{username}', member.user.username) : member.user.username;
                    await member.setNickname(texte, "Plugin d'auto surnom activé");

                }
                const autoroledb = await Welcome.findOne({ serverID: member.guild.id, reason: `autorole` })
                if (autoroledb) {
                    let role = member.guild.roles.cache.get(autoroledb.channelID)
                    if (!role) {
                        if (logchannel) logchannel.mainMessage(`**Autorôle**\nJe n'ai pas trouvé le rôle à donner , ce role a peut être été supprimé`, '#EADEDB')
                    } else {
                        try {
                            member.roles.add(role, "Plugin d'autorôle")
                        } catch (error) {
                            if (logchannel) logchannel.mainMessage(`**Autorôle**\nJe n'ai pas pu donner le rôle , vérifiez mes permissions`, '#EADEDB')

                        }
                    }
                }
            } else {
                const autonicke = await guild.findOne({ serverID: member.guild.id, reason: `autonick_bot` });
                if (autonicke) {
                    let texte = autonicke.content ? autonicke.content.replace('{username}', member.user.username) : member.user.username;
                    await member.setNickname(texte, "Plugin d'auto surnom activé");

                }
                const autoroledb = await Welcome.findOne({ serverID: member.guild.id, reason: `autorole_bot` })
                if (autoroledb) {
                    let role = member.guild.roles.cache.get(autoroledb.channelID)
                    if (!role) {
                        if (logchannel) logchannel.mainMessage(`**Autorôle Bot**\nJe n'ai pas trouvé le rôle à donner , ce role a peut être été supprimé`, '#EADEDB')
                    } else {
                        try {
                            member.roles.add(role, "Plugin d'autorôle")
                        } catch (error) {
                            if (logchannel) logchannel.mainMessage(`**Autorôle Bot**\nJe n'ai pas pu donner le rôle , vérifiez mes permissions`, '#EADEDB')

                        }
                    }
                }
            }
            const verify = await counter.findOne({ serverID: member.guild.id })
            if (verify) {
                if (member.guild.memberCount !== member.guild.members.cache.size) await member.guild.members.fetch()

                const members = member.guild.members.cache;
                let pos = 0;
                let memberc = member.guild.channels.cache.get(verify.MembersID)
                if (memberc) {
                    pos = pos + 1;
                    memberc.edit({ name: `👦 Humains :${members.filter(member => !member.user.bot).size}` })
                }
                let bot = member.guild.channels.cache.get(verify.totalID)
                if (bot) {
                    pos = pos + 1;
                    bot.edit({ name: `🌎 Total : ${member.guild.memberCount}` })
                }
                let total = member.guild.channels.cache.get(verify.BotsID)
                if (total) {
                    pos = pos + 1;
                    total.edit({ name: `🤖 Bots :${members.filter(member => member.user.bot).size}` })
                }


                if (logchannel) logchannel.mainMessage(`J'ai bien actualisé le compteur de membres ainsi que les salons .`, '#EADEDB')
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
                                    member.guild.fetchAuditLogs().then(async(logs) => {
                                                let adder = ''
                                                if (logs.entries.first().action === 'BOT_ADD') {
                                                    adder = logs.entries.first().executor.id
                                                }
                                                if (welcomedb.image && welcomedb.embed) {
                                                    let WelcomeEmbed = new Discord.MessageEmbed()
                                                        .setColor(client.color)
                                                        .setAuthor(member.user.tag, member.user.displayAvatarURL())
                                                        .setDescription(`Le bot ${member} a rejoint le serveur . Il a été ajouté par ${adder ? `<@${adder}>` : 'Je n\'arrive pas à déterminer qui'}`)
                                                        .setImage('attachment://welcome-image.png')
                                                        .attachFiles(attachment)
                                                        .setFooter(`${member.guild.memberCount} membres dans le serveur`,member.guild.iconURL({ dynamic: true, size: 512 }));
                                                    welcomechannel.send(WelcomeEmbed);
                                } else if(welcomedb.image) {
                                    welcomechannel.send(`Le bot ${member} a rejoint le serveur . Il a été ajouté par ${adder ? `<@${adder}>` : 'Je n\'arrive pas à déterminer qui'}`,attachment)
                                }else{
                                    if(welcomedb.embed){
                                        let WelcomeEmbed = new Discord.MessageEmbed()
                                        .setColor(client.color)
                                        .setAuthor(member.user.tag,member.user.displayAvatarURL())
                                        .setDescription(`Le bot ${member} a rejoint le serveur . Il a été ajouté par ${adder ? `<@${adder}>` : 'Je n\'arrive pas à déterminer qui'}`)
                                      
                                        .setFooter(`${member.guild.memberCount} membres dans le serveur`,member.guild.iconURL({ dynamic: true, size: 512 }));
                                        welcomechannel.send(WelcomeEmbed);
                                    }else{
                                        welcomechannel.send(msg);

                                    }
                                }
                                })
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
                                            .replace(/{inviter}/g, usedInvite ? `${usedInvite.inviter}` : `je n'arrive pas à déterminer qui`)
                                            .replace(/{invites}/g, `**${userInviteCount}**`)
                                            .replace(/{tag}/g, member.user.tag)

                                        .replace(/{membercount}/g, member.guild.memberCount);
                                    } else {

                                        msg = `${welcomedb.message}`
                                            .replace(/{user}/g, member)
                                            .replace(/{server}/g, member.guild.name)
                                            .replace(/{username}/g, member.user.username)
                                            .replace(/{inviter}/g, usedInvite ? `${usedInvite.inviter}` : `je n'arrive pas à déterminer qui`)
                                            .replace(/{invites}/g, '**0**')
                                            .replace(/{tag}/g, member.user.tag)

                                        .replace(/{membercount}/g, member.guild.memberCount);
                                    }

                                    if (welcomedb.image && welcomedb.embed) {
                                        let WelcomeEmbed = new Discord.MessageEmbed()
                                        .setColor(client.color)
                                        .setAuthor(member.user.tag,member.user.displayAvatarURL())
                                        .setDescription(msg)
                                        .setImage('attachment://welcome-image.png')
                                        .attachFiles(attachment)
                                        .setFooter(`${member.guild.memberCount} membres dans le serveur`,member.guild.iconURL({ dynamic: true, size: 512 }));
                                        welcomechannel.send(WelcomeEmbed);
                                    } else if(welcomedb.image){
                                        welcomechannel.send(`${msg}`, attachment);

                                    }else{
                                        if(welcomedb.embed){
                                            let WelcomeEmbed = new Discord.MessageEmbed()
                                            .setColor(client.color)
                                            .setAuthor(member.user.tag,member.user.displayAvatarURL())
                                            .setDescription(msg)
                                          
                                            .setFooter(`${member.guild.memberCount} membres dans le serveur`,member.guild.iconURL({ dynamic: true, size: 512 }));
                                            welcomechannel.send(WelcomeEmbed);
                                        }else{
                                            welcomechannel.send(msg);

                                        }

                                    }
                                })
                            } else {

                                msg = `${welcomedb.message}`
                                    .replace(/{user}/g, member)
                                    .replace(/{server}/g, member.guild.name)
                                    .replace(/{username}/g, member.user.username)
                                    .replace(/{inviter}/g, 'Je n\'arrive pas à déterminer qui')
                                    .replace(/{invites}/g, '0')
                                    .replace(/{tag}/g, member.user.tag)

                                .replace(/{membercount}/g, member.guild.memberCount);
                                if (welcomedb.image && welcomedb.embed) {
                                    let WelcomeEmbed = new Discord.MessageEmbed()
                                    .setColor(client.color)
                                    .setAuthor(member.user.tag,member.user.displayAvatarURL())
                                    .setDescription(msg)
                                    .setImage('attachment://welcome-image.png')
                                    .attachFiles(attachment)
                                    .setFooter(`${member.guild.memberCount} membres dans le serveur`,member.guild.iconURL({ dynamic: true, size: 512 }));
                                    welcomechannel.send(WelcomeEmbed);
                                } else if(welcomedb.image){
                                    welcomechannel.send(`${msg}`, attachment);

                                }else{
                                    if(welcomedb.embed){
                                        let WelcomeEmbed = new Discord.MessageEmbed()
                                        .setColor(client.color)
                                        .setAuthor(member.user.tag,member.user.displayAvatarURL())
                                        .setDescription(msg)
                                      
                                        .setFooter(`${member.guild.memberCount} membres dans le serveur`,member.guild.iconURL({ dynamic: true, size: 512 }));
                                        welcomechannel.send(WelcomeEmbed);
                                    }else{
                                        welcomechannel.send(msg);

                                    }

                                }

                            }











                        } else {
                            if (welcomedb.image) {
                                if(welcomedb.embed){
                                    let WelcomeEmbed = new Discord.MessageEmbed()
                                    .setColor(client.color)
                                    .setAuthor(member.user.tag,member.user.displayAvatarURL())
                                    .setImage('attachment://welcome-image.png')
                                    .attachFiles(attachment)
                                    .setFooter(`${member.guild.memberCount} membres dans le serveur`,member.guild.iconURL({ dynamic: true, size: 512 }));
                                    welcomechannel.send(WelcomeEmbed);
                                }else{
                                    welcomechannel.send(attachment);

                                } 
                            }
                        }

                    }
                }

            }
        }


    }
};