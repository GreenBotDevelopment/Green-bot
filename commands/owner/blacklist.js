const guildData = require('../../database/models/guildData');
module.exports = {
    name: 'blacklist',
    owner: true,
    description: 'Manage the blacklist',
    args: true,
    usage: '<add/remove> <GuildID>',
    aliases: ['black', 'bl'],
    cat: 'owner',
    async execute(message, args, client, guildDB) {
        if (args[0] === "add") {
            const findData = await guildData.findOne({ serverID: args[1] })
            if (!findData) {
                return message.reply("`❌` This guild doesn't exist or isn't in the database")
            } else {
                if (findData.backlist) return message.reply("`❌` This guild is already blacklisted")
                const newchannel = await guildData.findOneAndUpdate({ serverID: args[1] }, { $set: { backlist: true } }, { new: true });
                return message.reply("`✅` Server with ID `" + args[1] + "` has been succesfully blacklisted")
            }
        } else if (args[0] === "remove") {
            const findData = await guildData.findOne({ serverID: args[1] })
            if (!findData) {
                return message.reply("`❌` This guild doesn't exist or isn't in the database")
            } else {
                if (!findData.backlist) return message.reply("`❌` This guild isn't blacklisted")
                const newchannel = await guildData.findOneAndUpdate({ serverID: args[1] }, { $set: { backlist: null } }, { new: true });
                return message.reply("`✅` Server with ID `" + args[1] + "` has been succesfully removed from the blacklist`")
            }
        } else {
            return message.reply("`❌` Please provide a correct argument: **add** or **remove**.")
        }
    },

};