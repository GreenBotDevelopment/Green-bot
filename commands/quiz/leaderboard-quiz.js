const Discord = require('discord.js');
const config = require('../../config.json');
const emoji = require('../../emojis.json')
const guild = require('../../database/models/guild');
const QuizBD = require('../../database/models/quiz');

module.exports = {
    name: 'leaderboard-quiz',
    description: 'Affiche le classement des quizs',
    aliases: ['classement-quiz', 'lb-quiz'],
    cat: 'quiz',
    async execute(message, args) {


        const userdata = await QuizBD.find({})
        let array = userdata.sort((a, b) => (a.Corrects < b.Corrects) ? 1 : -1).slice(0, 10)
        let forfind = userdata.sort((a, b) => (a.Corrects < b.Corrects) ? 1 : -1)

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
            txt = `${ranked}eme`
        }
        const embed = new Discord.MessageEmbed()
            .setColor(message.client.color)
            .setDescription(`Vous êtes actuellement **${txt}** dans le classement général `)
            .setAuthor(`🏆 Quizs - Classement`, message.guild.iconURL({ dynamic: true, size: 512 }))
            .addField("Classement ", array.slice(0, 10).map(v => `<@${v.userID}> : \`${v.level}\` Avec \`${v.Corrects}\` Quizs justes `) || "Aucunnes données")



        .setFooter(message.client.footer)

        message.channel.send({ embed })



    },
};