const Welcome = require('../../database/models/Welcome');
const Discord = require('discord.js');
module.exports = {
    async execute(role, client) {
        let welcomedb = await Welcome.findOne({ serverID: role.guild.id, reason: 'logs' })
        if (welcomedb) {
            let logchannel = role.guild.channels.cache.get(welcomedb.channelID);
            if (!logchannel) return;
            const lang = await role.guild.translate("ROLE_DELETE")
            const embed = new Discord.MessageEmbed()
                .setColor('#70D11A')
                .setTitle(lang.title)
                .setDescription(lang.desc.replace("{role}", role).replace("{name}", role.name))
                .setFooter('ID: ' + role.id)
                .setTimestamp();
            logchannel.send({ embeds: [embed] });
        }
    }
};