const Discord = require('discord.js');
const sendErrorMessage = require('../../util.js');
const Welcome = require('../../database/models/guild');
const emojic = require('../../emojis.json')
const { oneLine } = require('common-tags');
const rrmodel = require('../../database/models/rr')
module.exports = {
    name: 'rr-list',
    description: 'Renvoie la liste de tous les roles à réaction du serveur',
    aliases: ['listrolereaction'],

    cat: 'rr',

    permissions: ['MANAGE_GUILD'],
    async execute(message, args) {
        let channeldb = await rrmodel.find({ serverID: message.guild.id })
        if (channeldb) {


            const reportEmbed = new Discord.MessageEmbed()
                .setTitle(`Liste dés roles à réaction`)


            .setDescription(channeldb.map(rr => `<@&${rr.roleID}> ===>  ${rr.reaction}`).join(`
            `) || `${emojic.error} Aucun Role à réaction pour ce serveur`)

            .setFooter(message.client.footer)

            .setColor(message.client.color);
            message.channel.send(reportEmbed);
        } else {

            return message.channel.send(`${emojic.error} Aucun Role à réaction pour ce serveur`);

        }












    },
};