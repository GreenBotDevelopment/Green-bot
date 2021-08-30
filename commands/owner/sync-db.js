const guildData = require('../../database/models/guildData');
module.exports = {
    name: 'sync-db',
    owner: true,
    description: 'Check if there are missing guilds in the database. It provides information about how the bot is used',
    aliases: ['check-db', 'db'],
    cat: 'owner',
    async execute(message, args, client, guildDB) {
        message.channel.send("<a:green_loading:824308769713815612> **Checking database, please wait**").then(async(m) => {
            let good = 0;
            let left = 0
            const locales = {
                fr: 0,
                en: 0
            }
            let realized = 0
            const guilds = await getServersList(client)
            guilds.forEach(async g => {
                realized++
                const settings = await guildData.findOne({ serverID: g.id })
                if (settings) good++
                    else left++, g.addDB()
                if (settings && settings.lang === "fr") locales.fr++
                    else if (settings && settings.lang === "en") locales.en++
            });
            let guildsCounts = await message.client.shard.fetchClientValues("guilds.cache.size");
            let guildsCount = guildsCounts.reduce((p, count) => p + count);
            if (realized === guildsCount) {
                message.channel.send("**__Test Done__**\nTest done succesfully on " + guildsCount + " guilds (Operation realized in **" + Date.now() - m.createdTimestamp + "** ms).\n\n**Results:**\nGood guilds: " + good + "\nGuilds missing (fixed): " + left + "\n__**Bot usage**__\n:flag_fr: French servers: **" + locales.fr + "**\n:flag_gb: English servers: **" + locales.en + "**")
            }
        });

    },
};