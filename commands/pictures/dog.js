const fetch = require("node-fetch");
const Discord = require('discord.js');
module.exports = {
    name: 'dog',
    description: 'Renvoie une photo de chien',

    cat: 'pictures',
    async execute(message, args) {
        const { url } = await fetch('https://random.dog/woof.json').then(response => response.json());
        const doneEmbed = new Discord.MessageEmbed()
            .setColor(message.client.color || '#3A871F')

        .setTitle(':dog: Voici un chien')
            .setImage(url)
            .setFooter(message.client.footer || 'Green-Bot | Open source bot by 𝖕𝖆𝖚𝖑𝖉𝖇09#9846')

        message.channel.send(doneEmbed);
    },
};