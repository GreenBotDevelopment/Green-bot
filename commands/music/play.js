const Discord = require('discord.js');


const emoji = require('../../emojis.json')

module.exports = {
    name: 'play',
    description: 'Joue la musique indiqué dans le salon vocal dans lequel vous êtes.',
    cat: 'musique',
    args: true,
    usage: '<nom de la musique>',
    exemple: 'Angela',
    botpermissions: ['CONNECT', 'SPEAK'],

    async execute(message, args) {

        const name = args.join(" ");
        if (!name) {
            return message.channel.send(`${emoji.error} Veuillez fournir un nom de chanson ou un lien.`)
        }
        const voice = message.member.voice.channel;
        if (!voice) {
            return message.channel.send(`${emoji.error} Vous devez d'abord rejoidre un salon vocal !.`)
        }
        message.client.player.play(message, args.join(" "));









    },
};