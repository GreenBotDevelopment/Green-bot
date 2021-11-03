const { QueryType } = require("discord-player");
const playdl = require("play-dl")
module.exports = {
    name: 'play',
    description: 'Plays a music in your voice channel.',
    cat: 'music',
    args: true,
    cooldown: 2000,
    aliases: ['p', 'youtube'],
    usage: '<music name>',
    usages: ["play <music>", "play <url>"],
    exemple: 'Never gonna give you up',
    botpermissions: ['CONNECT', 'SPEAK'],
    async execute(message, args, client, guildDB) {
        let name = args.join(" ")
        const voice = message.member.voice.channel;
        if (!voice) {
            let err = await message.translate("NOT_VOC", guildDB.lang)
            return message.errorMessage(err)
        }
        if (voice && guildDB.vc && guildDB.vc !== message.member.voice.channel.id && message.guild.channels.cache.get(guildDB.vc)) {
            let err = await message.translate("NOT_GOOD_VOC", guildDB.lang)
            return message.errorMessage(err.replace("{channel}", message.guild.channels.cache.get(guildDB.vc)))
        }
        if (message.guild.me.voice.channel && message.member.voice.channel.id !== message.guild.me.voice.channel.id) {
            let err = await message.translate("NOT_SAME_CHANNEL", guildDB.lang)
            return message.errorMessage(err);
        }
        if (name.startsWith("<")) return message.errorMessage("Hooks such as `[]` or `<>` must not be used when executing commands. Ex: `" + guildDB.prefix + "play Faded`")
        if (name.includes("green-bot.app")) {
            let errorM = await message.translate("NO_RESULTS", guildDB.lang)
            return message.errorMessage(errorM.replace("{query}", name));
        }
        if (name.includes("https://open.spotify.com/episode")) return message.errorMessage(`Sorry but i don't support spotify episodes. You can try with a spotify playlist`);
        if (name.includes("soundcloud") && name.includes("?si")) name = name.split('?')[0]
        if (name.includes("soundcloud") && name.includes("?in_system_playlist")) name = name.split('?in_system_playlist')[0]
        let queue;
        if (!message.client.player.getQueue(message.guild.id)) {
            queue = client.player.createQueue(message.guild, {
                metadata: { channel: message.channel, m: message, guildDB: guildDB, dj: message.author, },
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
                            _queue.metadata.m.errorMessage("This video is restricted. Try with another link.")
                            return
                        }
                    } else if (track.url.includes('spotify')) {
                        try {
                            let songs = await client.player.search(`${track.author} ${track.title} `, {
                                    requestedBy: message.member,
                                }).catch()
                                .then(x => x.tracks[0]);
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
        } else queue = message.client.player.getQueue(message.guild.id)
        if (queue.metadata.controller) return message.errorMessage(`Use the music controller to play music. `)
        let ok = await message.translate("CHEARCHING", guildDB.lang)
        message.channel.send(ok.replace("{title}", name.slice(0.200))).then(m => setTimeout(() => m.delete(), 4000))
        if (name === "music") name = "Random music"
        if (queue.metadata.channel.id !== message.channel.id) queue.metadata.channel = message.channel
        const searchResult = await client.player
            .search(name, {
                requestedBy: message.author,
                searchEngine: QueryType.AUTO
            })
            .catch(async(e) => {});
        if (!searchResult || !searchResult.tracks.length) {
            let errorM = await message.translate("NO_RESULTS", guildDB.lang)
            return message.errorMessage(errorM.replace("{query}", name.slice(0.200)));
        }
        try {
            if (!queue.connection) await queue.connect(message.member.voice.channel);
        } catch (err) {
            console.log("ErrConnection")
            console.log(err)
            if (err.toString().includes('Error: Did not enter state ready within 20000ms')) return
            client.player.deleteQueue(message.guild.id)
            return message.errorMessage(`I am not able to join your voice channel, please check my permissions !`);
        }
        if (!message.guild.me.voice.channel) await queue.connect(message.member.voice.channel);
        searchResult.playlist ? queue.addTracks(searchResult.tracks) : queue.addTrack(searchResult.tracks[0]);
        if (!queue.playing) await queue.play();

    },
};
