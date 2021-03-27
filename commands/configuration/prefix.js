const Discord = require('discord.js');
const sendErrorMessage = require('../../util.js');
const guild = require('../../database/models/guild');
const emoji = require('../../emojis.json')
const { oneLine } = require('common-tags');
module.exports = {
    name: 'prefix',
    description: 'Récupère le préfix du bot',
    cat: 'configuration',
    exemple: '',

    async execute(message, args) {
        const prefixe = await guild.findOne({ serverID: message.guild.id, reason: `prefix` });
        const embed = new Discord.MessageEmbed()
            .setAuthor(`${message.client.user.username} - Préfixe`, message.client.user.displayAvatarURL())

        .setThumbnail(message.guild.iconURL({ dynamic: true }))
            .addField('Préfixe', `\`${prefixe.content}\``, true)
            .addField('Exemple', `\`${prefixe.content}help\``, true)
            .setFooter(message.client.footer)
            .setTimestamp()
            .setColor(message.client.color);
        message.channel.send(embed);
    },
};
