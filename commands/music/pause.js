const Discord = require('discord.js');


const emoji = require('../../emojis.json')

module.exports = {
    name: 'pause',
    description: 'Met la musique actuelle en pause',
    cat: 'musique',

    botpermissions: ['CONNECT', 'SPEAK'],

    async execute(message, args) {


        const voice = message.member.voice.channel;
        if (!voice) {
            return message.channel.send(`${emoji.error} Vous devez d'abord rejoindre un salon vocal !`)
        }

        if (!message.client.player.getQueue(message)) return message.channel.send(`${emoji.error} Je ne joue pas de musique actuellement.`)
        message.client.player.pause(message);

        message.channel.send(`${emoji.succes} - La musique a été mise en pause  !`);












    },
};
