const fetch = require("node-fetch");
const Discord = require('discord.js');
const emoji = require('../../emojis.json')
const adventure = require("../../database/models/adventure");
const UserRpg = require("../../database/models/userrpg");
module.exports = {
    
    name: 'profil',
    description: 'Affiche votre profil sur le rpg',
    exemple: '@pauldB09',
    usage: '[utilisateur]',
    botpermission: ['EMBED_LINKS'],
    cat: 'rpg',
    async execute(message, args) {
        const member = message.mentions.users.first() || message.author;
        if (member.bot) return message.channel.send(`${emoji.error} Le profil d'un bot ? sérieusement ?`)
        let advdb = await adventure.find({ UserID: member.id })
        let userldb = await UserRpg.findOne({ UserID: member.id })
        let argent;
        if (userldb) {
            if (userldb.credits) {
                argent = userldb.credits;
            } else {
                argent = '0';
            }
        } else {
            argent = '0';
        }
        const reportEmbed = new Discord.MessageEmbed()
            .setTitle(`Profil de \`${member.username}\``)
            .setAuthor(member.tag, member.displayAvatarURL({ dynamic: true, size: 512 }))

        .addField(`${emoji.quest} Quêtes`, `${member.username} a ${advdb.length} aventures en cours ou démarrées. `)

        .addField(`${emoji.money} Argent`, argent, true)
            .addField("Réputation", `0`, true)


        .setFooter(message.client.footer)

        .setColor(message.client.color);
        message.channel.send(reportEmbed);


    },
};
