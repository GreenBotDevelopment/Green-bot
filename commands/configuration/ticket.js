const Discord = require('discord.js');
const sendErrorMessage = require('../../util.js');
const Welcome = require('../../database/models/Welcome');
const emoji = require('../../emojis.json')
const { oneLine } = require('common-tags');
module.exports = {
    name: 'ticket',
    description: 'Crée un système de ticket',
    aliases: ['ticket-system', 'ticket-send'],

    cat: 'configuration',

    permissions: ['MANAGE_GUILD'],
    async execute(message, args) {
        if (message && message.deletable) message.delete().catch(e => {});

        let embed = new Discord.MessageEmbed()
            .setTitle(`🎫 | Système de Tickets`)
            .setColor(message.client.color)

        .setDescription(`Bonjour , pour créer un ticket il suffit de réagir avec 🎫 !
⚠ Toute ouverture de ticket inutile sera sanctionée !`)
        .setFooter(message.client.footer ,  message.client.user.displayAvatarURL());
        message.channel.send(embed).then(m => {
            m.react('🎫');
        });











    },
};
