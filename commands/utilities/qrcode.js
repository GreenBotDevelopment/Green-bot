const fetch = require("node-fetch");
const Discord = require('discord.js');
const emoji = require('../../emojis.json')
module.exports = {
    name: 'qrcode',
    description: 'crée un qrcode avec le texte donné',
    args: true,
    usage: '<votre texte>',
    cat: 'utilities',
    async execute(message, args) {
        let text = args.join(" ");
        const m = await message.channel.send(`${emoji.loading} Génération de l'image en cours , veuillez patienter.`);
        const embed = new Discord.MessageEmbed()
            .setImage(`https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${text.replace(new RegExp(" ", "g"), "%20")}`)
            .setColor(message.client.color || '#3A871F')
            .setFooter(message.client.footer || 'Green-Bot | Open source bot by 𝖕𝖆𝖚𝖑𝖉𝖇09#9846')
            .setAuthor('QR CODE')
        m.delete();
        message.channel.send(embed);

    },
};