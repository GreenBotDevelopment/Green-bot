const Discord = require('discord.js');
const Welcome = require('../../database/models/Welcome')
module.exports = {
        name: 'discrim',
        description: 'Montre combien de personnes ont un certain discriminateur sur le serveur',
        cat: 'utilities',
        args: true,
        aliases: ['discriminator'],
        guildOnly: true,
        usage: '<discrim>',
        exemple: '#0001',
        async execute(message, args) {
            let discrim = args[0].replace("#", "");
            const lang = await message.translate("DISCRIM")
            if (message.guild.memberCount !== message.guild.members.cache.size) await message.guild.members.fetch()
            const u = message.guild.members.cache.filter(m => m.user.discriminator === discrim);
            if (u.size == 0) return message.errorMessage(lang.err.replace("{discrim}", discrim))
            const embed = new Discord.MessageEmbed()
                .setAuthor(`${message.author.username}`, message.author.displayAvatarURL({ dynamic: true, size: 512 }))
                .setColor(message.guild.settings.color)
                .setDescription(lang.desc.replace("{discrim}", discrim).replace("{count}", u.size))
                .addField(`${lang.field1T} (${u.size})`, `${u.size > 20 ? `${u.map(x => `\`${x.user.tag}\``).slice(0,20 )} ${lang.field1D.replace("{rest}",u.size - 20)} ` : u.map(x => `\`${x.user.tag}\``)}`, true)
                .addField(lang.force1, lang.force2)
                .setFooter(message.client.footer, message.client.user.displayAvatarURL({ dynamic: true, size: 512 }))
           return message.reply({ embeds: [embed],allowedMentions: { repliedUser: false }
 })
    },
};