const fetch = require("node-fetch");
const Discord = require('discord.js');
const emoji = require('../../emojis.json')
const DIG = require("discord-image-generation");
module.exports = {
    name: 'presentation',
    description: 'Ajoute des effets à votre avatar',
    botpermissions: ['ATTACH_FILES'],
    usage: '[user]',
    args:true,
    exemple:'hey',
    cat: 'pictures',
    async execute(message, args) {
      
        let avatar = args.join("");

        let img = await new DIG.LisaPresentation().getImage(avatar)

        let attach = new Discord.MessageAttachment(img, "delete.png");;
        message.channel.send(attach)


    },
};
