const Discord = require("discord.js")
module.exports = {
        name: 'settings',
        description: 'Show the guild settings',
        aliases: ["config"],
        permissions: ['MANAGE_GUILD'],
        async execute(message, args, client, guildDB) {
            const embede = new Discord.MessageEmbed()
                .setAuthor(message.guild.name, message.guild.icon ? message.guild.iconURL({ dynamic: true }) : "https://cdn.discordapp.com/attachments/748897191879245834/782271474450825226/0.png?size=128", client.config.links.invite)
                .setDescription(`> Prefix: \`${guildDB.prefix}\`\n> Language: ${guildDB.lang.replace("en",":flag_gb:").replace("fr",":flag_fr:").replace("de",":flag_de:")}\n\nAnnoucing new songs: ${guildDB.announce ? "`Enabled`"  :"`Disabled`"}\nDefault volume: \`${guildDB.defaultVolume}\`\nDj role: ${guildDB.dj_role ? `<@&${guildDB.dj_role}>` :"`No set`"}\n24/7: ${guildDB.h24 ? "`Enabled`" :"`Disabled`"}\nVoice channel: ${guildDB.vc ? `<#${guildDB.vc}>` :"`No set`"}\nClearing: ${guildDB.clearing ? "`Enabled`":"`Disabled`"}\nAuto shuffle Playlist: ${guildDB.auto_shuffle ? "`Enabled`" : "`Disabled`"}\n\n **Music controller**\n Channel: ${guildDB.requestChannel ? `<#${guildDB.requestChannel}>`  : "`Not set`"}`)
            .setFooter(`${message.client.footer}`, message.client.user.displayAvatarURL({ dynamic: true, size: 512 }))
            .setColor("#3A871F")
        message.channel.send({ embeds: [embede] })
    },
};