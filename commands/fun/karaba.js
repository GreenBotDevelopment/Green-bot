const fetch = require("node-fetch");
const Discord = require('discord.js');
const emoji = require('../../emojis.json')
const DIG = require("discord-image-generation");
module.exports = {
    name: 'delete',
    description: 'Ajoute des effets à votre avatar',
    botpermissions: ['ATTACH_FILES'],
    usage: '[user]',
    cat: 'fun',
    async execute(message, args) {
        const user = message.mentions.users.first() || message.author;
        let avatar = user.displayAvatarURL({ dynamic: false, format: 'png' });

        let img = await new DIG.Delete().getImage(avatar)

        let attach = new Discord.MessageAttachment(img, "delete.png");;
        message.channel.send(attach)


    },
};
