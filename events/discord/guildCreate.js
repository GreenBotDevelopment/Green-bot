module.exports = {
    async execute(e, client) {
        console.log("[32m%s[0m", "NOUVEAU SERVEUR ", "[0m", `${e.name} [${e.memberCount.toLocaleString()} Members]\nID: ${e.id}`)
        if (!e.me.permissions.has("VIEW_AUDIT_LOG")) return;
        const fetchGuildAuditLogs = await e.fetchAuditLogs({
            limit: 1,
            type: 'BOT_ADD'
        })
        const latestChannelDeleted = fetchGuildAuditLogs.entries.first();
        if (!latestChannelDeleted) return
        const { executor } = latestChannelDeleted;
        await e.members.fetch()
        const member = e.members.cache.get(executor.id)
        member.send({
            embeds: [{
                color: client.config.color,
                description: `Hey thanks for adding me to **${e.name}**!`,
                fields: [{
                    name: "Getting Started",
                    value: `You can check the [Command list](https://green-bot.app/commands) for more information. To change my prefix, use \`*prefix\`
        Not English? Change the language using \`*language\``
                }, {
                    name: "Support",
                    value: `Join the [Support server](https://discord.gg/SQsBWtjzTv) if you need help with anything, the support team is here to answer all your questions! You can also use \`*help\` for alternative support methods and more information.`

                }, {
                    name: "How to play music ?",
                    value: `Join a voice channel and then type \`*play music\`.Don't forget to replace **music** name by the music that you want.`
                }, {
                    name: "Premium",
                    value: `Unlock exclusive benefits by purchasing a premium membership: \nhttps://green-bot.app/premium`
                }, {
                    name: "Dashboard",
                    value: `[Click here](https://green-bot.app)`,
                    inline: !0
                }, {
                    name: "Discord",
                    value: `[Click here](https://discord.gg/SQsBWtjzTv)`,
                    inline: !0
                }, {
                    name: "Premium",
                    value: `[Click here](https://green-bot.app/premium)`,
                    inline: !0
                }],

            }]
        }).catch(err => console.log("Could not dm owner"))
    }
};