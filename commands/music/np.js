module.exports = {
    name: 'np',
    description: 'Affiche le titre en lecture actuellement',
    cat: 'music',
    aliases: ["current", "song"],
    botpermissions: ['CONNECT', 'SPEAK'],
    async execute(message, args, client, guildDB) {
        const voice = message.member.voice.channel;
        if (!voice) {
            let err = await message.translate("NOT_VOC", guildDB.lang)
            return message.errorMessage(err)
        }
        const queue = message.client.player.getQueue(message.guild.id)
        if (!queue || !queue.playing) {
            let err = await message.translate("NOT_MUSIC", guildDB.lang)
            return message.errorMessage(err)
        }
        const p = await queue.createProgressBar({ timecodes: true, indicator: "<:Sah:905537387906621480>", })
        message.channel.send({
            embeds: [{
                title: `${queue.current.title}`,
                color: guildDB.color,
                fields: [{
                        name: "Author",
                        value: `${queue.current.author || "Nothing playing"}`,
                        inline: true
                    },
                    {
                        name: "Added by",
                        value: `${queue.current.requestedBy.tag}`,
                        inline: true
                    },
                    {
                        name: "Url",
                        value: `[Click here](${queue.current.url})`,
                        inline: true
                    },
                    {
                        name: "Channel",
                        value: `${queue.connection.channel}`,
                        inline: true
                    },
                    {
                        name: "Views",
                        value: `${queue.current.views.toString()}`,
                        inline: true
                    },
                    {
                        name: "Progression",
                        value: `${p.replace("?","").replace("?","")}`,
                    }
                ],
                thumbnail: {
                    url: queue.current.thumbnail
                },
                author: {
                    name: `${message.author.username}`,
                    icon_url: message.author.displayAvatarURL({ dynamic: true, size: 512 }),
                    url: client.config.links.invite
                }
            }]
        })
    },
};