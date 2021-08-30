const Discord = require('discord.js');
const levelModel = require('../../database/models/level');
module.exports = {
    name: 'reset-levels',
    description: 'Réinitialise toutes les donnés des niveaux pour le serveur actuel',
    aliases: ['resetdata'],
    usage: '[user]',
    guildOnly: true,
    cat: 'levelling',
    permissions: ['MANAGE_GUILD'],
    async execute(message, args) {
        let member;
        const lang = await message.translate("RESET_LEVEL")
        if (args.length) {
            member = message.mentions.members.first() || message.guild.members.cache.get(args[0]) || message.guild.members.cache.filter(m => m.user.tag.includes(args.join(" ")) || m.displayName.includes(args.join(" ")) || m.user.username.includes(args.join(" "))).first()
            if (!member) {
                let err = await message.translate("ERROR_USER")
                return message.errorMessage(err)
            }
            const userdata = await levelModel.findOne({ serverID: message.guild.id, userID: member.user.id })
            if (!userdata) return message.errorMessage(lang.userNo)
            const dell = await levelModel.findOneAndDelete({ serverID: message.guild.id, _id: userdata._id });
            message.succesMessage(lang.userOk.replace("{username}", member.user.username))
        } else {
            const embed = new Discord.MessageEmbed()
                .setTitle(lang.title)
                .setDescription(lang.desc)
                .setFooter(message.client.footer, message.client.user.displayAvatarURL({ dynamic: true, size: 512 }))
                .setColor(message.guild.settings.color);
            message.reply({
                embeds: [embed],
                allowedMentions: { repliedUser: false }
            }).then((m) => {
                m.react("✅")
                m.react("❌")
                const filter = (reaction, user) => user.id === message.author.id;
                const collector = m.createReactionCollector({ filter, time: 11000000, max: 1, })
                collector.on('collect', async r => {
                    if (r.emoji.name === "✅") {
                        const newchannel = await levelModel.find({ serverID: message.guild.id });
                        newchannel.forEach(async l => {
                            const dell = await levelModel.findOneAndDelete({ serverID: message.guild.id, _id: l._id });
                        })
                        return message.succesMessage(lang.ok.replace("{x}", newchannel.length))
                    }
                    if (r.emoji.name === "❌") {
                        let okk = await message.translate("CANCELED")
                        m.edit(`**${okk}**`);
                    }
                });
                collector.on('end', async collected => {
                    let okk = await message.translate("CANCELED")
                    m.edit(`**${okk}**`);
                    m.reactions.removeAll()
                });
            });
        }
    },
};