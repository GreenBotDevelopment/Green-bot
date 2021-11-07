module.exports = {
    name: 'language',
    description: 'Changes the bot language',
    cat: 'configuration',
    args: true,
    usage: 'fr/en/de',
    exemple: 'fr',
    aliases: ["setlang", "lang"],
    usages: ['language fr', "language en", "language de"],
    permissions: ['MANAGE_GUILD'],
    async execute(message, args, client, guildDB) {
        if (args[0] === 'fr' || args[0] === 'french' || args[0] === 'français') {
            if (guildDB.lang === 'fr') {
                message.errorMessage(`Ma langue sur ce serveur est déja le français`)
                return;
            } else {
                guildDB.lang = 'fr';
                guildDB.save();
                let x = await message.translate("LANGUAGE_GOOD_SET", "fr")
                return message.channel.send({ content: x, allowedMentions: { repliedUser: false } })
            }
        }
        if (args[0] === 'en' || args[0] === 'english' || args[0] === 'england' || args[0] === 'anglais') {
            if (guildDB.lang === 'en') {
                message.errorMessage(`My language on this server is already english`)
                return;
            } else {
                guildDB.lang = 'en';
                guildDB.save();
                let x = await message.translate("LANGUAGE_GOOD_SET", "en")
                return message.channel.send({ content: x, allowedMentions: { repliedUser: false } })
            }
        }
        if (args[0] === 'de' || args[0] === 'deutsch' || args[0] === 'german' || args[0] === 'allemand ') {
            if (guildDB.lang === 'de') {
                message.errorMessage(`Meine Sprache auf diesem Server ist bereits Deutsch`)
                return;
            } else {
                guildDB.lang = 'de';
                guildDB.save();
                let x = await message.translate("LANGUAGE_GOOD_SET", "de")
                return message.channel.send({ content: x, allowedMentions: { repliedUser: false } })
            }
        } else {
            const no = await message.translate("LANG_NO_CORRECT", guildDB.lang)
            message.errorMessage(no)

        }
    },
};