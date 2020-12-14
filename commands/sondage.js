const { prefix } = require('../config.json');
const Discord = require('discord.js');
const emoji = require('../emojis.json')
module.exports = {
    name: 'sondage',
    description: 'Crée un sondage',
    aliases: ['poll'],
    args: true,
    cat: 'other',
    usage: '<raison>',
    cooldown: 5,
    execute(message, args) {


        const msg = args.join(' ');



        let pollEmbed = new Discord.MessageEmbed()
            .setTitle(" Nouveau sondage:")
            .setDescription(msg)
            .setColor(message.client.color || '#3A871F')

        .setFooter(message.client.footer || 'Green-Bot | Open source bot by 𝖕𝖆𝖚𝖑𝖉𝖇09#9846')


        try {
            message.channel.send({ embed: pollEmbed }).then(sentEmbed => {
                message.delete();
                sentEmbed.react(`${emoji.succes}`);
                sentEmbed.react(`${emoji.error}`);
            });
        } catch {
            return message.channel.send(ldb.err);

        }




    },
};