const Welcome = require('../../database/models/Welcome');
const Discord = require('discord.js');
module.exports = {
    async execute(channel, client) {
        if (channel.type == "dm") return;
        let welcomedb = await Welcome.findOne({ serverID: channel.guild.id, reason: 'logs' })
        if (welcomedb) {
            let logchannel = channel.guild.channels.cache.get(welcomedb.channelID);
            if (!logchannel) return;
            const lang = await channel.guild.translate("CHANNEL_DELETED")
            let cType = channel.type;
            switch (cType) {
                case "GUILD_TEXT":
                    cType = lang.text;
                    break;
                case "GUILD_VOICE":
                    cType = lang.voice;
                    break;
                case "GUILD_CATEGORY":
                    cType = lang.category;
                    break;
                case "GUILD_NEWS":
                    cType = lang.news;
                    break;
            }
            const embed = new Discord.MessageEmbed()
                .setColor('#70D11A')
                .setTitle(lang.title)
                .setDescription(lang.desc.replace("{channel}", channel.name).replace("{type}", cType))
                .setFooter('ID: ' + channel.id)
                .setTimestamp();
            logchannel.send({ embeds: [embed] });
        }
    }
};