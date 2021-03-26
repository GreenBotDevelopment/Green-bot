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
        const prefixe = await guild.findOne({ serverID: message.guild.id, reason: `prefix` });

        const newchannel = await guild.findOneAndUpdate({ serverID: message.guild.id, reason: `prefix` }, { $set: { content: args[0], reason: `prefix` } }, { new: true });

        const embed = new Discord.MessageEmbed()
            .setAuthor(`${message.client.user.username} - Préfixe`, message.client.user.displayAvatarURL())
            .setDescription(`le préfixe a été mis à jour avec succès`)
            .setThumbnail(message.guild.iconURL({ dynamic: true }))
            .addField('Préfixe', ` \`${prefixe.content}\` ➔ \`${args[0]}\``, true)
            .setFooter(message.client.footer)
            .setTimestamp()
            .setColor(message.client.color);
        
            message.channel.send(embed);
    },
};
