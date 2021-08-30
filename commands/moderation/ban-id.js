const Discord = require('discord.js');
const Case = require('../../database/models/case');
const Welcome = require('../../database/models/Welcome')
module.exports = {
    name: 'ban-id',
    description: 'Bans a user that is not on the server',
    guildOnly: true,
    args: true,
    usage: '<id> [reason]',
    exemple: '757309249440186460 spam',
    cat: 'moderation',
    permissions: ['BAN_MEMBERS'],
    botpermissions: ["BAN_MEMBERS"],
    async execute(message, args, client) {
        const modErr = await message.translate("MODERATION")

        let tran = await message.translate("BANID");
        const target = args[0];
        if (isNaN(target)) {
            let err = await message.translate("ERROR_USER")
            return message.errorMessage(err)
        }
        const bannedMemberInfo = await message.guild.bans.fetch({ cache: false })

        if (bannedMemberInfo.get(target)) {

            return message.errorMessage(tran.deja)
        }
        let reason = args.slice(1).join(" ");
        if (!reason) {
            reason = modErr.raison;
        }
        try {
            message.guild.members.ban(target, { reason: `${reason} ( ${tran.by} ${message.author.tag})` });
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
            message.reply({
                embeds: [new Discord.MessageEmbed().setAuthor(tran.name, message.member.user.displayAvatarURL()).setDescription(`\`📚\`<@!${target}> ${tran.desc} **${message.member.user.tag}** \n\n __\`📃\` ${tran.raison}__ : ${reason}.`).setColor(message.guild.settings.color).setFooter(`Case id: ${uniqID} | ${message.guild.settings.prefix}case ${uniqID}`, message.client.user.displayAvatarURL())]
            })

            const verynew = new Case({
                serverID: message.guild.id,
                id: uniqID,
                targetID: target,
                sanction: "Ban-ID",
                reason: reason,
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
                        .setDescription(translations.desc.replace("{user}", message.member.user.tag).replace("{member}", `<@!${target}>`))
                        .addField("<:membres:830432144211705916> " + translations.mod + "", `\`${message.member.user.tag}\` \n(<@!${message.member.id}>)`, true)
                        .addField("<:663041911753277442:830432143800532993> Type", "Ban-ID", true)
                        .addField("<:green_members:811167997023485973> " + translations.target + "", `\`Unknow user\` \n(<@!${target}>)`, true)
                        .addField("<:711541810098470913:830460210220630027> Case ID", `${uniqID}`, true)
                        .addField("<:612058498108227586:830440548007018517> " + translations.reason + "", `${reason}`, true)

                    .setThumbnail(url = message.client.user.displayAvatarURL({ dynamic: true, size: 512 }))
                        .setFooter(message.client.footer, message.client.user.displayAvatarURL({ dynamic: true, size: 512 }))
                    message.guild.channels.cache.get(logs.channelID).send({ embeds: [embed] })
                }
            }


        } catch (error) {
            if (message.client.log) console.log(error)
            let err = await message.translate("ERROR_USER")
            return message.errorMessage(err)
        }









    },
};