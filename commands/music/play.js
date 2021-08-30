const Discord = require('discord.js');

const { Player, QueryType, QueueRepeatMode } = require("discord-player");
const Welcome = require('../../database/models/Welcome');

module.exports = {
    name: 'play',
    description: 'Joue la musique indiquée dans le salon vocal dans lequel vous êtes.',
    cat: 'music',
    args: true,
    aliases: ['p', 'song', 'youtube'],
    usage: '<music name>',
    usages: ["play <music>", "play <url>"],
    exemple: 'Never gonna give you up',
    botpermissions: ['CONNECT', 'SPEAK'],
    async execute(message, args) {
        if (message.guild.settings.dj_system) {
            if (!message.member.permissions.has("MANAGE_MESSAGES")) {
                let MissingRole = await message.translate("MISSING_ROLE");
                let Missingperm = await message.translate("MISSING_PERMISSIONS");
                let role = message.guild.roles.cache.get(message.guild.settings.dj_system)
                if (!role) return message.errorMessage(Missingperm.replace("{perm}", 'MANAGE_MESSAGES'))
                if (message.member.roles.cache) {
                    if (!message.member.roles.cache.has(role.id)) {
                        return message.errorMessage(MissingRole.replace("{perm}", 'MANAGE_MESSAGES').replace("{role}", role))
                    }
                } else {
                    return message.errorMessage(MissingRole.replace("{perm}", 'MANAGE_MESSAGES').replace("{role}", role))
                }
            }
        }
        let name = args.join(" ")
        const voice = message.member.voice.channel;
        if (!voice) {
            let err = await message.translate("NOT_VOC")
            return message.errorMessage(err)
        }
        if (message.guild.me.voice.channel && message.member.voice.channel.id !== message.guild.me.voice.channel.id) {
            let err = await message.translate("NOT_SAME_CHANNEL")
            return message.errorMessage(err);
        }
        let ok = await message.translate("CHEARCHING")
        message.channel.send(ok)
        const { player } = message.client
        let queue;
        if (!message.client.player.getQueue(message.guild.id)) {
            queue = player.createQueue(message.guild, {
                metadata: message
            });
        } else {
            queue = message.client.player.getQueue(message.guild.id)
        }
        const searchResult = await player
            .search(name, {
                requestedBy: message.author,
                searchEngine: QueryType.AUTO
            })
            .catch(() => {});
        if (!searchResult || !searchResult.tracks.length) {
            let errorM = await message.translate("NO_RESULTS")
            return message.errorMessage(errorM.replace("{query}", name));
        }
        try {
            if (!queue.connection) await queue.connect(message.member.voice.channel);
        } catch {
            player.deleteQueue(message.guild.id)
            return message.errorMessage(`I am not able to join your voice channel, please check my permissions !`);
        }
        searchResult.playlist ? queue.addTracks(searchResult.tracks) : queue.addTrack(searchResult.tracks[0]);
        if (!queue.playing) await queue.play();
    },
};