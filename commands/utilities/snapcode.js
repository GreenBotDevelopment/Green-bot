const emoji = require('../../emojis.json')
const Discord = require('discord.js');
const fetch = require("node-fetch");
module.exports = {
    name: 'snapcode',
    description: 'recherche un spancode',
    aliases: [],
    usage: '<pseudo>',
    args: true,
    exemple: 'Pauldb9',
    cat: 'utilities',
    guildOnly: true,


    async execute(message, args) {


        const pseudo = args[0]

        const snapcode = `https://feelinsonice.appspot.com/web/deeplink/snapcode?username=${pseudo}&size=320&type=PNG`


        const embed = new Discord.MessageEmbed()
            .setTitle("SNAPCODE")
            .setDescription("Voici votre recherche du snapcode: `" + pseudo + "`")
            .setImage(snapcode)
            .setFooter(message.client.footer)

        .setColor(message.client.color);

        message.channel.send(embed)
    },
};