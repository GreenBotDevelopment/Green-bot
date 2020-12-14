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

    cat: 'rr',

    permissions: ['MANAGE_GUILD'],
    async execute(message, args) {
        let channeldb = await rrmodel.find({ serverID: message.guild.id })
        if (channeldb) {
            if (channeldb.length === 0) {
                return message.channel.send(`${emojic.error} Aucun Role à réaction pour ce serveur`);

            }

            const reportEmbed = new Discord.MessageEmbed()
                .setTitle(`Roles à réaction`)
                .setDescription("Réagissez avec l'emoji correspondant au role que vous voulez.")
                .addField("Roles", channeldb.map(rr => ` ${rr.reaction}   Pour :    <@&${rr.roleID}> `).join(`
                `))


            .setFooter(message.client.footer)

            .setColor(message.client.color);
            message.channel.send(reportEmbed).then(function(message) {
                channeldb.forEach(command => {
                    message.react(command.reaction);
                });
            })

        } else {

            return message.channel.send(`${emojic.error} Aucun Role à réaction pour ce serveur`);

        }












    },
};