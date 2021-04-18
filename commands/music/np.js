const Discord = require('discord.js');


const emoji = require('../../emojis.json')

module.exports = {
    name: 'np',
    description: 'Affiche le titre en lecture actuellement',
    cat: 'musique',

    botpermissions: ['CONNECT', 'SPEAK'],

    async execute(message, args) {
        const { client } = message;

        const voice = message.member.voice.channel;
        if (!voice) {
            return message.errorMessage(`Vous devez d'abord rejoindre un salon vocal !`)
        }

        if (!message.client.player.getQueue(message)) return message.errorMessage(`Je ne joue pas de musique actuellement.`)
        const track = await client.player.nowPlaying(message);
        const filters = [];

        Object.keys(client.player.getQueue(message).filters).forEach((filterName) => {
            if (client.player.getQueue(message).filters[filterName]) filters.push(filterName);
        });

        message.channel.send(`\`\`\`js\n__En cours actuellement__\nNom : ${track.title}\nAuteur : ${track.author}\nAjouté par : ${track.requestedBy.tag}\nProgression : ${client.player.createProgressBar(message, { timecodes: true })}\`\`\``)











    },
};