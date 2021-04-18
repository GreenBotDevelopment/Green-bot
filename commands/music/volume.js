const Discord = require('discord.js');
const emoji = require('../../emojis.json')
module.exports = {
    name: 'volume',
    description: 'Changer le volume du bot dans le salon vocal',
    permissions: false,
    aliases: ['sound', 'v'],
    cat: 'musique',
    args: true,
    usage: '<nombre>',
    exemple: '70',
    botpermissions: ['CONNECT', 'SPEAK'],
    async execute(message, args) {

        const voice = message.member.voice.channel;
        if (!voice) {
            return message.errorMessage(`Vous devez d'abord rejoindre un salon vocal !`)
        }

        if (!message.client.player.getQueue(message)) return message.errorMessage(`Je ne joue pas de musique actuellement. Il est donc impossible de changer le son`)

        if (!args[0]) return message.errorMessage(`Veuillez fournir un nombre valide , entre 1 et 100 !`);

        if (isNaN(args[0]) || 100 < parseInt(args[0]) || parseInt(args[0]) <= 0) return message.errorMessage(`Veuillez fournir un nombre valide , entre 1 et 100 !`);

        if (message.content.includes('-') || message.content.includes('+') || message.content.includes(',') || message.content.includes('.')) return message.errorMessage(`Veuillez fournir un nombre valide , entre 1 et 100 et sans virgules!`);

        message.client.player.setVolume(message, parseInt(args[0]));

        message.mainMessage(`🔊 Volume défini sur **${args[0]}%** !`);








    },
};