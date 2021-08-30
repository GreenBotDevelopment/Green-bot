const Discord = require('discord.js');
const guild = require('../../database/models/guild');
module.exports = {
        name: 'serverinfo',
        description: 'Gives all the information available on the server',
        aliases: ['si', 'server-info', 'serv-info'],
        cat: 'utilities',
        async execute(message, args, client) {
            if (message.guild.memberCount !== message.guild.members.cache.size) await message.guild.members.fetch()
            const lang = await message.translate("SERVERINFO")
            let here = await message.translate("CLIQ");
            const embed = new Discord.MessageEmbed()
                .setAuthor(`${message.author.username}`, message.author.displayAvatarURL({ dynamic: true, size: 512 }))
                .setTitle(message.guild.name);
            if (message.guild.description) embed.setDescription(message.guild.description);
            embed.setColor(message.guild.settings.color)
            embed.addField(`${lang.a} [${message.guild.memberCount}]`, `
       **${lang.b}:** ${message.guild.memberCount}/${message.guild.maximumMembers}
       **Bots:** ${message.guild.members.cache.filter(m => m.user.bot).size}
       **${lang.c}:** ${message.guild.members.cache.filter(m => m.permissions.has(["BAN_MEMBERS", "MANAGE_MESSAGES", "KICK_MEMBERS", "MANAGE_GUILD", "ADMINISTRATOR"])).size}`)
            let own = await message.guild.fetchOwner()
            embed.addField(`Global`, `
**ID :** ${message.guild.id}
**${lang.d}:** ${message.guild.channels.cache.size}
**${lang.e}**: ${message.guild.banner ? `[${here}](${message.guild.bannerURL({size: 1024})})` : "Aucune"}
**Boosts** : ${message.guild.premiumSubscriptionCount} , \`${message.guild.premiumTier} \`
**Owner** : \`${message.guild.members.cache.get(own.id) ? message.guild.members.cache.get(own.id).user.tag : "Utilisateur Inconnu"}\` (<@!${own.id}>)
`)
embed.addField(lang.f, `
**Roles**: ${message.guild.roles.cache.size > 15 ? `${message.guild.roles.cache.map(x => `<@&${x.id}>`).slice(0,15 )} ${lang.rest.replace("{rest}",message.guild.roles.cache.size - 15)} ` : message.guild.roles.cache.map(x => `<@&${x.id}>`)}
**Emojis**: ${message.guild.emojis.cache.size > 15 ? `${message.guild.emojis.cache.map(x => `${x}`).slice(0,15 )} ${lang.rest.replace("{rest}",message.guild.emojis.cache.size - 15)} ` : message.guild.emojis.cache.map(x => `${x}`)}
`)
        embed.setThumbnail(message.guild.icon ? message.guild.iconURL({dynamic:true}) : "https://cdn.discordapp.com/attachments/748897191879245834/782271474450825226/0.png?size=128")
        embed.setFooter(message.client.footer, message.client.user.displayAvatarURL({ dynamic: true, size: 512 }))
        message.reply({embeds:[embed], allowedMentions: { repliedUser: false } })
    },
};