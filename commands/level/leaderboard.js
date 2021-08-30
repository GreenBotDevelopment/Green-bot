const Discord = require('discord.js');
const config = require('../../config.js');
const guild = require('../../database/models/guild');
const levelModel = require('../../database/models/level');
module.exports = {
        name: 'leaderboard',
        description: 'Affiche le classement du serveur',
        aliases: ['classement', 'lb'],
        cat: 'levelling',
        async execute(message, args) {

            const lang = await message.translate("LEADERBOARD")
            const userdata = await levelModel.find({ serverID: message.guild.id })
            if (userdata.length < 2) {
                return message.errorMessage(lang.error)
            }

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
                .setColor(message.guild.settings.color)
                .setDescription(`${lang.desc.replace("{rank}",ranked).replace("{tot}",message.guild.memberCount)} \n\n${array.filter(r=>message.guild.members.cache.get(r.userID)).map((r) => r).map((r, i) => `**#${i + 1}** **__${message.guild.members.cache.get(r.userID).user.tag}__** \n ➥ ${lang.niveau} \`${r.level}\`, \`${r.xp}\` xp,  \`${r.messagec}\` messages `).join("\n") || "Aucunnes données"}`)
            .setAuthor(`🏆 ${message.guild.name} - ${lang.title}`, message.guild.iconURL({ dynamic: true, size: 512 }))

        embed.setThumbnail(message.guild.icon ? message.guild.iconURL({ dynamic: true }) : "https://cdn.discordapp.com/attachments/748897191879245834/782271474450825226/0.png?size=128")


        .setFooter(message.client.footer, message.client.user.displayAvatarURL({ dynamic: true, size: 512 }))

        message.reply({ embeds:[embed] , allowedMentions: { repliedUser: false } })



    },
};