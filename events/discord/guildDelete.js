module.exports = {
    async execute(guild, client) {
        console.log("[32m%s[0m", "ANCIEN SERVEUR ", "[0m", `${guild.name}`)
        await guild.fetchOwner().then(o => {
            client.users.cache.get(o.id).send(`:broken_heart: | I'm sad to see that you no longer need me in your server. Please consider giving feedback to my developer so I can improve!
            Quick links:
            > Dashboard: **https://green-bot.app/**
            > Server: https://discord.gg/SQsBWtjzTv`)
        }).catch(err => console.log("Could not dm owner"))

    }
};