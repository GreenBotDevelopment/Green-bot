const Discord = require('discord.js');
const Welcome = require('../../database/models/Welcome')
const Case = require('../../database/models/case');
module.exports = {
    name: 'unban',
    description: 'Déban le membre fourni du serveur',
    guildOnly: true,
    usage: '<id> [reason]',
    exemple: '783708073390112830',
    cat: 'moderation',
    aliases: ['deban'],
    args: true,
    permissions: ['BAN_MEMBERS'],
    botpermissions: ["BAN_MEMBERS"],
    async execute(message, args, client) {
        const modErr = await message.translate("MODERATION")


        const bannedMemberInfo = await message.guild.bans.fetch({ cache: false })
        if (bannedMemberInfo.size == 0) {
            let err = await message.translate("NO_BAN")
            return message.errorMessage(err)
        }

        let bannedMember;
        bannedMember = bannedMemberInfo.find(b => b.user.username.toLowerCase().includes(args[0].toLocaleLowerCase())) || bannedMemberInfo.get(args[0]) || bannedMemberInfo.find(bm => bm.user.tag.toLowerCase() === args[0].toLocaleLowerCase());
        if (!bannedMember) {
            let err = await message.translate("NO_BAN")
            return message.errorMessage(err)
        }

        let reason = args.slice(1).join(" ");
        if (!reason) {
            reason = modErr.raison;
        }


        message.guild.members.unban(bannedMember.user.id, reason).catch(async() => {
            let err = await message.translate("ERROR_USER")
            return message.errorMessage(err)
        }).then(async user => {
            const l = await message.translate("UNBAN")
            message.succesMessage(l.ok.replace("{tag}", user.tag))
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

            const verynew = new Case({
                serverID: message.guild.id,
                id: uniqID,
                targetID: user.id,
                sanction: "Unban",
                reason: reason,
                mod: message.member.id,
            }).save()
            const logs = await Welcome.findOne({ serverID: message.guild.id, reason: `mod-logs` })
            if (logs) {
                if (message.guild.channels.cache.get(logs.channelID)) {
                    const translations = await message.translate("LOGS_MOD")
                    const embed = new Discord.MessageEmbed()
                        .setColor(message.guild.settings.color)
                        .setAuthor(`${user.username}`, user.displayAvatarURL({ dynamic: true, size: 512 }))
                        .setTitle(translations.title.replace("{id}", uniqID))
                        .setDescription(translations.desc.replace("{user}", message.member.user.tag).replace("{member}", user.tag))
                        .addField("<:membres:830432144211705916> " + translations.mod + "", `\`${message.member.user.tag}\` \n(<@!${message.member.id}>)`, true)
                        .addField("<:663041911753277442:830432143800532993> Type", "Unban", true)
                        .addField("<:green_members:811167997023485973> " + translations.target + "", `\`${user.tag}\` \n(<@!${user.id}>)`, true)
                        .addField("<:711541810098470913:830460210220630027> Case ID", `${uniqID}`, true)
                        .addField("<:612058498108227586:830440548007018517> " + translations.reason + "", `${reason}`, true)

                    .setThumbnail(url = message.client.user.displayAvatarURL({ dynamic: true, size: 512 }))
                        .setFooter(message.client.footer, message.client.user.displayAvatarURL({ dynamic: true, size: 512 }))
                    message.guild.channels.cache.get(logs.channelID).send({ embeds: [embed] })
                }
            }

        });




    },
};