const math = require('mathjs');
const levelModel = require('../../database/models/level');
module.exports = {
    name: 'addlevel',
    description: 'Ajoute un niveau à un utilisateur donné',
    aliases: ['add-level', 'give-level'],
    cat: 'levelling',
    args: true,
    usage: '@user <levels>',
    exemple: '@pauldb09 2',
    permissions: ['MANAGE_GUILD'],
    async execute(message, args) {
        let member = message.mentions.members.first() || message.guild.members.cache.get(args[0]) || message.guild.members.cache.filter(m => m.user.tag.includes(args.join(" ")) || m.displayName.includes(args.join(" ")) || m.user.username.includes(args.join(" "))).first()
        if (!member) {
            let err = await message.translate("ERROR_USER")
            return message.errorMessage(err)
        }
        if (member.user.bot) {
            let err = await message.translate("ERROR_BOT")
            return message.errorMessage(err)
        }
        const togive = parseInt(args[1]);
        if (!togive || isNaN(togive) || togive < 1 || togive > 200) {
            let numberErr = await message.translate("NUMBER_ERROR")
            return message.errorMessage(numberErr.replace("{amount}", "1").replace("{range}", "200"))
        }
        const userdata = await levelModel.findOne({ serverID: message.guild.id, userID: member.id })
        if (userdata) {
            let newxp = math.evaluate(`${userdata.level} + ${togive}`)
            const normalupdate = await levelModel.findOneAndUpdate({ serverID: message.guild.id, userID: member.id }, { $set: { level: newxp, } }, { new: true });
            let succes = await message.translate("ADD_LEVEL")
            return message.succesMessage(succes.replace("{level}", togive).replace("{username}", member.user.username));

        } else {
            const verynew = new levelModel({
                serverID: `${message.guild.id}`,
                userID: `${member.id}`,
                xp: 0,
                level: togive,
                messagec: 0
            }).save();
            let succes = await message.translate("ADD_LEVEL")
            return message.succesMessage(succes.replace("{level}", togive).replace("{username}", member.user.username));
        }
    },
};