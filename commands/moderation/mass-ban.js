const Discord = require('discord.js');
const Case = require('../../database/models/case');
const Welcome = require('../../database/models/Welcome')

module.exports = {
    name: 'massban',
    description: 'Banni plusieurs personnes du serveur',
    guildOnly: true,
    args: true,
    usage: '@users',
    exemple: '@pauldb09 @squarfiuz',
    cat: 'moderation',
    permissions: ['BAN_MEMBERS'],
    botpermissions: ["BAN_MEMBERS"],
    async execute(message, args, client) {
        let tran = await message.translate("MASSBAN");
        const users = message.mentions.users
        if (!users || users.size == 0 || users.length == 0) {
            let err = await message.translate("ERROR_USER")
            return message.errorMessage(err)
        }
        users.forEach(async user => {
            const member = await message.guild.members.fetch(user.id).catch(() => {});
            if (member) {
                message.guild.members.ban(member.id, { reason: `Massban command ( ${tran.by} ${message.author.tag})` })

                await member.send({
                    embeds: [new Discord.MessageEmbed().setDescription(tran.dm.replace("{message.guild.name}", message.guild.name).replace("{member.user.tag}", member.user.tag)).setColor(message.guild.settings.color)]
                }).catch(() => {});
            }
        });



        // Ban the user
        var chars = "ABCDEFGHIJKLMNOPQRSTUVWXTZabcdefghiklmnopqrstuvwxyz";
        var string_length = 10;
        var randomstring = '';

        for (var x = 0; x < string_length; x++) {

            var letterOrNumber = Math.floor(Math.random() * 2);
            if (letterOrNumber == 0) {
                var newNum = Math.floor(Math.random() * 9);
                randomstring += newNum;
            } else {
                var rnum = Math.floor(Math.random() * chars.length);
                randomstring += chars.substring(rnum, rnum + 1);
            }

        }
        const uniqID = randomstring;
        // Send a success message in the current channel
        message.channel.send({
            embeds: [new Discord.MessageEmbed().setAuthor(tran.name, message.member.user.displayAvatarURL()).setDescription(`\`📚\` **${message.author.tag}** ${tran.desc} \n __\`📃\` ${tran.raison}__ : ${users.size}.`).setColor(message.guild.settings.color).setFooter(`Case id: ${uniqID} | ${message.guild.settings.prefix}case ${uniqID}`, message.client.user.displayAvatarURL())]
        })

        const verynew = new Case({
            serverID: message.guild.id,
            id: uniqID,
            targetID: message.member.id,
            sanction: "Massban",
            reason: "Massban command",
            mod: message.member.id,
        }).save()
        const logs = await Welcome.findOne({ serverID: message.guild.id, reason: `mod-logs` })
        if (logs) {
            if (message.guild.channels.cache.get(logs.channelID)) {
                const translations = await message.translate("LOGS_MOD")
                const embed = new Discord.MessageEmbed()
                    .setColor(message.guild.settings.color)
                    .setAuthor(`${message.member.user.username}`, message.member.user.displayAvatarURL({ dynamic: true, size: 512 }))
                    .setTitle(translations.title.replace("{id}", uniqID))
                    .setDescription(translations.desc.replace("{user}", message.member.user.tag).replace("{member}", `${users.size} users`))
                    .addField("<:membres:830432144211705916> " + translations.mod + "", `\`${message.member.user.tag}\` \n(<@!${message.member.id}>)`, true)
                    .addField("<:663041911753277442:830432143800532993> Type", "Massban", true)
                    .addField("<:green_members:811167997023485973> " + translations.target + "s", `**${users.size}** users`, true)
                    .addField("<:711541810098470913:830460210220630027> Case ID", `${uniqID}`, true)
                    .addField("<:612058498108227586:830440548007018517> " + translations.reason + "", `Massban command`, true)

                .setThumbnail(url = message.client.user.displayAvatarURL({ dynamic: true, size: 512 }))
                    .setFooter(message.client.footer, message.client.user.displayAvatarURL({ dynamic: true, size: 512 }))
                message.guild.channels.cache.get(logs.channelID).send({ embeds: [embed] })
            }
        }
    },
};