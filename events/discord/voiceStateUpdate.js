const Welcome = require('../../database/models/Welcome');
const Discord = require('discord.js');
const { Player, QueryType, QueueRepeatMode } = require("discord-player");
const Temps = require('../../database/models/Temps');

module.exports = {
    async execute(oldState, newState, client) {
        oldMember = oldState.member;
        newMember = newState.member;
        await newState.guild.members.fetch()
        const member = newState.guild.members.cache.get(newState.id)
        if (!oldState.channel && newState.channel) {
            const channel = newState.guild.channels.cache.get(newState.channelId);
            let welcomedb = await Welcome.findOne({ serverID: newState.guild.id, reason: 'logs' })
            if (welcomedb) {
                let logchannel = newMember.guild.channels.cache.get(welcomedb.channelID);
                if (!logchannel) return;
                const lang = await newState.guild.translate("VOICE")
                const embed = new Discord.MessageEmbed()
                    .setColor('#70D11A')
                    .setTitle(lang.title)
                    .setDescription(lang.desc.replace("{member}", member).replace("{name}", channel.name).replace("{channel}", channel))
                    .setFooter('ID: ' + newMember.id)
                    .setTimestamp();
                logchannel.send({ embeds: [embed] });
            }
            const tempo = await Temps.findOne({ serverID: newState.guild.id })
            if (tempo && tempo.channelID === channel.id) {
                const check = newState.guild.channels.cache.find(c => c.name === `${member.user.username}'s channel`)
                if (check) return
                let o = newState.guild.channels.cache.get(tempo.categoryID),
                    c = ["CONNECT", "SPEAK", "VIEW_CHANNEL", "REQUEST_TO_SPEAK", "DEAFEN_MEMBERS", "MUTE_MEMBERS", "USE_VAD", "MANAGE_CHANNELS"];
                newState.guild.channels.create(`${member.user.username}'s channel`, {
                    type: "GUILD_VOICE",
                    permissionOverwrites: [
                        { allow: "VIEW_CHANNEL", id: newState.guild.id },
                        { allow: c, id: member.id },
                    ],
                    userLimit: tempo.size,
                    parent: o.id,
                    reason: "Temps voice channels",
                }).then(c => {
                    member.voice.setChannel(c)
                })

            }
            const settings = await newState.guild.fetchDB()
            if (settings && settings.autoplay === channel.id) {
                console.log("Auto Music")
                let queue;
                if (!client.player.getQueue(newState.guild.id)) {
                    queue = client.player.createQueue(newState.guild, {
                        metadata: null
                    });
                } else {
                    queue = client.player.getQueue(newState.guild.id)
                }
                if (queue.playing) return
                try {
                    if (!queue.connection) await queue.connect(channel);
                } catch {
                    player.deleteQueue(newState.guild.id)
                }
                const searchResult = await client.player
                    .search(settings.song, {
                        requestedBy: member,
                        searchEngine: QueryType.AUTO
                    })
                    .catch(() => {});
                searchResult.playlist ? queue.addTracks(searchResult.tracks) : queue.addTrack(searchResult.tracks[0]);
                if (!queue.playing) await queue.play();
            }
        }
        if (oldState.channel && !newState.channel) {
            let welcomedb = await Welcome.findOne({ serverID: newState.guild.id, reason: 'logs' })
            if (welcomedb) {
                let logchannel = newState.guild.channels.cache.get(welcomedb.channelID);
                if (!logchannel) return;
                const channel = newState.guild.channels.cache.get(oldState.channelId);
                const lang = await newState.guild.translate("VOICE_LEAVE")
                const embed = new Discord.MessageEmbed()
                    .setColor('#70D11A')
                    .setTitle(lang.title)
                    .setDescription(lang.desc.replace("{member}", newMember).replace("{name}", channel.name).replace("{channel}", channel))
                    .setFooter('ID: ' + newMember.id)
                    .setTimestamp();
                logchannel.send({ embeds: [embed] });
            }
            const check = newState.guild.channels.cache.find(c => c.name === `${member.user.username}'s channel`)
            if (check) check.delete()
        }

    }
};