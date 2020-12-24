const Discord = require('discord.js');


const emoji = require('../../emojis.json')

module.exports = {
    name: 'queue',
    description: 'affiche tous les sons dans la queue',
    cat: 'musique',

    botpermissions: ['CONNECT', 'SPEAK'],

    async execute(message, args) {


        const voice = message.member.voice.channel;
        if (!voice) {
            return message.channel.send(`${emoji.error} Vous devez d'abord rejoindre un salon vocal !`)
        }

        if (!message.client.player.getQueue(message)) return message.channel.send(`${emoji.error} Je ne joue pas de musique actuellement.`)


        const queue = message.client.player.getQueue(message);
        const embed = new Discord.MessageEmbed()

        .setTitle(`Queue du serveur (${queue.tracks.length} sons)`)

        .setColor(message.client.color)
            .addField('En cours :', `${queue.playing.title} | ${queue.playing.author}
    `)
            .addField(`Queue ${queue.repeatMode ? `Répétition : ${emoji.succes}` : `Répétition ${emoji.error}`}`, queue.tracks.map((track, i) => `**#${i + 1}** - ${track.title} | ${track.author} [ ${track.requestedBy}]`))


        .setFooter(message.client.footer)


        message.channel.send(embed)














    },
};
