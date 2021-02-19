const emoji = require('../../emojis.json')
const Discord = require('discord.js');
const fetch = require("node-fetch");
module.exports = {
    name: 'wikipedia',
    description: 'Cherche un terme sur wikipedia',
    aliases: ['wiki'],
    usage: '<recharche>',
    cat: 'utilities',

    async execute(message, args) {
        let q = args.join(" ");
        if (!q) return message.errorMessage(`Veuillez indiquez ce que je doit chercher sur wikipedia`)
        const body = await fetch(
            `https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(q)}`,
        ).then(res => res.json().catch(() => {}));

        if (!body) return message.errorMessage(`Je n'ai trouvé aucuns résultats sur wikipedia pour \`${q}\``)
        if (body.title && body.title === "Not found.")
            if (!body) return message.errorMessage(`Je n'ai trouvé aucuns résultats sur wikipedia pour \`${q}\``)


        const embed = new Discord.MessageEmbed()
            .setTitle(`🌐 ${body.title} `)
            .addField("Lien de l'article", `**[CLique ici](${body.content_urls.desktop.page})**`, true)
            .setDescription(`** ${body.extract}**`)
            .setColor(message.client.color)
            .setFooter(message.client.footer)

        if (body.thumbnail) embed.setThumbnail(body.thumbnail.source);
        message.channel.send(embed);
    },
};
