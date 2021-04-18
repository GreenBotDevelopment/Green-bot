const Discord = require('discord.js');


const emoji = require('../../emojis.json')

module.exports = {
    name: 'stop',
    description: 'Arrete la musique et fait quitter le bot',
    cat: 'musique',

    botpermissions: ['CONNECT', 'SPEAK'],

    async execute(message, args) {


        const voice = message.member.voice.channel;
        if (!voice) {
            return message.errorMessage(`Vous devez d'abord rejoindre un salon vocal !`)
        }

        if (!message.client.player.getQueue(message)) return message.errorMessage(`Je ne joue pas de musique actuellement.`)
        if (message.guild.me.voice.channel && message.member.voice.channel.id !== message.guild.me.voice.channel.id) return message.errorMessage(`Nous ne sommes pas dans le même salon vocal`);

        message.client.player.setRepeatMode(message, false);
        message.client.player.stop(message);

        message.mainMessage(`⏹ J'ai arrété la musique avec succès dans ce serveur !`);










    },
};