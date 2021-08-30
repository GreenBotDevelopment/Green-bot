const moment = require('moment');
const Discord = require('discord.js');
const Warn = require('../../database/models/warn');
const Case = require('../../database/models/case');

module.exports = {
    name: 'delete-case',
    description: 'Delete a case from the database',
    aliases: ["casedelete", "case-delete", ],
    args: 'member',
    usage: '<id>',
    exemple: 'EEF4F',
    cat: 'moderation',
    botpermissions: ["SEND_MESSAGES", "EMBED_LINKS"],
    permissions: ['MANAGE_GUILD'],
    async execute(message, args, client) {
        const lang = await message.translate("CASE_DELETE")
        let id = args[0]
        const check = await Case.findOne({ serverID: message.guild.id, id: id })
        if (!check) return message.errorMessage(lang.err.replace("{id}", id))
        if (message.guild.memberCount !== message.guild.members.cache.size) await message.guild.members.fetch()
        message.succesMessage(lang.ok.replace("{case}", check.reason))
        const del = await Case.findOneAndDelete({ serverID: message.guild.id, id: id })


    },
};