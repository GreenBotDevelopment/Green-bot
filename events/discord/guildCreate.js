module.exports = {
    async execute(e, client) {
        console.log("[32m%s[0m", "NEW GUILD ", "[0m", `${e.name} [${e.memberCount.toLocaleString()} Members]\nID: ${e.id}`)
        const channel = e.channels.cache.find(c => c.permissionsFor(e.me).has("SEND_MESSAGES") && c.permissionsFor(e.me).has("EMBED_LINKS") && c.type === "text");
        if (channel) channel.send({
            embeds: [{
                color: client.config.color,
                fields: [{
                        name: "Basic commands",
                        value: `\`*play\` - Play a track by link or search term\n\`*skip\` - Skip the current track\n\`*leave\` - Make the bot leave the voice channel\n\`*volume\` - Changes the bot volume
                        `
                    },
                    {
                        name: "Getting Started",
                        value: `You can check the [Command list](https://green-bot.app/commands) to see the available commands.. To change my prefix, use \`*prefix\`
        Not English? Change the language using \`*language\``
                    },
                    {
                        name: "Support",
                        value: `Join the [Support server](https://discord.gg/SQsBWtjzTv) if you need help with anything, the support team is here to answer all your questions! `

                    }, {
                        name: "Invite me",
                        value: `[Click here](https://discord.com/oauth2/authorize?client_id=783708073390112830&scope=bot&permissions=19456)`,
                        inline: !0
                    }, {
                        name: "Discord",
                        value: `[Click here](https://discord.gg/SQsBWtjzTv)`,
                        inline: !0
                    }, {
                        name: "Premium",
                        value: `[Click here](https://green-bot.app/premium)`,
                        inline: !0
                    }
                ],

            }]
        }).catch(err => console.log("Could not dm owner"))
    }
};