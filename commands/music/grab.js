const { MessageEmbed } = require('discord.js');
module.exports = {
    name: 'grab',
    description: 'Send in DM the current song',
    aliases: ["save"],
    cat: 'music',
    botpermissions: ['CONNECT', 'SPEAK'],
    async execute(message, args, client, guildDB) {
        const queue = message.client.player.getQueue(message.guild.id)
        if (!queue || !queue.playing) {
            let err = await message.translate("NOT_MUSIC", guildDB.lang)
            return message.errorMessage(err)
        }
        const p = await queue.createProgressBar({ timecodes: true, line: "<:gay2:905538580221427823>", })
        const embed = new MessageEmbed()
            .setTitle(queue.current.title)
            .setColor(guildDB.color)
            .setFooter(message.client.footer, message.client.user.displayAvatarURL({ dynamic: true, size: 512 }))
            .setAuthor(`${message.author.username}`, message.author.displayAvatarURL({ dynamic: true, size: 512 }), client.config.links.invite)
            .addField(`Autor`, `\`${queue.current.author || "Nothing playing"}\``, true)
            .addField("Added by", `\`${queue.current.requestedBy.tag}\``, true)
            .addField("Url", `[Click here](${queue.current.url})`, true)
            .addField("Channel", `${queue.connection.channel}`, true)
            .addField("Views", `${queue.current.views.toString()}`, true)
            .addField("Progression", `${p.replace("?","").replace("?","")}`)
            .setThumbnail(queue.current.thumbnail)
        message.member.send({ embeds: [embed], allowedMentions: { repliedUser: false } }).catch(err => message.errorMessage("I can't DM you. Please open your DMs and try again"))
        message.succesMessage("✅ Succesfully send in DM!", true)
    },
};