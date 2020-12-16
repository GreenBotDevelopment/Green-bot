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

        let advdb = await adventure.find({ UserID: member.id })
        let userldb = await UserRpg.findOne({ UserID: member.id })

        const reportEmbed = new Discord.MessageEmbed()
            .setTitle(`Profil de \`${member.username}\``)
            .setAuthor(member.tag, member.displayAvatarURL({ dynamic: true, size: 512 }))

        .addField(`${emoji.quest} Quêtes`, `${member.username} a ${advdb.length} aventures en cours ou démarrées. `)
            .addField("Statistiques :", `🏟`)
            .addField("Argent", `0`,true)
            .addField("Réputation", `0`,true)


        .setFooter(message.client.footer)

        .setColor(message.client.color);
        message.channel.send(reportEmbed);



    },
};
