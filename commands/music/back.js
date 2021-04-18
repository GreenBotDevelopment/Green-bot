const Discord = require('discord.js');


const emoji = require('../../emojis.json')

module.exports = {
    name: 'back',
    description: 'Joue la musique précédente',
    cat: 'musique',

    botpermissions: ['CONNECT', 'SPEAK'],

    async execute(message, args) {


        const voice = message.member.voice.channel;
        if (!voice) {
            return message.errorMessage(`Vous devez d'abord rejoindre un salon vocal !`)
        }

        if (!message.client.player.getQueue(message)) return message.errorMessage(`Je ne joue pas de musique actuellement.`)
   if(!message.client.player.getQueue(message).previousTracks[0]){
            return message.errorMessage(`Il n'y a pas de son avant celui actuel !`)
		}
        message.client.player.back(message);










    },
};