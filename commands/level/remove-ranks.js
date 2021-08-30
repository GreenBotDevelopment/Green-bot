const rolesRewards = require('../../database/models/rolesRewards');
module.exports = {
    name: 'remove-rank',
    description: 'Enlève un role au système de rewards',
    aliases: ['rank-remove'],
    cat: 'levelling',
    args: true,
    usage: '@role',
    exemple: '@booster',
    permissions: ['MANAGE_GUILD'],
    async execute(message, args) {
        const role = message.mentions.roles.first() || message.guild.roles.cache.get(args[0]) || message.guild.roles.cache.filter(m => m.name.toLowerCase().includes(args.join(""))).first();
        if (!role || role.name === 'everyone' || role.name === 'here' || role.managed) {
            let err = await message.translate("ERROR_ROLE")
            return message.errorMessage(err);
        }
        const lang = await message.translate("REMOVE_RANK")
        let check = await rolesRewards.findOne({ serverID: message.guild.id, roleID: role.id })
        if (!check) {
            return message.errorMessage(lang.no)
        }
        let checke = await rolesRewards.findOneAndDelete({ serverID: message.guild.id, roleID: role.id })
        message.succesMessage(lang.ok.replace("{role}", role.name))
    },
};