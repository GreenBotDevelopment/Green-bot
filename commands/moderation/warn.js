const Discord = require("discord.js")
module.exports = {
    name: 'warn',
    description: 'Avertit en Messages privés la personne donnée',
    aliases: [],
    guildOnly: true,
    args: 'user',
    usage: '@user [reason]',
    exemple: '@pauldb09',
    cat: 'moderation',
    permissions: ['MANAGE_GUILD'],
    botpermissions: ['SEND_MESSAGES', 'EMBED_LINKS'],
    async execute(message, args, client, guildDB) {
        let tran = await message.translate("WARN");
        let member = message.mentions.members.first() || message.guild.members.cache.get(args[0]) || message.guild.members.cache.filter(m => m.user.tag.toLowerCase().includes(args[0].toLowerCase()) || m.displayName.toLowerCase().includes(args[0].toLowerCase()) || m.user.username.toLowerCase().includes(args[0].toLowerCase())).first()
        if (!member) {
            let err = await message.translate("ERROR_USER")
            return message.errorMessage(err)
        }
        if (member.user.bot) {
            let err = await message.translate("ERROR_BOT")
            return message.errorMessage(err)
        }

        const modErr = await message.translate("MODERATION")
        if (member.id === message.author.id) {
            return message.errorMessage(modErr.you)
        }
        if (member.id === message.guild.OWNER) return message.errorMessage(modErr.owner)

        const memberPosition = member.roles.highest.position;
        const moderationPosition = message.member.roles.highest.position;
        if (message.guild.OWNER !== message.author.id && !(moderationPosition > memberPosition)) {
            return message.errorMessage(modErr.superior)
        }
        let reason = args.slice(1).join(" ");
        if (!reason) {
            reason = modErr.raison;
        }
        await member.send({ embeds: [new Discord.MessageEmbed().setDescription(tran.dm.replace("{message.guild.name}", message.guild.name).replace("{member.user.tag}", member.user.tag).replace("{reason}", reason)).setColor("#F0B02F")] }).catch(() => {});
        const uniqID = await message.uniqID(10)
        message.channel.send({ embeds: [new Discord.MessageEmbed().setAuthor(tran.name, member.user.displayAvatarURL()).setDescription(`\`📚\` **${member.user.tag}** ${tran.desc} **${message.author.tag}** \n __\`📃\` ${tran.raison}__ : ${reason}.`).setColor(message.guild.settings.color).setFooter(`Case id: ${uniqID} | ${message.guild.settings.prefix}case ${uniqID}`, message.client.user.displayAvatarURL())] }).then(m => {
            message.guild.CreateWarn(member, reason, message.member, true, true, message.client, uniqID).catch(err => {
                if (message.client.log) console.log("[CreateWarn] : " + err + "")
            })
        })
    },
};