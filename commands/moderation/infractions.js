const moment = require('moment');
const Discord = require('discord.js');
const Warn = require('../../database/models/warn');
const emoji = require('../../emojis.json')
module.exports = {
    name: 'infractions',
    description: 'Donne la liste des avertisements d\'un utilisateur',
    aliases: ["warns", "see-warns", "view-warns", "see-sanctions", "view-sanctions", "infractions", "view-infractions", "see-infractions"],
    guildOnly: true,
    args: 'member',
    usage: '@member',
    exemple: '@pauldb09',
    cat: 'moderation',
    botpermissions: ["SEND_MESSAGES", "EMBED_LINKS"],

    permissions: ['MANAGE_GUILD'],

    async execute(message, args, client) {



        const member = message.mentions.members.first() || message.guild.members.cache.get(args[0]);
    if (!member || member == undefined) {
            return message.channel.send(`${emoji.error} Veuillez indiquer un membre valide  !`)
        }
        if (member.user.bot) {
            return message.channel.send(`${emoji.error} Un bot ne peut pas avoir d'avertisements !`)
        }






        let warndb = await Warn.find({ serverID: message.guild.id, manID: member.id })
        if (warndb) {

            const warnEmbed = new Discord.MessageEmbed()
                .setAuthor(member.user.tag, member.user.displayAvatarURL())
                .setColor(message.client.color)
                .setFooter(message.client.footer)
                .setDescription(`Avertisements de ${member}`)
                .addFields({ name: `Tous les warns (${warndb.length})`, value: warndb.map(warn => `\`${warn.reason}\` , le ${moment(warn.date).locale('fr').format('LL LTS')} Modérateur : <@${warn.moderator}>`).join(`
                `) || `${emoji.error} Cette personne n'a aucuns warns` })

            const msg = await message.channel.send(warnEmbed);

            await msg.react("⬅");
            await msg.react("➡");
            await msg.react("❌");
        } else {



        }
    },
};
