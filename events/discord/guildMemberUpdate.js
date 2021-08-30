const config = require('../../config.js');
const Welcome = require('../../database/models/Welcome');
const Discord = require('discord.js');
const Canvas = require('canvas');
module.exports = {
    async execute(oldMember, newMember, client) {
        if (oldMember.nickname != newMember.nickname) {
            let welcomedb = await Welcome.findOne({ serverID: newMember.guild.id, reason: 'logs' })
            if (welcomedb) {
                let logchannel = newMember.guild.channels.cache.get(welcomedb.channelID);
                if (!logchannel) return;
                const lang = await newMember.guild.translate("NICKNAME")
                const embed = new Discord.MessageEmbed()
                    .setColor('#70D11A')
                    .setTitle(lang.title)
                    .setAuthor(newMember.user.tag, newMember.user.displayAvatarURL())
                    .addField(lang.nick, `${oldMember.nickname ? oldMember.nickname : '*None*'} ➟  ${newMember.nickname ? newMember.nickname : '*None*'}`)
                    .setDescription(lang.desc.replace("{user}", newMember))
                    .setFooter(client.footer, client.user.displayAvatarURL({ dynamic: true, size: 512 }))
                    .setTimestamp();
                logchannel.send({ embeds: [embed] });
            }
        }
        if (!oldMember.premiumSince && newMember.premiumSince) {
            const a = await Welcome.findOne({ serverID: newMember.guild.id, reason: "boost" });
            if (a && a.status) {
                let s = newMember.guild.channels.cache.get(a.channelID),
                    o = newMember.guild.roles.cache.get(a.image);
                newMember.roles.add(o);
                let c = `${a.message}`.replace(/{user}/g, newMember).replace(/{server}/g, newMember.guild.name).replace(/{username}/g, newMember.user.username).replace(/{tag}/g, newMember.user.tag).replace(/{membercount}/g, newMember.guild.memberCount);
                s.send({ embeds: [(new Discord.MessageEmbed).setColor(config.color).setTitle("<:nitro_gris_activ:830451169486700585> Boost").setDescription(c)] })
            }
        }


    }
};