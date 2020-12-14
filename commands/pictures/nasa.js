const fetch = require("node-fetch");
const Discord = require('discord.js');
module.exports = {
    name: 'nasa',
    description: 'Renvoie la photo du jour de la nasa',

    cat: 'pictures',
    async execute(message, args) {
        const { hdurl } = await fetch('https://api.nasa.gov/planetary/apod?api_key=WHsJtJDvvS8GOaYdXMhKVkqN9Tr1xPkFLGnF4uo5').then(response => response.json());
        const doneEmbed = new Discord.MessageEmbed()
            .setColor(message.client.color || '#3A871F')

        .setTitle('Voici la photo du jour de la nasa')
            .setImage(hdurl)
            .setFooter(message.client.footer || 'Green-Bot | Open source bot by 𝖕𝖆𝖚𝖑𝖉𝖇09#9846')

        message.channel.send(doneEmbed);
    },
};