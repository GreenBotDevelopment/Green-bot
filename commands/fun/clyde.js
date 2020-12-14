const fetch = require("node-fetch");
const Discord = require('discord.js');
const emoji = require('../../emojis.json')
module.exports = {
    name: 'clyde',
    description: 'fait parler clyde !!',
    args: true,
    usage: '<votre texte>',
    cat: 'fun',
    async execute(message, args) {
        let text = args.join(" ");

        const m = await message.channel.send(`${emoji.loading} Génération de l'image en cours , veuillez patienter.`);

        const res = await fetch(encodeURI(`https://nekobot.xyz/api/imagegen?type=clyde&text=${text}`));
        const json = await res.json();
        const attachment = new Discord.MessageAttachment(json.message, "clyde.png");
        message.channel.send(attachment);
        m.delete();
    },
};