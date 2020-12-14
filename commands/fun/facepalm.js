const fetch = require("node-fetch");
const Discord = require('discord.js');
const emoji = require('../../emojis.json')
Canvas = require("canvas");
module.exports = {
    name: 'facepalm',
    description: 'Ajoute des effets à votre avatar',

    usage: '[user]',
    cat: 'fun',
    async execute(message, args) {
        const user = message.mentions.users.first() || message.author;
        const m = await message.channel.send(`${emoji.loading} Génération de l'image en cours , veuillez patienter.`);

        const canvas = Canvas.createCanvas(632, 357),
            ctx = canvas.getContext("2d");

        // Draw background for transparent avatar
        ctx.fillStyle = "black";
        ctx.fillRect(0, 0, 632, 357);

        // Draw avatar
        const avatar = await Canvas.loadImage(user.displayAvatarURL({ format: "png", size: 512 }));
        ctx.drawImage(avatar, 199, 112, 235, 235);

        // Draw layer
        const layer = await Canvas.loadImage("https://tutosduweb.000webhostapp.com/@dmin/facepalm.png");
        ctx.drawImage(layer, 0, 0, 632, 357);

        const attachment = new Discord.MessageAttachment(canvas.toBuffer(), "facepalm.png");

        m.delete();
        message.channel.send(attachment);

    },
};