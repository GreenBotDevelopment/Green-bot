const config = require('../../config.js');
const Discord = require('discord.js');
const Welcome = require('../../database/models/Welcome')
const giveawayModel = require('../../database/models/giveaway');
const levelModel = require('../../database/models/level');

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
        const lang = await message.guild.translate("GIVEAWAY_DM")
        const find = await giveawayModel.findOne({ serverID: giveaway.guildID, MessageID: giveaway.messageID })
        if (find) {


            if (find.requiredMessages && find.requiredInvites) {
                const invites = await message.guild.invites.fetch().catch(() => {});

                const memberInvites = invites.filter((i) => i.inviter && i.inviter.id === member.user.id);
                let inviteshas;
                if (memberInvites.size <= 0) {
                    inviteshas = 0;
                } else {

                    let index = 0;
                    memberInvites.forEach((invite) => index += invite.uses);
                    inviteshas = index;
                }
                const userdata = await levelModel.findOne({ serverID: giveaway.guildID, userID: member.id })



                if (!userdata) {
                    const succese = new Discord.MessageEmbed()
                        .setTitle(lang.title_no)
                        .setURL('https://green-bot.app/invite')
                        .setDescription(lang.deniedMsg.replace("{url}", message.url).replace("{count}", find.requiredMessages))

                    .setColor('#982318')
                        .setFooter(`${message.client.footer}`, message.client.user.displayAvatarURL({ dynamic: true, size: 512 }))
                    member.send({ embeds: [succese] })
                    reaction.users.remove(member.user);
                    const logembed = new Discord.MessageEmbed()
                        .setTitle(lang.title_no)
                        .setURL('https://green-bot.app/invite')
                        .setDescription(`${member}'s entry for [this giveaway](${message.url}) has been denied.\n__Conditions__\nMessages : **0/${find.requiredMessages}**\nInvites : ${inviteshas}/${find.requiredInvites}`)
                        .setColor('#982318')
                        .setFooter(`${message.client.footer}`, message.client.user.displayAvatarURL({ dynamic: true, size: 512 }))
                    if (logschannel) logschannel.send({ embeds: [logembed] })
                    return;
                }
                if (find.requiredMessages < userdata.messagec || find.requiredMessages == userdata.messagec && find.requiredInvites < inviteshas || find.requiredInvites == inviteshas) {
                    const succes = new Discord.MessageEmbed()
                        .setTitle(lang.title_ok)
                        .setDescription(lang.all_ok.replace("{url}", message.url))

                    .setColor(config.color)
                        .setURL('https://green-bot.app/invite')

                    .setFooter(`${message.client.footer}`, message.client.user.displayAvatarURL({ dynamic: true, size: 512 }))
                    member.send({ embeds: [succes] })
                    const logembed = new Discord.MessageEmbed()
                        .setTitle(lang.title_ok_logs)
                        .setDescription(`${member}'s entry for [this giveaway](${message.url}) has been accepted \n__Conditions__\nMessages : **${userdata.messagec}/${find.requiredMessages}**\nInvites : ${inviteshas}/${find.requiredInvites}`)
                        .setColor(config.color)
                        .setURL('https://green-bot.app/invite')

                    .setFooter(`${message.client.footer}`, message.client.user.displayAvatarURL({ dynamic: true, size: 512 }))
                    if (logschannel) logschannel.send({ embeds: [logembed] })
                    return;
                } else {

                    const succese = new Discord.MessageEmbed()
                        .setTitle(lang.title_no)
                        .setURL('https://green-bot.app/invite')

                    .setDescription(lang.deniedDouble.replace("{url}", message.url).replace("{count}", find.requiredMessages).replace("{invites}", find.requiredInvites))

                    .setColor('#982318')
                        .setFooter(`${message.client.footer}`, message.client.user.displayAvatarURL({ dynamic: true, size: 512 }))
                    member.send({ embeds: [succese] })
                    reaction.users.remove(member.user);
                    const logembed = new Discord.MessageEmbed()
                        .setTitle(lang.title_no)
                        .setURL('https://green-bot.app/invite')

                    .setDescription(`${member}'s entry for [this giveaway](${message.url}) has been denied  .\n__Conditions__\nMessages : **${userdata.messagec}/${find.requiredMessages}**\nInvites : ${inviteshas}/${find.requiredInvites}`)
                        .setColor("#F0B02F")
                        .setFooter(`${message.client.footer}`, message.client.user.displayAvatarURL({ dynamic: true, size: 512 }))
                    if (logschannel) logschannel.send({ embeds: [logembed] })
                    return;
                }
            } else {
                if (find.requiredMessages) {
                    const userdata = await levelModel.findOne({ serverID: giveaway.guildID, userID: member.id })
                    if (!userdata) {
                        const succese = new Discord.MessageEmbed()
                            .setTitle(lang.title_no)
                            .setDescription(lang.deniedMsg.replace("{url}", message.url).replace("{count}", find.requiredMessages))

                        .setColor('#982318')
                            .setURL('https://green-bot.app/invite')

                        .setFooter(`${message.client.footer}`, message.client.user.displayAvatarURL({ dynamic: true, size: 512 }))
                        member.send({ embeds: [succese] })
                        reaction.users.remove(member.user);
                        const logembed = new Discord.MessageEmbed()
                            .setTitle(lang.title_no)
                            .setDescription(`${member}'s entry for [this giveaway](${message.url}) has been denied.\nHe has  0/ **${find.requiredMessages}** messages`)
                            .setColor("#F0B02F")
                            .setURL('https://green-bot.app/invite')
                            .setFooter(`${message.client.footer}`, message.client.user.displayAvatarURL({ dynamic: true, size: 512 }))
                        if (logschannel) logschannel.send({ embeds: [logembed] })
                        return;
                    }
                    if (find.requiredMessages > userdata.messagec) {
                        const succese = new Discord.MessageEmbed()
                            .setTitle(lang.title_no)
                            .setDescription(lang.deniedMsg.replace("{url}", message.url).replace("{count}", find.requiredMessages))

                        .setColor('#982318')
                            .setURL('https://green-bot.app/invite')

                        .setFooter(`${message.client.footer}`, message.client.user.displayAvatarURL({ dynamic: true, size: 512 }))
                        member.send({ embeds: [succese] })
                        reaction.users.remove(member.user);
                        const logembed = new Discord.MessageEmbed()
                            .setTitle(lang.title_no)
                            .setDescription(`${member}'s entry for [this giveaway](${message.url}) has been denied .\n He has **${userdata.messagec}**/**${find.requiredMessages}** messages`)
                            .setColor("#F0B02F")
                            .setURL('https://green-bot.app/invite')

                        .setFooter(`${message.client.footer}`, message.client.user.displayAvatarURL({ dynamic: true, size: 512 }))
                        if (logschannel) logschannel.send({ embeds: [logembed] })
                        return;
                    } else {
                        const succes = new Discord.MessageEmbed()
                            .setTitle(lang.title_ok)
                            .setDescription(lang.all_ok.replace("{url}", message.url))

                        .setColor(config.color)
                            .setURL('https://green-bot.app/invite')

                        .setFooter(`${message.client.footer}`, message.client.user.displayAvatarURL({ dynamic: true, size: 512 }))
                        member.send({ embeds: [succes] })
                        const logembed = new Discord.MessageEmbed()
                            .setTitle(lang.title_ok)
                            .setDescription(`${lang.all_ok_logs.replace("{url}", message.url).replace("{member}", member)}\n __**Conditions**__\nMessages: **${userdata.messagec}**/**${find.requiredMessages}** `)
                            .setColor(config.color)
                            .setURL('https://green-bot.app/invite')
                            .setFooter(`${message.client.footer}`, message.client.user.displayAvatarURL({ dynamic: true, size: 512 }))
                        if (logschannel) logschannel.send({ embeds: [logembed] })
                        return;
                    }
                }
                if (find.requiredInvites) {
                    const invites = await message.guild.invites.fetch().catch(() => {});

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
                            .setTitle(lang.title_ok)
                            .setDescription(lang.all_ok.replace("{url}", message.url))

                        .setColor(config.color)
                            .setURL('https://green-bot.app/invite')

                        .setFooter(`${message.client.footer}`, message.client.user.displayAvatarURL({ dynamic: true, size: 512 }))
                        member.send({
                            embeds: [succes]
                        })
                        const logembed = new Discord.MessageEmbed()
                            .setTitle(lang.title_ok_logs)
                            .setDescription(`${lang.all_ok_logs.replace("{url}", message.url).replace("{member}", member)}\n__Conditions__\nInvites : **${inviteshas}/${find.requiredInvites}**`)
                            .setColor(config.color)
                            .setURL('https://green-bot.app/invite')
                            .setFooter(`${message.client.footer}`, message.client.user.displayAvatarURL({ dynamic: true, size: 512 }))
                        if (logschannel) logschannel.send({ embeds: [logembed] })
                        return;
                    } else {
                        const succese = new Discord.MessageEmbed()
                            .setTitle(lang.title_no)
                            .setURL('https://green-bot.app/invite')
                            .setDescription(`${lang.denied.replace("{url}", message.url)}\n__Conditions__\nInvites : **${inviteshas}/${find.requiredInvites}** `)

                        .setColor('#982318')
                            .setFooter(`${message.client.footer}`, message.client.user.displayAvatarURL({ dynamic: true, size: 512 }))
                        member.send({ embeds: [succese] })
                        reaction.users.remove(member.user);
                        const logembed = new Discord.MessageEmbed()
                            .setTitle(lang.title_no)
                            .setURL('https://green-bot.app/invite')
                            .setDescription(`${member}'s entry for [this giveaway](${message.url}) has been denied  .\n__Conditions__\nInvites : ${inviteshas}/${find.requiredInvites}`)
                            .setColor("#F0B02F")
                            .setFooter(`${message.client.footer}`, message.client.user.displayAvatarURL({ dynamic: true, size: 512 }))
                        if (logschannel) logschannel.send({ embeds: [logembed] })
                        return;
                    }
                }
            }
        } else {
            const succes = new Discord.MessageEmbed()
                .setTitle(lang.title_ok)
                .setDescription(lang.all_ok.replace("{url}", message.url))
                .setColor(config.color)
                .setURL('https://green-bot.app/invite')

            .setFooter(`${message.client.footer}`, message.client.user.displayAvatarURL({ dynamic: true, size: 512 }))
            member.send({ embeds: [succes] })
            const logembed = new Discord.MessageEmbed()
                .setTitle(lang.title_ok_logs)
                .setDescription(lang.all_ok_logs.replace("{url}", message.url).replace("{member}", member))
                .setColor(config.color)
                .setURL('https://green-bot.app/invite')
                .setFooter(`${message.client.footer}`, message.client.user.displayAvatarURL({ dynamic: true, size: 512 }))
            if (logschannel) logschannel.send({ embeds: [logembed] })
        }

    }
};