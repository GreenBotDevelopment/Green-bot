const Discord = require('discord.js');
const sendErrorMessage = require('../../util.js');
const Welcome = require('../../database/models/guild');
const emojic = require('../../emojis.json')
const { oneLine } = require('common-tags');
const rrmodel = require('../../database/models/rr')
module.exports = {
        name: 'rr-send',
        description: 'Crée un embed avec les roles à réaction',
        aliases: ['sendrolereaction'],
        usage: "<nom>",
        cat: 'admin',

        permissions: ['MANAGE_GUILD'],
        async execute(message, args) {
            let channeldb = await rrmodel.find({ serverID: message.guild.id })
            if (channeldb) {
                if (channeldb.length == 0) {
                    return message.errorMessage(`Il n'y a encore aucun rôle à réaction pour ce serveur`);

                }
                if (!args.join(" ")) return message.errorMessage(`Veuillez fournir le nom du groupe de roles à réaction`)

                message.channel.send(`**${args.join(" ")}**\nRéagissez avec l'emoji correspondant au role que vous voulez.\n${channeldb.map(rr => ` ${rr.reaction} <@&${rr.roleID}> `).join(`\n\n`)}`).then(function(message) {
                channeldb.forEach(command => {
                    message.react(command.reaction);
                });
            })

        } else {

            return message.errorMessage(`Il n'y a encore aucun rôle à réaction pour ce serveur`);

        }












    },
};