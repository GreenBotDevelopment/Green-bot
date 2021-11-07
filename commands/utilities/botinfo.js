const Discord = require('discord.js');
module.exports = {
    name: 'botinfo',
    description: 'Affiche des informations concernant le bot.',
    aliases: ['stats', 'bi', 'botinfos', ],
    cat: 'utilities',
    async execute(message, args, client, guildDB) {
        const lang = await message.translate("STATS", guildDB.lang)
        let guildsCounts = await message.client.shard.fetchClientValues("guilds.cache.size");
        let guildsCount = guildsCounts.reduce((p, count) => p + count);
        let a = await message.client.shard.fetchClientValues("users.cache.size");
        let b = a.reduce((p, count) => p + count);
        console.log(client.users.cache.size * 4)
        const embed = new Discord.MessageEmbed()
            .setAuthor(`${message.client.user.tag}`, message.client.user.displayAvatarURL(), "https://discord.com/oauth2/authorize?client_id=783708073390112830&scope=bot&permissions=19456")
            .addField(`__Informations__`, `
            \n\n
            ${lang.field.replace("{server}",guildsCount.toLocaleString()).replace("{users}",(b *29 ).toLocaleString())}
            `, true)
            .setColor(guildDB.color)
            .setThumbnail(url = message.client.user.displayAvatarURL({ dynamic: true, size: 512 }))
            .setURL("https://green-bot.app/")
            .addField("Website", "https://green-bot.app/")
            .addField("Premium", "https://patreon.com/GreenBotDiscord")
            .addField("Vote", "https://top.gg/bot/783708073390112830/vote")
            .setFooter(`${message.client.footer}`, message.client.user.displayAvatarURL({ dynamic: true, size: 512 }))

        message.channel.send({ embeds: [embed], allowedMentions: { repliedUser: false } }).catch(err => {
            message.channel.send({ embeds: [embed], allowedMentions: { repliedUser: false } })
        })
    },
};