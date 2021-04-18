const Discord = require('discord.js');
const emoji = require('../../emojis.json')
module.exports = {
    name: 'shuffle',
    description: 'Mélange la queue du serveur',
    permissions: false,
    aliases: ['shufle'],
    cat: 'musique',
    botpermissions: ['CONNECT', 'SPEAK'],
    async execute(message, args) {

        const voice = message.member.voice.channel;
        if (!voice) {
            return message.errorMessage(`Vous devez d'abord rejoindre un salon vocal !`)
        }

        if (!message.client.player.getQueue(message)) return message.errorMessage(`Je ne joue pas de musique actuellement.`)

        message.client.player.shuffle(message);
        message.mainMessage(`🔀 La queue du serveur a bien été mélangée (**${message.client.player.getQueue(message).tracks.length}** sons) `)







    },
};