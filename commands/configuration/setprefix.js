const Discord = require('discord.js');
const sendErrorMessage = require('../../util.js');
const guild = require('../../database/models/guild');
const emoji = require('../../emojis.json')
const { oneLine } = require('common-tags');
module.exports = {
    name: 'setprefix',
    description: 'Récupère le préfix du bot',
    usage: '<prefixe>',
    args: true,
    cat: 'configuration',
    exemple: '!',
    permissions: ['MANAGE_GUILD'],


    async execute(message, args) {
        let prefix = args.join("")
        if (prefix.length > 4 || prefix.length < 0) return message.errorMessage('Votre préfixe doit faire entre 1 et 4 caractères !');
        const prefixe = await guild.findOne({ serverID: message.guild.id, reason: `prefix` });

        const newchannel = await guild.findOneAndUpdate({ serverID: message.guild.id, reason: `prefix` }, { $set: { content: args[0], reason: `prefix` } }, { new: true });

        return message.succesMessage(`Le préfixe a bien été mis à jours vers \`${args[0]}\``)












    },
};