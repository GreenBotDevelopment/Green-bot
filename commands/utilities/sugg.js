const Discord = require('discord.js');
const sugg = require('../../database/models/sugg');
const Welcome = require('../../database/models/Welcome');
module.exports = {
    name: 'suggest',
    description: 'Makes a suggestion if the system is enabled on the server',
    aliases: ["suggestion", "sugg"],
    usage: '<suggestion>',
    exemple: 'A wonderfull channel for chatbot',
    cat: 'utilities',
    cooldown: 20,
    args: true,
    async execute(message, args, client, guildDB) {
        let reason = args.join(" ");
        const lang = await message.translate("SUGGEST", guildDB.lang)
        if (!guildDB.suggestions) return message.errorMessage(lang.notEnabled)
        else {
            if (reason.length > 2000 || reason.length < 4) {
                let numberErr = await message.translate("MESSAGE_ERROR", guildDB.lang)
                return message.errorMessage(numberErr.replace("{amount}", "4").replace("{range}", "2000"))
            }
            const paul = new Discord.MessageEmbed()
                .setAuthor(`${lang.title}`, message.author.displayAvatarURL({ dynamic: true, size: 512 }))
                .addField(lang.field1Desc1, lang.field1Desc2, true)
                .addField(lang.field2, `<@${message.author.id}>`, true)
                .setDescription(reason)
                .setFooter(`Green-bot - www.green-bot.app`, message.client.user.displayAvatarURL({ dynamic: true, size: 512 }))
                .setColor("#F0F010")
                .setTimestamp();
            let suggc = message.guild.channels.cache.get(guildDB.suggestions)
            if (!suggc) return message.errorMessage(lang.err.replace('{channel}', `<#${guildDB.suggestions}>`))
            suggc.send({ embeds: [paul] }).then(async function(m) {
                    m.react('✅');
                    m.react('❌');
                    message.succesMessage(lang.succes.replace('{channel}', `<#${guildDB.suggestions}>`));
                    let welcomedb = await Welcome.findOne({ serverID: message.guild.id, reason: 'sugg_log' })
                    if (welcomedb) {
                        let logchannel = message.guild.channels.cache.get(welcomedb.channelID);
                        if (!logchannel) return;
                        const embed = new Discord.MessageEmbed()
                            .setColor(guildDB.color)
                            .setTitle(lang.Logstitle1)
                            .setAuthor(`${message.author.username}`, message.author.displayAvatarURL({ dynamic: true, size: 512 }))
                            .setDescription(lang.Logsdesc1.replace("{member}", message.author).replace("{reason}", reason))
                            .setFooter('Suggestion ID: ' + message.id)
                            .setTimestamp();
                        logchannel.send({ embeds: [embed] });
                    }
                    const verynew = new sugg({
                        autorID: message.author.id,
                        messageID: m.id,
                        serverID: m.guild.id,
                        content: reason,
                        Date: new Date,
                    }).save()

                })
                .catch(err => {
                    console.log(err)
                    return message.errorMessage(lang.err.replace('{channel}', `<#${guildDB.suggestions}>`))
                })
        }
    },
};