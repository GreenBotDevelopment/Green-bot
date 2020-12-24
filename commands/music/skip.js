const Discord = require('discord.js');


const emoji = require('../../emojis.json')

module.exports = {
    name: 'skip',
    description: 'Passe la musique actuelle',
    cat: 'musique',

    botpermissions: ['CONNECT', 'SPEAK'],

    async execute(message, args) {


        const voice = message.member.voice.channel;
        if (!voice) {
            return message.channel.send(`${emoji.error} Vous devez d'abord rejoidre un salon vocal !`)
        }

        if (!message.client.player.getQueue(message)) return message.channel.send(`${emoji.error} Je ne joue pas de musique actuellement.`)

        message.client.player.skip(message);










    },
};