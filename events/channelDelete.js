const config = require('../config.json');
const Welcome = require('../database/models/Welcome');
const emoji = require('../emojis.json');

const Discord = require('discord.js');
const Canvas = require('canvas');
module.exports = {


    async execute(channel, client) {
        if (channel.type == "dm") return;


        let welcomedb = await Welcome.findOne({ serverID: channel.guild.id, reason: 'logs' })
        if (welcomedb) {
            let logchannel = channel.guild.channels.cache.get(welcomedb.channelID);
            if (!logchannel) return;

            if (!channel.guild.me.permissions.has("VIEW_AUDIT_LOG")) return;
            let cType = channel.type;
            switch (cType) {
                case "text":
                    cType = "Textuel";
                    break;
                case "voice":
                    cType = "Vocal";
                    break;
                case "category":
                    cType = "Catégorie";
                    break;
                case "news":
                    cType = "Annonce";
                    break;
                case "store":
                    cType = "Magasin";
                    break;
                case "stage":
                    cType = "Stage";
                    break;
            }

            const fetchGuildAuditLogs = await channel.guild.fetchAuditLogs({
                limit: 1,
                type: 'CHANNEL_DELETE'
            })

            const latestChannelCreated = fetchGuildAuditLogs.entries.first();
            const { executor } = latestChannelCreated;

            const embed = new Discord.MessageEmbed()
                .setColor('#DF8212')
                .setTitle('`🗑` Salon supprimé')

            .setAuthor(`${executor.tag}`, executor.displayAvatarURL({ dynamic: true }))
                .addField('Nom', `\`${channel.name}\``, true)
                .addField('Description', `\`${channel.topic || 'Aucune description'}\``, true)

            .addField('Type', `\`${cType}\``, true)
                .addField('Exécuteur', `\`${executor.username}\``, true)

            .setFooter('ID: ' + channel.id)
                .setTimestamp();
            logchannel.send(embed);
        }






    }
};