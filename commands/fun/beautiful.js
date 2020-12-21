const fetch = require("node-fetch");
const Discord = require('discord.js');
const emoji = require('../../emojis.json')
const DIG = require("discord-image-generation");
module.exports = {
    name: 'beautiful',
    description: 'Ajoute des effets à votre avatar',
    botpermissions: ['ATTACH_FILES'],
    usage: '[user]',
    cat: 'fun',
    async execute(message, args) {
        const user = message.mentions.users.first() || message.author;

        let image = new DIG.Beautiful().getImage(user.displayAvatarURL({ dynamic: false, format: 'png' }));
        const attachment = new Discord.MessageAttachment(image, "beautiful.png");
        message.channel.send(attachment);
     
    },
};
