const fetch = require("node-fetch");
const Discord = require('discord.js');
const emoji = require('../../emojis.json')
module.exports = {
    name: 'love',
    description: 'fait un test de love',

    usage: '<user1> <user2>',
    cat: 'fun',
    async execute(message, args) {

        const users = [
            await message.mentions.users.first() || message.author,
            await message.mentions.users.last() || message.author
        ];

        const m = await message.channel.send(`${emoji.loading} Génération de l'image en cours , veuillez patienter.`);

        try {
            const res = await fetch(encodeURI(`https://nekobot.xyz/api/imagegen?type=ship&user1=${users[0].displayAvatarURL({ format: "png", size: 512 })}&user2=${users[1].displayAvatarURL({ format: "png", size: 512 })}`));
            const json = await res.json();
            const attachment = new Discord.MessageAttachment(json.message, "love.png");
            message.channel.send(attachment);
            m.delete();
        } catch (e) {
            console.log(e);

        }
    },
};