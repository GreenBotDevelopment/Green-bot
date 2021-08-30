const guildData = require('../../database/models/guildData');
module.exports = {
    name: 'language',
    description: 'Change la langue dans lequel le bot parle',
    cat: 'configuration',
    args: true,
    usage: 'fr/en',
    exemple: 'fr',
    aliases: ["setlang", "lang"],
    usages: ['language fr', "language en"],
    permissions: ['MANAGE_GUILD'],
    async execute(message, args) {
        const no = await message.translate("LANG_NO_CORRECT")
        if (args[0] === 'fr' || args[0] === 'french' || args[0] === 'français') {
            if (message.guild.settings.lang === 'fr') {
                message.errorMessage(`Ma langue sur ce serveur est déja le français`)
                return;
            } else {
                const newchannel = await guildData.findOneAndUpdate({ serverID: message.guild.id, }, { $set: { lang: "fr" } }, { new: true });
                message.guild.settings.lang = "fr";
                let x = await message.translate("LANGUAGE_GOOD_SET")
                return message.reply({ content: x, allowedMentions: { repliedUser: false } })
            }
        }
        if (args[0] === 'en' || args[0] === 'english' || args[0] === 'england' || args[0] === 'anglais') {
            if (message.guild.settings.lang === 'en') {
                message.errorMessage(`My language on this server is already english`)
                return;
            } else {
                const newchannel = await guildData.findOneAndUpdate({ serverID: message.guild.id, }, { $set: { lang: "en" } }, { new: true });
                message.guild.settings.lang = "en";
                let x = await message.translate("LANGUAGE_GOOD_SET")
                return message.reply({ content: x, allowedMentions: { repliedUser: false } })
            }
        } else {
            message.errorMessage(no)

        }
    },
};