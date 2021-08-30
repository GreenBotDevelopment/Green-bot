const Discord = require('discord.js');
const rolesReward = require('../../database/models/rolesRewards');
module.exports = {
        name: 'ranks',
        description: 'Renvoie la liste de tous les roles rewards du serveur',
        aliases: ['roles-rewards'],
        cat: 'levelling',
        permissions: ['MANAGE_GUILD'],
        async execute(message, args) {
            let channeldb = await rolesReward.find({ serverID: message.guild.id, reason: 'messages' })
            let levledb = await rolesReward.find({ serverID: message.guild.id, reason: 'level' })
            const lang = await message.translate("RANKS")
            const reportEmbed = new Discord.MessageEmbed()
                .setTitle(lang.title)
                .addField(lang.msg, `${channeldb.length == 0 ?lang.no: channeldb.length > 10 ? `${channeldb.sort((a, b) => (a.level < b.level) ? 1 : -1).map(rr => `\`${rr.level.toLocaleString()}\` **${lang.msg}** : <@&${rr.roleID}>`).slice(0,10).join("\n")}\n ${lang.wait.replace("{x}",channeldb.length - 10)} `:channeldb.sort((a, b) => (a.level < b.level) ? 1 : -1).map(rr => `\`${rr.level.toLocaleString()}\` **${lang.msg}** : <@&${rr.roleID}>`).join("\n")}`)
                .addField(lang.level, `${levledb.length == 0 ?lang.no: levledb.length > 10 ? `${levledb.sort((a, b) => (a.level < b.level) ? 1 : -1).map(rr => `\`${rr.level} \` **${lang.level}**  : <@&${rr.roleID}>`).slice(0,10).join("\n")}\n ${lang.wait.replace("{x}",levledb.length - 10)} `:levledb.sort((a, b) => (a.level < b.level) ? 1 : -1).map(rr => `\`${rr.level}\` **${lang.level}** : <@&${rr.roleID}>`).join("\n")}`)
                .setThumbnail(url = message.guild.iconURL({ dynamic: true, size: 512 }))
                .setFooter(message.client.footer, message.client.user.displayAvatarURL({ dynamic: true, size: 512 }))
                .setColor(message.guild.settings.color);
            message.reply({embeds:[reportEmbed], allowedMentions: { repliedUser: false } })
    },
};