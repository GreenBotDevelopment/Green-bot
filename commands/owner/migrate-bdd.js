const { getServersList } = require("../../util/functions")
const guildData = require('../../database/models/guildData');
const Welcome = require('../../database/models/Welcome');
module.exports = {
    name: 'migrate-bdd',
    owner: true,
    description: 'Migrate the database',
    args: true,
    usage: '<shard/all>',
    aliases: ['migrate-v5'],
    cat: 'rowner',
    async execute(message, args, client, guildDB) {

        message.channel.send(`Starting the migration of database. Estimated ping won: 10ms . Type: **All**`)
            /**
               chatbot: { type: String, required: false },
                ignored_channel: { type: String, required: false },
                admin_role: { type: String, required: false },
                games_enabled: { type: String, required: false },
                count: { type: String, required: false },
                autopost: { type: String, required: false },
             */
        let realized = 0;
        let errored = 0
        const guilds = await getServersList(client)
        guilds.forEach(async g => {
            const automod = await Welcome.findOne({ serverID: g.id, reason: `anti-invite` })
            console.log(automod)
            let state;
            if (automod) {
                state = true
            } else {
                state = null
            }
            const findData = await guildData.findOne({ serverID: g.id })
            const m = await Welcome.findOne({ serverID: g.id, reason: "antiraid_logs" });
            const logger = m ? m.channelID ? m.channelID : null : null
            if (findData) {
                const newchannel = await guildData.findOneAndUpdate({ serverID: g.id }, { $set: { protections: { anti_pub: null, antiraid_logs: logger } } }, { new: true });
                realized = realized + 1
            } else {
                console.log("Err")
                await g.addDB()
                errored = errored + 1
            }
        });
        message.channel.send(`Nice :tada:`)





    },
};