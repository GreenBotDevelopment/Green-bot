const Discord = require("discord.js")
module.exports = {
    name: 'controller',
    description: 'Sets the controller channel',
    cat: 'configuration',
    usage: '#channel/disable',
    usages: ["controller #channel", "controller disable"],
    exemple: '#channel',
    permissions: ['MANAGE_GUILD'],
    botpermissions: ['MANAGE_CHANNELS', "MANAGE_MESSAGES"],
    async execute(message, args, client, guildDB) {
        const lang = await message.translate("CONTROLLER", guildDB.lang)
        if (args[0] && args[0].toLowerCase() === 'disable') {
            if (guildDB.requestChannel) {
                message.guild.channels.cache.get(guildDB.requestChannel) ? message.guild.channels.cache.get(guildDB.requestChannel).delete() : ""
                guildDB.requestChannel = null
                guildDB.save()
                return message.succesMessage(lang.disable)
            } else {
                let required = await message.translate("CONGIG_REQUIRED", guildDB.lang)
                return message.errorMessage(required)
            }
        }
        if (guildDB.requestChannel && message.guild.channels.cache.get(guildDB.requestChannel)) {
            return message.errorMessage(lang.already.replace("{channel}", `<#${guildDB.requestChannel}>`))
        }
        let channel = message.mentions.channels.first();
        if (!channel) channel = await message.guild.channels.create(`green songs request`, { type: "GUILD_TEXT", }).catch(err => message.errorMessage("Please give me the `Manage channels` permissions to create a controller."))
        if (!channel || channel.guild.id !== message.guild.id) {
            let errorChannel = await message.translate("ERROR_CHANNEL", guildDB.lang)
            return message.errorMessage(errorChannel)
        }
        if (!channel.permissionsFor(message.guild.me).has('SEND_MESSAGES') || !channel.permissionsFor(message.guild.me).has('EMBED_LINKS') || !channel.viewable) {
            let a = await message.translate("CHANNEL_PERMS", guildDB.lang)
            return message.errorMessage(a)
        }
        guildDB.requestChannel = channel.id
        const embed = new Discord.MessageEmbed()
            .setAuthor(message.guild.name, message.guild.icon ? message.guild.iconURL({ dynamic: true }) : "https://cdn.discordapp.com/attachments/748897191879245834/782271474450825226/0.png?size=128", "https://discord.com/oauth2/authorize?client_id=783708073390112830&scope=bot&permissions=19456")
            .setDescription(`Send a music name/link bellow this message to play music.\n[Invite me](https://green-bot.app/invite) | [Premium](https://green-bot.app/premium) | [Dashboard](https://green-bot.app) | [Commands](https://green-bot.app/commands)`)
            .addField("Now playing", "__**Nothing playing**__")
            .setImage(url = "https://cdn.discordapp.com/attachments/893185846876975104/900453806549127229/green_bot_banner.png")
            .setFooter(`${message.client.footer}`, message.client.user.displayAvatarURL({ dynamic: true, size: 512 }))
            .setColor("#3A871F")
        const msg = await channel.send({
            embeds: [embed],
            components: [{
                    components: [{
                            customId: 'back_button',
                            emoji: '⏮️',
                            style: 2,
                            type: 'BUTTON'
                        },
                        {
                            customId: 'seek_back_button',
                            emoji: '⏪',
                            style: 2,
                            type: 'BUTTON'
                        },
                        {
                            customId: 'autoplay',
                            emoji: '🎧',
                            style: 2,
                            type: 'BUTTON'
                        },
                        {
                            customId: 'seek_button',
                            emoji: '⏩',
                            style: 2,
                            type: 'BUTTON'
                        },
                        {
                            customId: 'next',
                            emoji: '⏭️',
                            style: 2,
                            type: 'BUTTON'
                        },

                    ],
                    type: 'ACTION_ROW'
                },
                {
                    components: [{
                            customId: 'pause',
                            emoji: '⏸',
                            style: 2,
                            type: 'BUTTON'
                        },
                        {
                            customId: 'resume',
                            emoji: '▶',
                            style: 2,
                            type: 'BUTTON'
                        },

                        {
                            customId: 'stop',
                            emoji: '⏹',
                            style: 2,
                            type: 'BUTTON'
                        },
                        {
                            customId: 'shuffle',
                            emoji: '🔀',
                            style: 2,
                            type: 'BUTTON'
                        },
                        {
                            customId: 'loop',
                            emoji: '🔄',
                            style: 2,
                            type: 'BUTTON'
                        },

                    ],
                    type: 'ACTION_ROW'
                }
            ],

        })
        guildDB.requestChannel = channel.id;
        guildDB.requestMessage = msg.id;
        guildDB.save()
        const embede = new Discord.MessageEmbed()
            .setAuthor(message.author.username, message.member.user.displayAvatarURL(), "https://discord.com/oauth2/authorize?client_id=783708073390112830&scope=bot&permissions=19456")
            .setDescription(lang.succes.replace("{channel}", channel))
            .setFooter(`${message.client.footer}`, message.client.user.displayAvatarURL({ dynamic: true, size: 512 }))
            .setColor("#3A871F")
        message.channel.send({ embeds: [embede] })
    },
};