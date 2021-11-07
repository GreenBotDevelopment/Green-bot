module.exports = {
    name: 'debug',
    description: 'Debugs the player',
    cat: 'music',
    botpermissions: ['CONNECT', 'SPEAK'],
    async execute(message, args, client, guildDB) {
        const queue = message.client.player.getQueue(message.guild.id)
        if (!queue) {
            let err = await message.translate("NOT_MUSIC", guildDB.lang)
            return message.errorMessage(err)
        }
        message.channel.send({
            embeds: [{
                title: "Player for " + message.guild.name + "",
                color: guildDB.color,
                fields: [{
                        name: "• State",
                        value: `\`${queue.connection.status.toUpperCase()}\``,
                        inline: true
                    },
                    {
                        name: "• Paused",
                        value: queue.connection.paused ? "`true`" : "`false`",
                        inline: true
                    },
                    {
                        name: "• Volume",
                        value: `\`${queue.connection.volume}\``,
                        inline: true
                    },
                    {
                        name: "• Current",
                        value: `${queue.current ? queue.current.title :"Nothing"}`,
                    },
                    {
                        name: "• Voice channel",
                        value: `${queue.connection.channel}`,
                        inline: true
                    },
                    {
                        name: "• Text channel",
                        value: `${queue.metadata.channel}`,
                        inline: true
                    }

                ],
                footer: {
                    text: message.client.footer,
                    icon_url: message.client.user.displayAvatarURL({ dynamic: true, size: 512 })
                },
                author: {
                    name: `${message.author.username}`,
                    icon_url: message.author.displayAvatarURL({ dynamic: true, size: 512 }),
                    url: "https://discord.com/oauth2/authorize?client_id=783708073390112830&scope=bot&permissions=19456"
                }
            }]
        })


    },
};