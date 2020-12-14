const emoji = require('../../emojis.json')
const Discord = require('discord.js');
const fetch = require("node-fetch");
module.exports = {
    name: 'hastebin',
    description: 'place le code fourni dans un hastebin',

    usage: '<code>',
    args: true,
    exemple: '<html></html>',
    cat: 'utilities',



    async execute(message, args) {


        const content = args.join(" ");


        try {
            const res = await fetch("https://hasteb.in/documents", {
                method: "POST",
                body: content,
                headers: { "Content-Type": "text/plain" }
            });

            const json = await res.json();
            if (!json.key) {
                return message.channel.send(`${emoji.error} Une erreur est survenue , veuillez réayssayer..`);
            }
            const url = "https://hasteb.in/" + json.key + ".js";

            const embed = new Discord.MessageEmbed()
                .setTitle('HASTEBIN')
                .setDescription(url)
                .setColor(message.client.color)
                .setFooter(message.client.footer)
            message.channel.send(embed);
        } catch (e) {
            return message.channel.send(`${emoji.error} Une erreur est survenue , veuillez réayssayer..`);
        }

    },
};