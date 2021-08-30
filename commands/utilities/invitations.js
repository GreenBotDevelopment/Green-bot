const Discord = require('discord.js');
module.exports = {
    name: 'invitations',
    description: 'Regarde les invitations',
    botpermissions: ['MANAGE_GUILD'],
    aliases: ["invites"],
    cat: 'utilities',
    async execute(message, args) {
        let loadingTest = await message.translate("LOADING")
        let msg = await message.channel.send({ embeds: [new Discord.MessageEmbed().setColor(message.guild.settings.color).setDescription(loadingTest)] })
        let member;
        if (args.length) {
            member = message.mentions.members.first() || message.guild.members.cache.get(args[0]) || message.guild.members.cache.filter(m => m.user.tag.toLowerCase().includes(args[0].toLowerCase()) || m.displayName.toLowerCase().includes(args[0].toLowerCase()) || m.user.username.toLowerCase().includes(args[0].toLowerCase())).first()
            if (!member) {
                let err = await message.translate("ERROR_USER")
                return message.errorMessage(err)
            }
        } else {
            member = message.member
        }
        const invites = await message.guild.invites.fetch().catch(() => {});
        const memberInvites = invites.filter((i) => i.inviter && i.inviter.id === member.user.id);
        const lang = await message.translate("INVITE")
        let index = 0;
        if (memberInvites.size > 0) memberInvites.forEach((invite) => index += invite.uses);
        const embed = new Discord.MessageEmbed()
            .setColor(message.client.color)
            .setTitle("Invites")
            .setThumbnail(url = member.user.displayAvatarURL({ dynamic: true, size: 512 }))
            .setFooter(message.client.footer, message.client.user.displayAvatarURL({ dynamic: true, size: 512 }))
            .setDescription(lang.title.replace("{name}", member.user.tag))
            .addField(lang.desc, `**__${index || "0"} Invites__**`)
        msg.edit({ embeds: [embed] });
    },
};