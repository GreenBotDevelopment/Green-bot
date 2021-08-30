const Discord = require('discord.js');
const birthday = require('../../database/models/birthday');
const moment = require("moment");

module.exports = {
        name: 'my-birthday',
        description: 'Donne la date de votre anniversaire',
        cooldown: 10,
        cat: 'games',

        botpermissions: ["SEND_MESSAGES", "EMBED_LINKS", ],
        async execute(message, args, client) {
            let loadingTest = await message.translate("LOADING")
            let msg = await message.channel.send({ embeds: [new Discord.MessageEmbed().setColor(message.guild.settings.color).setDescription(loadingTest)] })

            let find = await birthday.findOne({ userID: message.author.id })
            if (find) {
                let embed = new Discord.MessageEmbed()
                    .setAuthor(`${message.author.username}`, message.author.displayAvatarURL({ dynamic: true, size: 512 }))

                .setColor(message.guild.settings.color)
                    .addField('Date', moment(find.Date).locale(message.guild.settings.lang).format("Do MMMM"), true)

                .setDescription(`${message.guild.settings.lang === "fr" ? `\`📚\` Faîtes \`${message.guild.settings.prefix}birthday\` pour modifier votre anniversaire`:`\`📚\` Do \`${message.guild.settings.prefix}birthday\` to change your birthday.`}`)
                    .setThumbnail(url = message.client.user.displayAvatarURL({ dynamic: true, size: 512 }))

                .setFooter(message.client.footer, message.client.user.displayAvatarURL({ dynamic: true, size: 512 }))
                msg.edit({ embeds: [embed] })
            } else {
                msg.delete()
                message.errorMessage(`${message.guild.settings.lang === "fr" ? `Vous n'avez pas encore défini d'anniversaire . Faîtes \`${message.guild.settings.prefix}birthday\``:`You haven't set a birthday yet. Make \`${message.guild.settings.prefix}birthday\``}`)

        }
    },
};