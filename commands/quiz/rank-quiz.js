const Discord = require('discord.js');

const quizs = require('../../quiz.json');
const QuizBD = require('../../database/models/quiz');

module.exports = {
    name: 'rank-quiz',
    description: 'Affiche votre rank',
    cooldown: 10,
    cat: 'quiz',
    botpermissions: ["SEND_MESSAGES", "EMBED_LINKS", ],
    async execute(message, args, client) {
        let member;
        if (args.length) {
            member = message.mentions.members.first() || message.guild.members.cache.get(args[0]) || message.guild.members.cache.filter(m => m.user.tag.includes(args.join(" ")) || m.displayName.includes(args.join(" ")) || m.user.username.includes(args.join(" "))).first()

        } else {
            member = message.member
        }
        if (!member) {

            return message.errorMessage(`Vous devez mentionner un membre valide ou fournir un ID valide.`)

        }
        const users = await QuizBD.find({})
        const usersTrier = users.sort((a, b) => (a.Corrects < b.Corrects) ? 1 : -1)

        function estUser(user) {
            return user.userID === member.user.id;
        }
        const user = usersTrier.find(estUser);
        const userTried = (element) => element === user;
        usersTrier.findIndex(userTried)
        let find = await QuizBD.findOne({ userID: member.user.id })
        if (find) {

            let embed = new Discord.MessageEmbed()
                .setColor("#D6EA2D")
                .setFooter(message.client.footer)
                .setDescription(`<:quiz:827220406515269653> Voici les statistiques sur les quizs . `)

            .addField(`Statistiques Quizs`, `**Quizs crées** :\`${find.quizs}\`\n **Quizs corrects** : \`${find.Corrects}\`\n **Niveau ** : \`${find.level}\`\n **XP** : \`${find.xp}\`\n**Xp pour le niveau ${find.level +1}** : \`${100 - find.xp}\` `)
                .addField(`📊 Classement`, `**${member.user.username}** est le \`${usersTrier.findIndex(userTried) +1}\` eme Meilleur utilisateur pour les quizs sur \`${users.length}\` membres`)
                .setTitle(`Statistiques Quiz`)
            message.channel.send(embed)
        } else {

            return message.errorMessage(`Cette personne n'a pas encore fait de quiz`);


        }


    },
};