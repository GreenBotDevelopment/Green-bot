module.exports = {
    name: 'premium',
    description: 'Manages your premium.',
    cat: 'utilities',
    async execute(message, args, client, guildDB) {
        message.channel.send({
            embeds: [{
                author: {
                    name: "Green-bot Premium",
                    icon_url: message.client.user.displayAvatarURL({ dynamic: true, size: 512 }),
                    url: "https://discord.com/oauth2/authorize?client_id=783708073390112830&scope=bot&permissions=19456"
                },
                description: "Unlock more of Green-bot with the premium!",
                fields: [{
                        name: "How can I buy Green-bot Premium ?",
                        value: "To buy the premium version of [Green-bot](https://green-bot.app), first join the [Support server](https://discord.gg/SQsBWtjzTv). If you are not in the server, you won't be able to redeem your premium !\n Then go on the [Patreon page](https://green-bot.app/premium/buy) to subscribe Green-bot"
                    },
                    {
                        name: "What gives Green-bot premium ?",
                        value: "► Acces to **2** new bots!\n► Access to exlusive filters\n► No restarts of the premium bot\n► No need to vote every 12h for some commands.\n► Customize everything!"
                    },
                    {
                        name: "Status",
                        value: `${guildDB.goodPremium ? "⭐ Your currently have the premium !":"❌ You don't have the premium yet on **"+ message.guild.name+"**"}`
                    },
                ],
                color: "#3A871F",
                footer: {
                    text: `${message.client.footer}`,
                    icon_url: message.client.user.displayAvatarURL({ dynamic: true, size: 512 })
                }


            }]
        })
    },
};