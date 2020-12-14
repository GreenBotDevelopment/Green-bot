const fetch = require("node-fetch");
const Discord = require('discord.js');
const emoji = require('../../emojis.json')
module.exports = {
    name: 'someone',
    description: 'prend un utilisateur au hasard parmis les membres du serveur',


    cat: 'fun',
    async execute(message, args) {
        const member = message.guild.members.cache.random(1)[0];

        const embed = new Discord.MessageEmbed()
            .addField("username", member.user.username, true)
            .addField("Discriminator", member.user.discriminator, true)
            .addField("ID", member.user.id, true)
            .setThumbnail(member.user.displayAvatarURL())
            .setColor(message.client.color)
            .setFooter(message.client.footer)

        message.channel.send(embed);

    },
};