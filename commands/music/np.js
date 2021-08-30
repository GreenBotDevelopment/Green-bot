const Discord = require('discord.js');

const Welcome = require('../../database/models/Welcome');


module.exports = {
    name: 'np',
    description: 'Affiche le titre en lecture actuellement',
    cat: 'music',

    botpermissions: ['CONNECT', 'SPEAK'],

    async execute(message, args) {
        const { client } = message;

        const voice = message.member.voice.channel;
        if (!voice) {
            let err = await message.translate("NOT_VOC")
            return message.errorMessage(err)
        }
        if (!message.client.player.getQueue(message.guild.id) || !message.client.player.getQueue(message.guild.id).playing) {
            let err = await message.translate("NOT_MUSIC")
            return message.errorMessage(err)

        }
        const queue = message.client.player.getQueue(message.guild.id);

        const filters = [];
        const p = await queue.createProgressBar(message)
        const embed = new Discord.MessageEmbed()

        .setTitle(queue.current.title)

        .setColor(message.guild.settings.color)
            .setFooter(message.client.footer, message.client.user.displayAvatarURL({ dynamic: true, size: 512 }))
            .setAuthor(`${message.author.username}`, message.author.displayAvatarURL({ dynamic: true, size: 512 }))

        .addField(`Autor`, `\`${queue.current.author || "Nothing playing"}\``, true)
            .addField("Added by", `\`${queue.current.requestedBy.tag}\``, true)
            .addField("Link", `[\`Click here\`](${queue.current.url})`, true)
            .addField("Progression", `${p}`, true)
            .addField("Channel", `${queue.connection.channel}`, true)

        .setThumbnail(queue.current.thumbnail)
        message.reply({ embeds: [embed], allowedMentions: { repliedUser: false } })










    },
};