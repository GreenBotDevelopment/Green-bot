const Discord = require('discord.js');
const rolesRewards = require('../../database/models/rolesRewards');
module.exports = {
    name: 'add-rank',
    description: 'Ajoute un role au système de rewards',
    aliases: ['rank-add'],
    cat: 'levelling',
    args: true,
    usage: '<level || messages > <level> @role',
    exemple: 'level 1 @Niveau 1',
    permissions: ['MANAGE_GUILD'],
    async execute(message, args) {
        let type = args[0];
        if (!type || (type.toLowerCase() !== "messages" && type.toLowerCase() !== "level")) {
            let err = await message.translate("ARGS_REQUIRED")
            const reportEmbed = new Discord.MessageEmbed()
                .setAuthor(`${message.author.username}`, message.author.displayAvatarURL({ dynamic: true, size: 512 }))
                .setDescription(`${err.replace("{command}","add-rank")} \`${message.guild.settings.prefix}add-rank <level || messages > <number> @role\``)
                .setFooter(message.client.footer)
                .setColor("#F0B02F")
            return message.channel.send({ embeds: [reportEmbed] })
        }
        let number = args[1]
        let amount;
        if (type.toLowerCase() === "messages") {
            amount = 10000
        } else {
            amount = 500
        }
        if (isNaN(number) || number < 1 || number > amount || number.includes('-') || number.includes('+') || number.includes(',') || number.includes('.')) {
            let numberErr = await message.translate("NUMBER_ERROR")
            return message.errorMessage(numberErr.replace("{amount}", "1").replace("{range}", amount.toLocaleString()))

        }
        const role = message.mentions.roles.first() || message.guild.roles.cache.get(args[2])
        if (!role || role.name === '@everyone' || role.name === 'here' || role.managed) {
            let err = await message.translate("ERROR_ROLE")
            return message.errorMessage(err);
        }
        const lang = await message.translate("ADDRANK")
        let check = await rolesRewards.findOne({ serverID: message.guild.id, reason: type, roleID: role.id })
        if (check) return message.errorMessage(lang.addAlready.replace("{x}", check.level))
        if (message.guild.me.roles.highest.comparePositionTo(role) < 0) {
            const langA = await message.translate("ROLES")
            return message.errorMessage(langA.position);
        }
        let veeynew = new rolesRewards({
            serverID: `${message.guild.id}`,
            roleID: `${role.id}`,
            level: `${number}`,
            reason: `${type}`
        }).save()
        if (type === "messages") {
            return message.succesMessage(lang.addOK1.replace("{role}", role.name).replace("{x}", number.toLocaleString()))
        } else {
            return message.succesMessage(lang.addOK2.replace("{role}", role.name).replace("{x}", number.toLocaleString()))
        }
    },
};