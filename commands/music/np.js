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
            return message.channel.send(`${emoji.error} Vous devez d'abord rejoindre un salon vocal !`)
        }

        if (!message.client.player.getQueue(message)) return message.channel.send(`${emoji.error} Je ne joue pas de musique actuellement.`)
        const track = await client.player.nowPlaying(message);
        const filters = [];

        Object.keys(client.player.getQueue(message).filters).forEach((filterName) => {
            if (client.player.getQueue(message).filters[filterName]) filters.push(filterName);
        });

        message.channel.send({
            embed: {
                color: client.color,
                author: { name: track.title },
                footer: { text: client.footer },
                fields: [
                    { name: 'Salon', value: track.author, inline: true },
                    { name: 'Ajouté par', value: track.requestedBy, inline: true },
                    { name: 'd\'une playlist', value: track.fromPlaylist ? 'Oui' : 'Non', inline: true },

                    { name: 'Vues', value: track.views, inline: true },
                    { name: 'Durée', value: track.duration, inline: true },
                    { name: 'Filtres', value: filters.length, inline: true },

                    { name: 'Avancement', value: client.player.createProgressBar(message, { timecodes: true }), inline: true }
                ],
                thumbnail: { url: track.thumbnail },
                timestamp: new Date(),
            },
        });










    },
};
