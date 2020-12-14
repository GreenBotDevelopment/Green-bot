const emoji = require('../../emojis.json')
const Discord = require('discord.js');
const fetch = require("node-fetch");
module.exports = {
    name: 'shorturl',
    description: 'raccourci une URL donnée',
    aliases: [],
    usage: '<url>',
    args: true,
    exemple: 'http://green-bot.tk/',
    cat: 'utilities',
    guildOnly: true,


    async execute(message, args) {


        const url = args[0];


        const res = await fetch(`https://is.gd/create.php?format=simple&url=${encodeURI(url)}`);
        const body = await res.text();

        if (body === "Error: Please enter a valid URL to shorten") {
            return message.channel.send(`${emoji.error} Veuillez indiquer une URL valide !`);
        }

        const embed = new Discord.MessageEmbed()
            .setColor(message.client.color)
            .setFooter(message.client.footer)
            .setDescription(body)
            .setTitle('URL raccourcie');
        message.channel.send(embed);
    },
};