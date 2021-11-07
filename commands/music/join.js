const playdl = require("play-dl")
module.exports = {
    name: 'join',
    description: 'Makes the bot joining your voice channel.',
    cat: 'music',
    botpermissions: ['CONNECT', 'SPEAK'],
    async execute(message, args, client, guildDB) {
        const voice = message.member.voice.channel;
        if (!voice) {
            let err = await message.translate("NOT_VOC", guildDB.lang)
            return message.errorMessage(err)
        }
        if (voice && guildDB.vc && guildDB.vc !== message.member.voice.channel.id && message.guild.channels.cache.get(guildDB.vc)) {
            let err = await message.translate("NOT_GOOD_VOC", guildDB.lang)
            return message.errorMessage(err.replace("{channel}", message.guild.channels.cache.get(guildDB.vc)))
        }
        if (message.guild.me.voice.channel && message.member.voice.channel.id === message.guild.me.voice.channel.id) {
            const moved = await message.translate("MOVED", guildDB.lang)
            return message.errorMessage(moved.already);
        }
        if (message.guild.me.voice.channel && message.member.voice.channel.id !== message.guild.me.voice.channel.id) {
            let err = await message.translate("NOT_SAME_CHANNEL", guildDB.lang)
            return message.errorMessage(err);
        }
        const { player } = message.client
        let queue;
        if (!message.client.player.getQueue(message.guild.id)) {
            queue = player.createQueue(message.guild, {
                metadata: { channel: message.channel, m: message, guildDB: guildDB, dj: message.author },
                initialVolume: guildDB.defaultVolume,
                leaveOnEmptyCooldown: guildDB.h24 === "true" ? null : 3000,
                leaveOnEmpty: guildDB.h24 === "true" ? false : true,
                leaveOnEnd: guildDB.h24 === "true" ? false : true,
                leaveOnStop: guildDB.h24 === "true" ? false : true,
                ytdlOptions: {
                    quality: 'highest',
                    filter: 'audioonly',
                    highWaterMark: 1 << 25,
                    dlChunkSize: 0
                },
                fetchBeforeQueued: true,
                async onBeforeCreateStream(track, source, _queue) {
                    if (track.url.includes('youtube') || track.url.includes("youtu.be")) {
                        try {
                            return (await playdl.stream(track.url)).stream;
                        } catch (err) {
                            return _queue.metadata.m.errorMessage("This video is restricted. Try with another link.")
                        }
                    } else if (track.url.includes('spotify')) {
                        try {
                            let songs = await client.player.search(`${track.author} ${track.title} `, {
                                requestedBy: message.member,
                            }).catch().then(x => x.tracks[0]);
                            return (await playdl.stream(songs.url)).stream;
                        } catch (err) {
                            console.log(err)
                        }
                    } else if (track.url.includes('soundcloud')) {
                        try {
                            return (await playdl.stream(track.url)).stream;
                        } catch (err) {
                            console.log(err)
                        }
                    }
                }
            });
        } else {
            queue = message.client.player.getQueue(message.guild.id)
        }
        try {
            if (!queue.connection) await queue.connect(message.member.voice.channel);
        } catch (err) {
            console.log(err)
            return message.errorMessage(`I am not able to join your voice channel, please check my permissions !\n`);
        }
        if (!message.guild.me.voice.channel) await queue.connect(message.member.voice.channel);
    },
};