const Discord = require('discord.js');
const Welcome = require('../../database/models/Welcome');
const guildData = require('../../database/models/guildData');
module.exports = {
        name: 'dj-system',
        description: 'Active ou désactive le mode dj sur le serveur',
        cat: 'music',
        aliases: ["djsystem"],
        permissions: ['MANAGE_GUILD'],
        async execute(message, args) {
            const ID = message.member.id;
            let tip = await message.translate("DASHBOARD")
            let second = await message.translate("ARGS_TIP")
            let cfg = await message.translate("ACTUAL_CONFIG")
            let embed = new Discord.MessageEmbed()
                .setAuthor(`${message.author.username}`, message.author.displayAvatarURL({ dynamic: true, size: 512 }))
                .setColor("#F0B02F")
                .setTitle(`DJ System`)
                .setDescription(tip)
                .addField(cfg.title, `${cfg.enabled}${message.guild.settings.dj_role ? "<:IconSwitchIconOn:825378657287274529>": "<:icon_SwitchIconOff:825378603252056116>"}\n Role : ${message.guild.settings.dj_role ? `<@&${message.guild.settings.dj_role}>` : cfg.no}`)
                .addField(`${message.guild.settings.lang === "fr" ? "`📜` Utilisation":"`📜` Use"}`, second)
                .setThumbnail(url = message.client.user.displayAvatarURL({ dynamic: true, size: 512 }))
                .setFooter(message.client.footer, message.client.user.displayAvatarURL({ dynamic: true, size: 512 }))
            message.reply({ embeds: [embed], allowedMentions: { repliedUser: false } }).then((m) => {
            m.react("📜")
            const filter = (reaction, user) => reaction.emoji.name === "📜" && user.id === message.author.id;
            const collector = m.createReactionCollector({ filter, time: 11000000,max:1 });
            collector.on('collect', async r =>{
                const response = await getResponses(message)
                 if (!response || response.cancelled) return message.client.log ? console.log(`Command ${message.content} | Cancelled`) : null
                 message.guild.settings.dj_role = response.roleID
                 const newchannel = await guildData.findOneAndUpdate({ serverID: message.guild.id }, { $set: { dj_role: response.roleID } }, { new: true });
                 let a= await message.translate("DJ_MODEOK")
                 message.succesMessage(a);
            });
            collector.on('end', collected => m.reactions.removeAll());
        });
        async function getResponses(message) {
            const validTime = /^\d+(s|m|h|d)$/;
            const validNumber = /^\d+/;
            const responses = {}
            const p  =await  message.translate("DJ_MODE")
            let can = await message.translate("CAN_CANCEL")
                for (let i = 0; i < p.length; i++) {
                    await message.mainMessageT(`${p[i]}\n\n${can}`);
            const filter = m => m.author.id === ID;
            const response =  await message.channel.awaitMessages({ filter, max: 1,})
                const { content } = response.first();
                const m = response.first();
                if (content.toLowerCase() === "cancel") {
                    let okk = await message.translate("CANCELED")
                    responses.cancelled = true;
                    message.channel.send(`**${okk}**`)
                    return responses;
                    break;
                }
                if (i === 0) {
                    let ll = await message.translate("ENA/DISA")
                    if (content.toLowerCase() === 'enable') {
                        responses.status = true;
                    } else if (content.toLowerCase() === 'disable') {
                        responses.status = null;
                        if (message.guild.settings.dj_role) {
                            const newchannel = await guildData.findOneAndUpdate({ serverID: message.guild.id }, { $set: { dj_role: null } }, { new: true });
                            return m.succesMessage(ll.succes);
                        }
                        return m.succesMessage(ll.disable);
                    } else {
                        return m.errorMessage(ll.err)         
                    }
                }
                if (i === 1) {
                    let role = m.mentions.roles.first() || message.guild.roles.cache.get(content)
                    if (!role) {
                        let err = await message.translate("ERROR_ROLE")
                        return m.errorMessage(err);
                    }
                    responses.roleID = role.id
                }
            }
            return responses;
        }
    },
};