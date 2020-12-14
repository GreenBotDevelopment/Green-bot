const Discord = require('discord.js');

const emoji = require('../../emojis.json');
module.exports = {
    name: 'pourcent',
    description: 'Donne le pourcentage d\'un nombre',
    aliases: [],
    args: true,
    usage: '<pourcent> <nombre> ',
    exemple: '50 102',
    cat: 'utilities',
    execute(message, args) {



        const amount = args[0]
        const maximum = args[1]

        if (!maximum) return message.channel.send(`${emoji.error} Veuillez indiquer un deuxième nombre !`)
        const percentage = (amount / maximum) * 100;
        const embed = new Discord.MessageEmbed()
            .setColor(message.client.color)
            .setFooter(message.client.footer)

        .setDescription(`**${amount}** est  **${percentage}%** de **${maximum}**.`);
        message.channel.send({ embed })






    },
};