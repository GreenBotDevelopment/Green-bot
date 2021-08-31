const Discord = require('discord.js');
const ms = require('ms');
const Temps = require('../../database/models/Temps');
module.exports = {
        name: 'tempvoc',
        description: 'Configures the temporary voc channels.',
        aliases: ['temps-channel', 'tmps-channels'],
        guildOnly: true,
        cat: 'configuration',
        permissions: ['MANAGE_GUILD'],
        botpermissions: ["SEND_MESSAGES", "EMBED_LINKS", ],
        async execute(message, args, client, guildDB) {
            const prompts = await message.translate("TEMPS_PROMPTS")
            const ID = message.member.id;
            const welcomeDB = await Temps.findOne({ serverID: message.guild.id })
            let second = await message.translate("ARGS_TIP")
            let tip = await message.translate("DASHBOARD")
            let cfg = await message.translate("ACTUAL_CONFIG")
            let embed = new Discord.MessageEmbed()
                .setAuthor(`${message.author.username}`, message.author.displayAvatarURL({ dynamic: true, size: 512 }))
                .setColor("#F0B02F")
                .setTitle(`${message.guild.settings.lang === "fr" ? "Salons vocaux temporaires":"Temps voc channels"}`)
                .setDescription(tip)
                .addField(cfg.title, `${cfg.enabled}${welcomeDB ? "<:IconSwitchIconOn:825378657287274529>": "<:icon_SwitchIconOff:825378603252056116>"}\n \n${cfg.channel}  ${ welcomeDB ? welcomeDB.channelID ? `<#${welcomeDB.channelID}>` : cfg.no : cfg.no }\n${message.guild.settings.lang === "fr" ? "Taille":"Size"} : ${ welcomeDB ? welcomeDB.size : cfg.no }`)
                .addField(`${message.guild.settings.lang === "fr" ? "`📜` Utilisation":"`📜` Use"}`, second)
                .setThumbnail(url = message.client.user.displayAvatarURL({ dynamic: true, size: 512 }))
                .setFooter(message.client.footer, message.client.user.displayAvatarURL({ dynamic: true, size: 512 }))
    message.reply({ embeds: [embed], allowedMentions: { repliedUser: false } }).then((m) => {
        m.react("📜")
        const filter = (reaction, user) => reaction.emoji.name === "📜" && user.id === message.author.id;
        const collector = m.createReactionCollector({ filter, time: 1000000,max:1 });
        collector.on('collect', async r =>{
            const response = await getResponses(message)
            if (!response || response.cancelled) return message.client.log ? console.log(`Command ${message.content} | Cancelled`) : null
            const a = await message.translate("CONFIG_OK")
            let b = message.guild.settings.lang === "fr" ? "Salons vocaux temporaires":"Temps voc channels"
            message.succesMessage(a.replace("{x}", b));
let check = await Temps.findOne({serverID:message.guild.id})
if(check){
const newchannel = await Temps.findOneAndUpdate({ serverID: message.guild.id}, { $set: { channelID: response.channel.id,categoryID: response.category.id,size: response.max} }, { new: true });
}else{
let addTemps = new Temps({
    serverID: message.guild.id,
    channelID: response.channel.id,
    categoryID: response.category.id,
    size: response.max,
}).save()
}
        });
        collector.on('end', collected => m.reactions.removeAll());
    });
        async function getResponses(message) {
            const validTime = /^\d+(s|m|h|d)$/;
            const validNumber = /^\d+/;
            const responses = {}
                   let can = await message.translate("CAN_CANCEL")
            for (let i = 0; i < prompts.length; i++) {
                await message.mainMessageT(`${prompts[i]}\n\n${can}`);
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
                    let channel = m.mentions.channels.first() || message.guild.channels.cache.get(content) || message.guild.channels.cache.filter(m => m.type === "GUILD_VOICE" && m.name.includes(args.join(" "))).first();
                    if (channel && channel.type === 'GUILD_VOICE' && channel.viewable) {
                        responses.channel = channel;
                    } else {
                        let errorChannel = await message.translate("ERROR_CHANNEL_VOICE")
                        return m.errorMessage(errorChannel)
                        break;
                    }
                }
                if (i === 1) {
                    let channel = m.mentions.channels.first() || message.guild.channels.cache.get(content) || message.guild.channels.cache.filter(m => m.type === 'GUILD_CATEGORY' && m.name.toLowerCase().includes(content.toLowerCase())).first();
                    if (channel && channel.type=== "GUILD_CATEGORY" && channel.viewable) {
                        responses.category = channel;
                    } else {
                        let errorChannel = await message.translate("ERROR_CHANNEL_CATEGORY")
                        return m.errorMessage(errorChannel)
                        break;
                    }
                }
                if (i === 2) {
                    if (isNaN(content) || content > 10 || content < 1) {
                        let numberErr = await message.translate("NUMBER_ERROR")
                        return m.errorMessage(numberErr.replace("{amount}", "1").replace("{range}", "10"))            
                    } else {
                        responses.max = content;
                    }
                }
            }
            return responses;
        }
    },
};