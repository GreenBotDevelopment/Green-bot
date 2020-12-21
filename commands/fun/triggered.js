const fetch = require("node-fetch");
const Discord = require('discord.js');
const emoji = require('../../emojis.json')
const DIG = require("discord-image-generation");
module.exports = {
    name: 'triggered',
    description: 'Ajoute des effets à votre avatar',
    botpermissions: ['ATTACH_FILES'],
    usage: '[user]',
    cat: 'pictures',
    async execute(message, args) {
        const user = message.mentions.users.first() || message.author;
        let avatar = user.displayAvatarURL({ dynamic: false, format: 'png' });

        let img = await new DIG.Triggered().getImage(avatar)

        let attach = new Discord.MessageAttachment(img, "delete.gif");;
        message.channel.send(attach)


    },
};
