module.exports = {
    name: 'avatar',
    description: 'Affiche l\'avatar d\'un utilisateur (ou le vôtre, si aucun utilisateur n\'est mentionné).',
    aliases: ['profilepic', 'pic', 'pp', 'pdp'],
    cat: 'utilities',
    async execute(message, args, client, guildDB) {
        let member = message.member;
        if (args.length) {
            member = message.mentions.members.first() || message.guild.members.cache.get(args[0]) || message.guild.members.cache.filter(m => m.user.tag.toLowerCase().includes(args[0].toLowerCase()) || m.displayName.toLowerCase().includes(args[0].toLowerCase()) || m.user.username.toLowerCase().includes(args[0].toLowerCase())).first()
            if (!member) {
                const err = await message.translate("ERROR_USER", guildDB.lang)
                return message.errorMessage(err);
            }
        }
        const a = await message.translate("AVATAR", guildDB.lang);
        const b = await message.translate("AVATAR_DESC", guildDB.lang);
        const memberAvatarUrl = member.user.displayAvatarURL({
            dynamic: true,
            size: 512
        });
        return message.channel.send({
            embeds: [
                {
                    author: {
                        name: `${a}${member.user.tag}`,
                        icon_url: memberAvatarUrl,
                        url: client.config.links.invite,
                    },
                    color: guildDB.color,
                    image: {
                        url: memberAvatarUrl,
                    },
                    footer: {
                        text: message.client.footer,
                        icon_url: message.client.user.displayAvatarURL({
                            dynamic: true,
                            size: 512
                        }),
                    },
                    description: b.replace("{url}", memberAvatarUrl),
                },
            ],
            allowedMentions: {
                repliedUser: false
            },
        });
    },
};
