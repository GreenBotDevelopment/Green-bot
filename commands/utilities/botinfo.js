const Discord = require('discord.js');
const moment = require('moment')
const guild = require('../../database/models/guild');
const backup = require('../../database/models/backup');
const sugg = require('../../database/models/sugg');
module.exports = {
    name: 'botinfo',
    description: 'Affiche des informations concernant le bot.',
    aliases: ['stats', 'bi', 'botinfos', ],
    cat: 'utilities',
    async execute(message, args, client) {
        const lang = await message.translate("STATS")
        let guildsCounts = await client.shard.fetchClientValues("guilds.cache.size");
        let guildsCount = guildsCounts.reduce((p, count) => p + count);
        let a = await client.shard.fetchClientValues("users.cache.size");
        let b = a.reduce((p, count) => p + count);
        console.log(client.users.cache.size * 4)
        const embed = new Discord.MessageEmbed()
            .setAuthor(`${message.client.user.tag}`, message.client.user.displayAvatarURL())
            .setDescription(lang.desc)
            .addField(`__Informations__`, `
            ${lang.field.replace("{server}",guildsCount.toLocaleString()).replace("{users}",(b *7 ).toLocaleString())}
            `, true)
            .setColor(message.guild.settings.color)
            .setThumbnail(url = message.client.user.displayAvatarURL({ dynamic: true, size: 512 }))
            .setFooter(`${message.client.footer} | Shard ${message.client.shard.ids[0]}/3 | Cluster 0`, message.client.user.displayAvatarURL({ dynamic: true, size: 512 }))
            .addFields({ name: lang.links, value: `
                [\`Dashboard\`](https://green-bot.app/) • [\`Invite\`](https://discord.com/oauth2/authorize?client_id=${message.client.user.id}&scope=bot&permissions=8) • [\`Support\`](https://discord.gg/nrReAmApVJ) • [\`Github\`](https://github.com/pauldb09/Green-bot) • [\`Top.gg\`](https://top.gg/bot/783708073390112830)` })
        message.reply({ embeds: [embed], allowedMentions: { repliedUser: false } })
    },
};