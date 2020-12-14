const fetch = require("node-fetch");
const Discord = require('discord.js');
const emoji = require('../../emojis.json')
module.exports = {
    name: 'captcha',
    description: 'génere un captcha',

    usage: '[user]',
    cat: 'fun',
    async execute(message, args) {
        const user = message.mentions.users.first() || message.author;

        const m = await message.channel.send("<:information:769234471236665355> | **Génération de l'image en cours**");
        const res = await fetch(encodeURI(`https://nekobot.xyz/api/imagegen?type=captcha&username=${user.username}&url=${user.displayAvatarURL({ format: "png", size: 512 })}`));
        const json = await res.json();
        const attachment = new Discord.MessageAttachment(json.message, "captcha.png");
        message.channel.send(attachment);
        m.delete();
    },
};