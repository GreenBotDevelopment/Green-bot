const Discord = require('discord.js');
const { arg } = require('mathjs');
const guild = require('../../database/models/guild');
const premiumDB = require('../../database/models/premium');

module.exports = {
    name: 'set-join-dm',
    description: 'Défini le message envoyé en messages privés automatiquement aux nouveaux membres',
    usage: 'on/off <message>',
    args: true,

    aliases: ['dm-join'],
    exemple: 'on Welcome {user} on {server} , we are now {membercount}',
    cat: 'configuration',
    permissions: ['MANAGE_GUILD'],


    async execute(message, args) {
        let lang = await message.translate("JOIN_DM")
        if (args[0] === 'on') {
            const nick = args.slice(1).join(" ")
            if (!nick) return message.errorMessage(lang.args)
            if (nick.length > 2000 || nick.length < 3) {
                let numberErr = await message.translate("MESSAGE_ERROR")
                return message.errorMessage(numberErr.replace("{amount}", "2").replace("{range}", "2000"))
            }

            const joindme = await guild.findOne({ serverID: message.guild.id, reason: `joindm` });
            if (!joindme) {
                const verynew = new guild({
                    serverID: `${message.guild.id}`,
                    content: `${nick}`,
                    reason: 'joindm',
                }).save();

                return message.succesMessage(lang.succes);

            } else {
                const newchannel = await guild.findOneAndUpdate({ serverID: message.guild.id, reason: `joindm` }, { $set: { content: nick, reason: `joindm` } }, { new: true });


                return message.succesMessage(lang.succes);

            }
        } else if (args[0] === "off") {
            const verify = await guild.findOne({ serverID: message.guild.id, reason: `joindm` })
            if (verify) {
                const newchannel = await guild.findOneAndDelete({ serverID: message.guild.id, reason: `joindm` });
                return message.succesMessage(lang.disable);
            } else {
                let required = await message.translate("CONGIG_REQUIRED")
                return message.errorMessage(required)
            }

        } else {
            let required = await message.translate("ON/OFF")
            return message.errorMessage(required)
        }










    },
};