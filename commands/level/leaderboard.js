const Discord = require('discord.js');
const config = require('../../config.json');
const emoji = require('../../emojis.json')
const guild = require('../../database/models/guild');
const levelModel = require('../../database/models/level');
module.exports = {
        name: 'leaderboard',
        description: 'Affiche le classement du serveur',
        aliases: ['classement', 'lb'],
        cat: 'level',
        async execute(message, args) {


            const userdata = await levelModel.find({ serverID: message.guild.id })
            if (userdata < 2) return message.errorMessage(`Je n'ai pas assez de données pour ce serveur .`)
            const datacommands = await guild.find({ serverID: message.guild.id, reason: `command` }).limit(5)
            let array = userdata.sort((a, b) => (a.messagec < b.messagec) ? 1 : -1).slice(0, 10)
            let forfind = userdata.sort((a, b) => (a.messagec < b.messagec) ? 1 : -1)

            function estUser(user) {
                return user.userID === message.author.id;
            }
            const user = forfind.find(estUser);
            const userTried = (element) => element === user;
            let ranked = forfind.findIndex(userTried) + 1
            let txt;
            if (ranked === 1) {
                txt = "1er"
            } else {
                txt = `${ranked} ème`
            }
            const embed = new Discord.MessageEmbed()
                .setColor(message.client.color)
                .setDescription(`Vous êtes actuellement **${txt}** sur ce serveur \n\n${array.map((r) => r).map((r, i) => `\`#${i + 1}\` <@${r.userID}> \n ➥ Niveau \`${r.level}\`, \`${r.xp}\` xp,  \`${r.messagec}\` messages `).join("\n") || "Aucunnes données"}`)
            .setAuthor(`🏆 ${message.guild.name} - Classement`, message.guild.iconURL({ dynamic: true, size: 512 }))

        embed.setThumbnail(message.guild.icon ? message.guild.iconURL({ dynamic: true }) : "https://cdn.discordapp.com/attachments/748897191879245834/782271474450825226/0.png?size=128")


        .setFooter(message.client.footer)

        message.channel.send({ embed })



    },
};