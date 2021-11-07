const { QueryType } = require("discord-player");
const { QueueRepeatMode } = require("discord-player");
module.exports = {
    name: 'playskip',
    description: 'Plays the searched song and skips the current playings',
    cat: 'music',
    args: true,
    aliases: ['pskip', ],
    usage: '<music name>',
    usages: ["playskip <music>", "playskip <url>"],
    exemple: 'Never gonna give you up',
    botpermissions: ['CONNECT', 'SPEAK'],
    async execute(message, args, client, guildDB) {
        let name = args.join(" ")
        const voice = message.member.voice.channel;
        if (!voice) {
            let err = await message.translate("NOT_VOC", guildDB.lang)
            return message.errorMessage(err)
        }
        const queue = message.client.player.getQueue(message.guild.id)
        if (!queue || !queue.playing || !queue.current) {
            let err = await message.translate("NOT_MUSIC", guildDB.lang)
            return message.errorMessage(err)
        }
        if (queue.metadata.controller) return message.errorMessage(`Use the music controller to play music. `)
        if (voice && guildDB.vc && guildDB.vc !== message.member.voice.channel.id && message.guild.channels.cache.get(guildDB.vc)) {
            let err = await message.translate("NOT_GOOD_VOC", guildDB.lang)
            return message.errorMessage(err.replace("{channel}", message.guild.channels.cache.get(guildDB.vc)))
        }
        if (queue.tracks.length == 0 && queue.repeatMode !== QueueRepeatMode.AUTOPLAY) return message.errorMessage("Nothing next in the queue. Use `" + guildDB.prefix + "queue` to see the server's queue.\nWant to try autoplay? `" + guildDB.prefix + "autoplay`")

        if (message.guild.me.voice.channel && message.member.voice.channel.id !== message.guild.me.voice.channel.id) {
            let err = await message.translate("NOT_SAME_CHANNEL", guildDB.lang)
            return message.errorMessage(err);
        }
        if (name.includes("green-bot.app")) {
            let errorM = await message.translate("NO_RESULTS", guildDB.lang)
            return message.errorMessage(errorM.replace("{query}", name));
        }
        if (name.includes("https://open.spotify.com/episode")) {
            return message.errorMessage(`Sorry but we don't support spotify episodes. You can try with a spotify playlist.`);
        }
        if (name.includes("soundcloud") && name.includes("?si")) {
            name = name.split('?')[0]
        }
        let ok = await message.translate("CHEARCHING", guildDB.lang)
        message.channel.send(ok.replace("{title}", name.slice(0.200)))
        if (queue.metadata.channel.id !== message.channel.id) queue.metadata.channel = message.channel
        if (name === "music") name = "2021 New Songs ( Latest English Songs 2021 ) 🥬 Pop Music 2021 New Song 🥬 English Song 2021"
        if (name === "lofi") name = "1 A.M Study Session 📚 - [lofi hip hop/chill beats]"
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
        searchResult.playlist ? queue.addTracks(searchResult.tracks) : queue.addTrack(searchResult.tracks[0]);
        if (queue.playing) await queue.skip();
    },
};