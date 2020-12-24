const Discord = require('discord.js');


const emoji = require('../../emojis.json')

module.exports = {
    name: 'loop',
    description: 'Active /désactive la répetition',
    cat: 'musique',

    botpermissions: ['CONNECT', 'SPEAK'],

    async execute(message, args) {


        const voice = message.member.voice.channel;
        if (!voice) {
            return message.channel.send(`${emoji.error} Vous devez d'abord rejoidre un salon vocal !`)
        }

        if (!message.client.player.getQueue(message)) return message.channel.send(`${emoji.error} Je ne joue pas de musique actuellement.`)



        const repeatMode = message.client.player.getQueue(message).repeatMode;

        if (repeatMode) {
            message.client.player.setRepeatMode(message, false);
            return message.channel.send(`${emoji.succes} - Répetition **Désactivée** !`);
        } else {
            message.client.player.setRepeatMode(message, true);
            return message.channel.send(`${emoji.succes} - Répetition **Activée** !`);
        };












    },
};
