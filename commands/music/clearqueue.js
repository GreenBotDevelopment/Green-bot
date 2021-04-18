const Discord = require('discord.js');
const emoji = require('../../emojis.json')
module.exports = {
    name: 'clearqueue',
    description: 'Supprime la queue du serveur',
    permissions: false,
    aliases: ['cq'],
    cat: 'musique',
    botpermissions: ['CONNECT', 'SPEAK'],
    async execute(message, args) {

        const voice = message.member.voice.channel;
        if (!voice) {
            return message.errorMessage(`Vous devez d'abord rejoindre un salon vocal !`)
        }
        if (message.guild.me.voice.channel && message.member.voice.channel.id !== message.guild.me.voice.channel.id) return message.errorMessage(`Nous ne sommes pas dans le même salon vocal`);
        if (!message.client.player.getQueue(message)) return message.errorMessage(`Je ne joue pas de musique actuellement.`)

        if (message.client.player.getQueue(message).tracks.length <= 1) return message.errorMessage(`Il y a seulement une seule musique dans la queue `);


        message.client.player.clearQueue(message);
        message.mainMessage(`☑ La queue du serveur vient d'être **supprimée**`)







    },
};