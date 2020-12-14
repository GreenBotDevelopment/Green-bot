const fetch = require("node-fetch");
const Discord = require('discord.js');
module.exports = {
    name: 'koala',
    description: 'Renvoie une photo de koala',

    cat: 'pictures',
    async execute(message, args) {
        const { link } = await fetch('https://some-random-api.ml/img/koala').then(response => response.json());
        const doneEmbed = new Discord.MessageEmbed()
            .setColor(message.client.color || '#3A871F')

        .setTitle('🐨 Voici un koala')
            .setImage(link)
            .setFooter(message.client.footer || 'Green-Bot | Open source bot by 𝖕𝖆𝖚𝖑𝖉𝖇09#9846')

        message.channel.send(doneEmbed);
    },
};