const emoji = require('../../emojis.json')
const Discord = require('discord.js');
const ChannelModel = require('../../database/models/guild');
module.exports = {
    name: 'support',
    description: 'donne le support',
   
    cat: 'utilities',
    guildOnly: true,

    async execute(message, args) {

        const paul = new Discord.MessageEmbed()
            .setTitle('`❓` Rejoint le support')
            .setDescription(`Tu as besoin d'aide ? alors rejoint le support [ICI](https://discord.gg/bCK2FrJfAG)`)
            .setFooter(message.client.footer)
.setColor(message.client.color)
        message.channel.send(paul)

    },
};
