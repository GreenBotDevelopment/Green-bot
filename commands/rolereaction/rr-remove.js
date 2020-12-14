const Discord = require('discord.js');
const sendErrorMessage = require('../../util.js');
const Welcome = require('../../database/models/guild');
const emojic = require('../../emojis.json')
const { oneLine } = require('common-tags');
const rrmodel = require('../../database/models/rr');
const { arg } = require('mathjs');
module.exports = {
    name: 'rr-remove',
    description: 'Supprime un role du système de roles à réactions',
    aliases: ['delrolereaction'],

    cat: 'rr',
    args: true,
    usage: '@role',
    exemple: '@pub',
    permissions: ['MANAGE_GUILD'],
    async execute(message, args) {
        let role = message.mentions.roles.first() || message.guild.roles.cache.get(args[1]);
        if (!role) {
            return message.channel.send(`${emojic.error}  Veuillez fournir un role !`);
        }

        let channeldb = await rrmodel.findOne({ serverID: message.guild.id, roleID: role.id })
        if (channeldb) {

            const newchannel = await rrmodel.findOneAndDelete({ serverID: message.guild.id, roleID: role.id });

            return message.channel.send(`${emojic.succes} Ce Role é été supprimé avec succès.`);

        } else {

            return message.channel.send(`${emojic.error}  Je n'ai pas ce role dans ma base de donées...`);

        }













    },
};