const Discord = require('discord.js');
const sendErrorMessage = require('../../util.js');
const Welcome = require('../../database/models/guild');
const emojic = require('../../emojis.json')
const { oneLine } = require('common-tags');
const rrmodel = require('../../database/models/rr');
const { arg } = require('mathjs');
module.exports = {
    name: 'rr-removeall',
    description: 'Supprime tous les rôles du système de roles à réactions',
    aliases: ['delallrolereaction'],

    cat: 'configuration',

    permissions: ['MANAGE_GUILD'],
    async execute(message, args) {

        let channeldb = await rrmodel.find({ serverID: message.guild.id })
        if (channeldb) {
            if (channeldb.length == 0) return message.errorMessage(`Il n'y a encore aucun rôle à réaction pour ce serveur`);

            channeldb.forEach(async(s) => {

                await rrmodel.findOneAndDelete({ serverID: message.guild.id, _id: s._id });

            });
            return message.succesMessage(`Tous les rôles à réaction du serveur on étés supprimés.`);

        } else {

            return message.errorMessage(`Il n'y a encore aucun rôle à réaction pour ce serveur`);

        }













    },
};