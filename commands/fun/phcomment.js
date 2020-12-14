const fetch = require("node-fetch");
const Discord = require('discord.js');
const emoji = require('../../emojis.json')
module.exports = {
    name: 'phcomment',
    description: 'fait un commentaire pornhub',
    args: true,
    usage: '<autheur> <Texte>',
    cat: 'fun',
    async execute(message, args) {

        let user = message.mentions.members.first() || message.author;
        let text = args.join(" ");



        if (!text) {
            return message.channel.send(`${emoji.error} Veuillez indiquer un texte`)
        }

        const m = await message.channel.send(`${emoji.loading} Génération de l'image en cours , veuillez patienter.`);

        try {
            const res = await fetch(encodeURI(`https://nekobot.xyz/api/imagegen?type=phcomment&username=${user.username}&image=${user.displayAvatarURL({ format: "png", size: 512 })}&text=${text}`));
            const json = await res.json();
            const attachment = new Discord.MessageAttachment(json.message, "phcomment.png");
            message.channel.send(attachment);
            m.delete();
        } catch (e) {
            console.log(e);

        }
    },
};