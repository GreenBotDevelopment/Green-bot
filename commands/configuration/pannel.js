const Discord = require('discord.js');
const sendErrorMessage = require('../../util.js');
const Welcome = require('../../database/models/Welcome');
const emoji = require('../../emojis.json')
const guild = require('../../database/models/guild');

const { stripIndent, oneLine } = require('common-tags');
module.exports = {
    name: 'pannel',
    description: 'Affiche les configurations de green sur le serveur',
    aliases: ['setting', 'set', 's', 'config', 'conf'],
    cat: 'configuration',
    permissions: ['MANAGE_GUILD'],
    async execute(message, args) {

        const verify = await Welcome.findOne({ serverID: message.guild.id, reason: `welcome` })
        const leavedb = await Welcome.findOne({ serverID: message.guild.id, reason: `leave` })
        if (!leavedb) {
            if (verify) {
                const prefixe = await guild.findOne({ serverID: message.guild.id, reason: `prefix` });

                let welcomeChannel;
                if (verify.channelID) {
                    welcomeChannel = `<#` + verify.channelID + `>`;
                } else {
                    welcomeChannel = 'Aucun';
                }
                let welcomeMessage = verify.message || 'Aucun';
                let welcomeImage = verify.image ? 'Activée' : 'Désactivée' || 'Désactivée';
                let welcomeStatus = verify.status ? `${emoji.succes} Activé` : `${emoji.error} Désactivé` || `${emoji.error} Désactivé`;


                const embed = new Discord.MessageEmbed()
                    .setThumbnail(message.guild.iconURL({ dynamic: true }))
                    .setFooter(message.client.footer)
                    .setTitle('Paramètres du bot')
                    .addField('__**Système**__', stripIndent `
                        Prefixe : ${prefixe.content}
                        
                        `)
                    .addField('__**Messages de bienvenue**__', stripIndent `
                        Statut : ${welcomeStatus}
                        Salon : ${welcomeChannel}
                        Image : ${welcomeImage}
                        Message : ${welcomeMessage}
                        `)
                    .addField('__**Messages d\'au Revoir**__', stripIndent `
                    Statut : ${emoji.error} Désactivé
                    Salon : Aucun
                    Image : Désactivée
                    Message : Aucun
        `)
                    .setColor(message.client.color);

                return message.channel.send(embed);
            } else {

                const embed = new Discord.MessageEmbed()
                    .setThumbnail(message.guild.iconURL({ dynamic: true }))
                    .setFooter(message.client.footer)
                    .setTitle('Paramètres du bot')
                    .addField('__**Messages de bienvenue**__', stripIndent `
       Statut : ${emoji.error} Désactivé
       Salon : Aucun
       Image : Désactivée
       Message : Aucun
      `)
                    .addField('__**Messages d\'au Revoir**__', stripIndent `
        Statut : ${emoji.error} Désactivé
        Salon : Aucun
        Image : Désactivée
        Message : Aucun
     `)
                    .setColor(message.client.color);

                return message.channel.send(embed);

            }
        }
        if (!verify) {
            if (leavedb) {
                const prefixe = await guild.findOne({ serverID: message.guild.id, reason: `prefix` });


                let leaveChannel;
                if (leavedb.channelID) {
                    leaveChannel = `<#` + leavedb.channelID + `>`;
                } else {
                    leaveChannel = 'Aucun';
                }
                let leaveMessage = leavedb.message || 'Aucun';
                let leaveImage = leavedb.image ? 'Activée' : 'Désactivée' || 'Désactivée';
                let leaveStatus = leavedb.status ? `${emoji.succes} Activé` : `${emoji.error} Désactivé` || `${emoji.error} Désactivé`;



                const embed = new Discord.MessageEmbed()
                    .setThumbnail(message.guild.iconURL({ dynamic: true }))
                    .setFooter(message.client.footer)
                    .setTitle('Paramètres du bot')
                    .addField('__**Système**__', stripIndent `
                        Prefixe : ${prefixe.content}
                        
                        `)
                    .addField('__**Messages de bienvenue**__', stripIndent `
                    Statut : ${emoji.error} Désactivé
                    Salon : Aucun
                    Image : Désactivée
                    Message : Aucun
        `)
                    .addField('__**Messages d\'au Revoir**__', stripIndent `
        Statut : ${leaveStatus}
        Salon : ${leaveChannel}
        Image : ${leaveImage}
        Message : ${leaveMessage}
        `)
                    .setColor(message.client.color);

                return message.channel.send(embed);
            } else {

                const embed = new Discord.MessageEmbed()
                    .setThumbnail(message.guild.iconURL({ dynamic: true }))
                    .setFooter(message.client.footer)
                    .setTitle('Paramètres du bot')
                    .addField('__**Messages de bienvenue**__', stripIndent `
       Statut : ${emoji.error} Désactivé
       Salon : Aucun
       Image : Désactivée
       Message : Aucun
      `)
                    .addField('__**Messages d\'au Revoir**__', stripIndent `
        Statut : ${emoji.error} Désactivé
        Salon : Aucun
        Image : Désactivée
        Message : Aucun
     `)
                    .setColor(message.client.color);

                return message.channel.send(embed);

            }
        }
        const prefixe = await guild.findOne({ serverID: message.guild.id, reason: `prefix` });


        let leaveChannel;
        if (leavedb.channelID) {
            leaveChannel = `<#` + leavedb.channelID + `>`;
        } else {
            leaveChannel = 'Aucun';
        }
        let leaveMessage = leavedb.message || 'Aucun';
        let leaveImage = leavedb.image ? 'Activée' : 'Désactivée' || 'Désactivée';
        let leaveStatus = leavedb.status ? `${emoji.succes} Activé` : `${emoji.error} Désactivé` || `${emoji.error} Désactivé`;

        let welcomeChannel;
        if (verify.channelID) {
            welcomeChannel = `<#` + verify.channelID + `>`;
        } else {
            welcomeChannel = 'Aucun';
        }
        let welcomeMessage = verify.message || 'Aucun';
        let welcomeImage = verify.image ? 'Activée' : 'Désactivée' || 'Désactivée';
        let welcomeStatus = verify.status ? `${emoji.succes} Activé` : `${emoji.error} Désactivé` || `${emoji.error} Désactivé`;

        const embed = new Discord.MessageEmbed()
            .setThumbnail(message.guild.iconURL({ dynamic: true }))
            .setFooter(message.client.footer)
            .setTitle('Paramètres du bot')
            .addField('__**Système**__', stripIndent `
                Prefixe : ${prefixe.content}
                
                `)
            .addField('__**Messages de bienvenue**__', stripIndent `
Statut : ${welcomeStatus}
Salon : ${welcomeChannel}
Image : ${welcomeImage}
Message : ${welcomeMessage}
`)
            .addField('__**Messages d\'au Revoir**__', stripIndent `
Statut : ${leaveStatus}
Salon : ${leaveChannel}
Image : ${leaveImage}
Message : ${leaveMessage}
`)
            .setColor(message.client.color);

        message.channel.send(embed);









    },
};