const Discord = require('discord.js');

const discordTTS = require("discord-tts");
const emoji = require('../../emojis.json')

module.exports = {
    name: 'voice_speak',
    description: 'Fait parler le bot dans le salon vocal actuel.',
    cat: 'musique',
    args: true,
    aliases: ['speak', 'parle', 'tts', 'vocsay'],
    usage: '<mot>',
    exemple: 'Bonjour',
    botpermissions: ['CONNECT', 'SPEAK'],

    async execute(message, args) {
        const voice = message.member.voice.channel;
        if (!voice) {
            return message.errorMessage(`Vous devez d'abord rejoindre un salon vocal !.`)
        }
        const name = args.join(" ");
        if (!name) {
            return message.errorMessage(`Veuillez me dire ce que je doit dire dans le salon vocal..`)
        }
        if (name.length > 200 || name.length < 3) return message.errorMessage('Votre texte doit faire entre 3 et 200 caractères !');
        if (message.client.player.getQueue(message)) return message.errorMessage(`Il y a déja une musique en cours.`)

        const broadcast = message.client.voice.createBroadcast();
        var channelId = message.member.voice.channelID;
        let channel = message.client.channels.cache.get(channelId);
        channel.join().then(connection => {
            broadcast.play(discordTTS.getVoiceStream(name, lang = "fr-FR", speed = 1));
            message.succesMessage(`Je dit votre message dans le canal vocal..`)

            const dispatcher = connection.play(broadcast).then(connection => {
                channel.leave()
            });
        });










    },
};