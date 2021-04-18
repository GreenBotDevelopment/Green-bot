const config = require('../config.json');
const Discord = require('discord.js');
const emojis = require('../emojis.json');
const Welcome = require('../database/models/Welcome')
const giveawayModel = require('../database/models/giveaway');

module.exports = {


    async execute(giveaway, member, reaction, client) {
        if (reaction.message.partial) await reaction.message.fetch();
        let message = reaction.message;
        const verify = await Welcome.findOne({ serverID: message.guild.id, reason: `giveaway_c` })
        let logschannel;
        if (verify) {
            logschannel = message.guild.channels.cache.get(verify.channelID);
        } else {
            logschannel = null;
        }

        const verifyblack = await Welcome.findOne({ serverID: message.guild.id, channelID: member.user.id, reason: `giveaway_black` })
        if (verifyblack) {
            const succese = new Discord.MessageEmbed()
                .setTitle(`${emojis.error} - Participation Refusée`)
                .setURL('http://green-bot.xyz/')
                .setDescription(`Votre participation pour [ce giveaway](${message.url}) a été refusée ! Vous avez été blacklisté du système de giveaway .`)
                .addFields({ name: "🧷 Liens utliles", value: `
        [Dashboard](http://green-bot.xyz/)-[Inviter le bot](http://discord.com/oauth2/authorize?client_id=${client.user.id}&scope=bot&permissions=8) - [Support](http://discord.gg/nrReAmApVJ) - [Github](http://github.com/pauldb09/Green-bot)` })
                .setColor('#982318')
                .setFooter(config.footer)
            member.send(succese)
            reaction.users.remove(member.user);
            const logembed = new Discord.MessageEmbed()
                .setTitle(`${emojis.error} - Participation Refusée `)
                .setURL('http://green-bot.xyz/')
                .setDescription(`La participation de ${member} à [ce giveaway](${message.url}) a été refusée .Car il est dans la blacklist des giveaways`)
                .setColor('#982318')
                .setFooter(config.footer)
            if (logschannel) logschannel.send(logembed)
            return;
        }
        const find = await giveawayModel.findOne({ serverID: giveaway.guildID, MessageID: giveaway.messageID })
        if (find) {


            if (find.requiredMessages && find.requiredInvites) {
                const invites = await message.guild.fetchInvites().catch(() => {});

                const memberInvites = invites.filter((i) => i.inviter && i.inviter.id === member.user.id);
                let inviteshas;
                if (memberInvites.size <= 0) {
                    inviteshas = 0;
                } else {

                    let index = 0;
                    memberInvites.forEach((invite) => index += invite.uses);
                    inviteshas = index;
                }
                const levelModel = require('../database/models/level');
                const userdata = await levelModel.findOne({ serverID: giveaway.guildID, userID: member.id })



                if (!userdata) {
                    const succese = new Discord.MessageEmbed()
                        .setTitle(`${emojis.error} - Participation Refusée`)
                        .setURL('http://green-bot.xyz/')
                        .setDescription(`Votre participation pour [ce giveaway](${message.url}) a été refusée ! Vous devez avoir ${find.requiredMessages} Messages !!`)
                        .addFields({ name: "🧷 Liens utliles", value: `
        [Dashboard](http://green-bot.xyz/)-[Inviter le bot](http://discord.com/oauth2/authorize?client_id=${client.user.id}&scope=bot&permissions=8) - [Support](http://discord.gg/nrReAmApVJ) - [Github](http://github.com/pauldb09/Green-bot)` })
                        .setColor('#982318')
                        .setFooter(config.footer)
                    member.send(succese)
                    reaction.users.remove(member.user);
                    const logembed = new Discord.MessageEmbed()
                        .setTitle(`${emojis.error} - Participation Refusée `)
                        .setURL('http://green-bot.xyz/')
                        .setDescription(`La participation de ${member} à [ce giveaway](${message.url}) a été refusée .\n__Conditions__\nMessages : **0/${find.requiredMessages}**\nInvitations : ${inviteshas}/${find.requiredInvites}`)
                        .setColor('#982318')
                        .setFooter(config.footer)
                    if (logschannel) logschannel.send(logembed)
                    return;
                }
                if (find.requiredMessages < userdata.messagec || find.requiredMessages == userdata.messagec && find.requiredInvites < inviteshas || find.requiredInvites == inviteshas) {
                    const succes = new Discord.MessageEmbed()
                        .setTitle(`${emojis.succes} - Participation acceptée`)
                        .setDescription(`Votre participation pour [ce giveaway](${message.url}) a été acceptée , vous remplissez les conditions  ! Bonne chance !`)
                        .addFields({ name: "🧷 Liens utliles", value: `
        [Dashboard](http://green-bot.xyz/)-[Inviter le bot](http://discord.com/oauth2/authorize?client_id=${client.user.id}&scope=bot&permissions=8) - [Support](http://discord.gg/nrReAmApVJ) - [Github](http://github.com/pauldb09/Green-bot)` })
                        .setColor(config.color)
                        .setURL('http://green-bot.xyz/')

                    .setFooter(config.footer)
                    member.send(succes)
                    const logembed = new Discord.MessageEmbed()
                        .setTitle(`${emojis.succes} - Participation Acceptée `)
                        .setDescription(`La participation de ${member} à [ce giveaway](${message.url}) a été acceptée . \n__Conditions__\nMessages : **${userdata.messagec}/${find.requiredMessages}**\nInvitations : ${inviteshas}/${find.requiredInvites}`)
                        .setColor(config.color)
                        .setURL('http://green-bot.xyz/')

                    .setFooter(config.footer)
                    if (logschannel) logschannel.send(logembed)
                    return;
                } else {

                    const succese = new Discord.MessageEmbed()
                        .setTitle(`${emojis.error} - Participation Refusée`)
                        .setURL('http://green-bot.xyz/')

                    .setDescription(`Votre participation pour [ce giveaway](${message.url}) a été refusée : \n__Conditions__\nMessages : **${userdata.messagec}/${find.requiredMessages}**\nInvitations : **${inviteshas}/${find.requiredInvites}** `)
                        .addFields({ name: "🧷 Liens utliles", value: `
        [Dashboard](http://green-bot.xyz/)-[Inviter le bot](http://discord.com/oauth2/authorize?client_id=${client.user.id}&scope=bot&permissions=8) - [Support](http://discord.gg/nrReAmApVJ) - [Github](http://github.com/pauldb09/Green-bot)` })
                        .setColor('#982318')
                        .setFooter(config.footer)
                    member.send(succese)
                    reaction.users.remove(member.user);
                    const logembed = new Discord.MessageEmbed()
                        .setTitle(`${emojis.error} - Participation Refusée `)
                        .setURL('http://green-bot.xyz/')

                    .setDescription(`La participation de ${member} à [ce giveaway](${message.url}) a été refusée .\n__Conditions__\nMessages : **${userdata.messagec}/${find.requiredMessages}**\nInvitations : ${inviteshas}/${find.requiredInvites}`)
                        .setColor('#982318')
                        .setFooter(config.footer)
                    if (logschannel) logschannel.send(logembed)
                    return;
                }
            } else {
                if (find.requiredMessages) {
                    const levelModel = require('../database/models/level');
                    const userdata = await levelModel.findOne({ serverID: giveaway.guildID, userID: member.id })
                    if (!userdata) {
                        const succese = new Discord.MessageEmbed()
                            .setTitle(`${emojis.error} - Participation Refusée`)
                            .setDescription(`Votre participation pour [ce giveaway](${message.url}) a été refusée ! Vous devez avoir ${find.requiredMessages} Messages !!`)
                            .addFields({ name: "🧷 Liens utliles", value: `
            [Dashboard](http://green-bot.xyz/)-[Inviter le bot](http://discord.com/oauth2/authorize?client_id=${client.user.id}&scope=bot&permissions=8) - [Support](http://discord.gg/nrReAmApVJ) - [Github](http://github.com/pauldb09/Green-bot)` })
                            .setColor('#982318')
                            .setURL('http://green-bot.xyz/')

                        .setFooter(config.footer)
                        member.send(succese)
                        reaction.users.remove(member.user);
                        const logembed = new Discord.MessageEmbed()
                            .setTitle(`${emojis.error} - Participation Refusée `)
                            .setDescription(`La participation de ${member} à [ce giveaway](${message.url}) a été refusée . Il a **0** messages /  **${find.requiredMessages}**`)
                            .setColor('#982318')
                            .setURL('http://green-bot.xyz/')
                            .setFooter(config.footer)
                        if (logschannel) logschannel.send(logembed)
                        return;
                    }
                    if (find.requiredMessages > userdata.messagec) {
                        const succese = new Discord.MessageEmbed()
                            .setTitle(`${emojis.error} - Participation Refusée`)
                            .setDescription(`Votre participation pour [ce giveaway](${message.url}) a été refusée ! Vous devez avoir ${find.requiredMessages} Messages !!`)
                            .addFields({ name: "🧷 Liens utliles", value: `
            [Dashboard](http://green-bot.xyz/)-[Inviter le bot](http://discord.com/oauth2/authorize?client_id=${client.user.id}&scope=bot&permissions=8) - [Support](http://discord.gg/nrReAmApVJ) - [Github](http://github.com/pauldb09/Green-bot)` })
                            .setColor('#982318')
                            .setURL('http://green-bot.xyz/')

                        .setFooter(config.footer)
                        member.send(succese)
                        reaction.users.remove(member.user);
                        const logembed = new Discord.MessageEmbed()
                            .setTitle(`${emojis.error} - Participation Refusée `)
                            .setDescription(`La participation de ${member} à [ce giveaway](${message.url}) a été refusée . Il a **${userdata.messagec}** messages / **${find.requiredMessages}**`)
                            .setColor('#982318')
                            .setURL('http://green-bot.xyz/')

                        .setFooter(config.footer)
                        if (logschannel) logschannel.send(logembed)
                        return;
                    } else {
                        const succes = new Discord.MessageEmbed()
                            .setTitle(`${emojis.succes} -  Participation acceptée`)
                            .setDescription(`Votre participation pour [ce giveaway](${message.url}) a été acceptée , vous remplissez les conditions  ! Bonne chance !`)
                            .addFields({ name: "🧷 Liens utliles", value: `
            [Dashboard](http://green-bot.xyz/)-[Inviter le bot](http://discord.com/oauth2/authorize?client_id=${client.user.id}&scope=bot&permissions=8) - [Support](http://discord.gg/nrReAmApVJ) - [Github](http://github.com/pauldb09/Green-bot)` })
                            .setColor(config.color)
                            .setURL('http://green-bot.xyz/')

                        .setFooter(config.footer)
                        member.send(succes)
                        const logembed = new Discord.MessageEmbed()
                            .setTitle(`${emojis.succes} - Participation Accpetée `)
                            .setDescription(`La participation de ${member} à [ce giveaway](${message.url}) a été acceptée . Il a **${userdata.messagec}** messages / **${find.requiredMessages}**`)
                            .setColor(config.color)
                            .setURL('http://green-bot.xyz/')

                        .setFooter(config.footer)
                        if (logschannel) logschannel.send(logembed)
                        return;
                    }
                }
                if (find.requiredInvites) {
                    const invites = await message.guild.fetchInvites().catch(() => {});

                    const memberInvites = invites.filter((i) => i.inviter && i.inviter.id === member.user.id);
                    let inviteshas;
                    if (memberInvites.size <= 0) {
                        inviteshas = 0;
                    } else {

                        let index = 0;
                        memberInvites.forEach((invite) => index += invite.uses);
                        inviteshas = index;
                    }
                    if (inviteshas > find.requiredInvites || inviteshas == find.requiredInvites) {
                        const succes = new Discord.MessageEmbed()
                            .setTitle(`${emojis.succes} - Participation acceptée`)
                            .setDescription(`Votre participation pour [ce giveaway](${message.url}) a été acceptée , vous remplissez les conditions  ! Bonne chance !`)
                            .addFields({ name: "🧷 Liens utliles", value: `
        [Dashboard](http://green-bot.xyz/)-[Inviter le bot](http://discord.com/oauth2/authorize?client_id=${client.user.id}&scope=bot&permissions=8) - [Support](http://discord.gg/nrReAmApVJ) - [Github](http://github.com/pauldb09/Green-bot)` })
                            .setColor(config.color)
                            .setURL('http://green-bot.xyz/')

                        .setFooter(config.footer)
                        member.send(succes)
                        const logembed = new Discord.MessageEmbed()
                            .setTitle(`${emojis.succes} - Participation Acceptée `)
                            .setDescription(`La participation de ${member} à [ce giveaway](${message.url}) a été acceptée . \n__Conditions__\nInvitations : **${inviteshas}/${find.requiredInvites}**`)
                            .setColor(config.color)
                            .setURL('http://green-bot.xyz/')
                            .setFooter(config.footer)
                        if (logschannel) logschannel.send(logembed)
                        return;
                    } else {
                        const succese = new Discord.MessageEmbed()
                            .setTitle(`${emojis.error} - Participation Refusée`)
                            .setURL('http://green-bot.xyz/')
                            .setDescription(`Votre participation pour [ce giveaway](${message.url}) a été refusée : \n__Conditions__\nInvitations : **${inviteshas}/${find.requiredInvites}** `)
                            .addFields({ name: "🧷 Liens utliles", value: `
        [Dashboard](http://green-bot.xyz/)-[Inviter le bot](http://discord.com/oauth2/authorize?client_id=${client.user.id}&scope=bot&permissions=8) - [Support](http://discord.gg/nrReAmApVJ) - [Github](http://github.com/pauldb09/Green-bot)` })
                            .setColor('#982318')
                            .setFooter(config.footer)
                        member.send(succese)
                        reaction.users.remove(member.user);
                        const logembed = new Discord.MessageEmbed()
                            .setTitle(`${emojis.error} - Participation Refusée `)
                            .setURL('http://green-bot.xyz/')
                            .setDescription(`La participation de ${member} à [ce giveaway](${message.url}) a été refusée .\n__Conditions__\nInvitations : ${inviteshas}/${find.requiredInvites}`)
                            .setColor('#982318')
                            .setFooter(config.footer)
                        if (logschannel) logschannel.send(logembed)
                        return;
                    }
                }
            }
        } else {
            const succes = new Discord.MessageEmbed()
                .setTitle(`${emojis.succes} Participation acceptée`)
                .setDescription(`Votre participation pour [ce giveaway](${message.url}) a été acceptée ! Bonne chance !`)
                .addFields({ name: "🧷 Liens utliles", value: `
                [Dashboard](http://green-bot.xyz/)-[Inviter le bot](http://discord.com/oauth2/authorize?client_id=${client.user.id}&scope=bot&permissions=8) - [Support](http://discord.gg/nrReAmApVJ) - [Github](http://github.com/pauldb09/Green-bot)` })
                .setColor(config.color)
                .setURL('http://green-bot.xyz/')

            .setFooter(config.footer)
            member.send(succes)
            const logembed = new Discord.MessageEmbed()
                .setTitle(`${emojis.succes} - Participation acceptée `)
                .setDescription(`La participation de ${member} à [ce giveaway](${message.url}) a été acceptée . `)
                .setColor(config.color)
                .setURL('http://green-bot.xyz/')
                .setFooter(config.footer)
            if (logschannel) logschannel.send(logembed)
        }

    }
};