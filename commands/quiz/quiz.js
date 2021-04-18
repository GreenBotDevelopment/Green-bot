const Discord = require('discord.js');
const guild = require('../../database/models/guild');

const quizs = require('../../quiz.json');
const QuizBD = require('../../database/models/quiz');
const CustomsQuizs = require('../../database/models/CustomsQuizs');

module.exports = {
    name: 'quiz',
    description: 'Crée un quiz',
    aliases: ['quizs', 'questionnaire'],
    cooldown: 10,
    cat: 'quiz',
    botpermissions: ["SEND_MESSAGES", "EMBED_LINKS", ],
    async execute(message, args, client) {
        const verify = await guild.findOne({ serverID: message.guild.id, reason: `quiz` })
        if (verify) {
            const dispo = await CustomsQuizs.find({ serverID: message.guild.id })
            let find = await QuizBD.findOne({ userID: message.author.id })
            if (find) {

                if (dispo.length == 0) return message.errorMessage(`Ce serveur n'a pas encore créer de quizs`)
                const quiz = dispo[Math.floor(Math.random() * dispo.length)];

                let embed = new Discord.MessageEmbed()
                    .setColor("#D6EA2D")
                    .setFooter(message.client.footer)
                    .setDescription(`Vous avez **30** secondes pour répondre ! \n\n${quiz.question} `)
                    .setTitle(`<:quiz:829357477966643220> Quiz #${find.quizs + 1}`)
                message.channel.send(embed).then(() => {
                    message.channel.awaitMessages(m => m.author.id === message.author.id, { max: 1, time: 30000, errors: ['time'] })
                        .then(async collected => {
                            if (collected.first().author.bot) return;
                            if (quiz.reponse.toLowerCase() === collected.first().content.toLowerCase()) {
                                if (find.xp + 10 == 100) {
                                    let update = await QuizBD.findOneAndUpdate({ userID: message.author.id }, { $set: { xp: '0', level: find.level + 1, quizs: find.quizs + 1, Corrects: find.Corrects + 1 } }, { new: true })
                                    return message.succesMessage(`🏆 Bravo **${collected.first().author.username}** C'est la bonne réponse ! Tu as gagné \`10\`xp . !\n :tada: Tu viens de passer un Niveau . Tu es désormais au niveau **${find.level + 1}** !`);

                                }
                                let update = await QuizBD.findOneAndUpdate({ userID: message.author.id }, { $set: { xp: find.xp + 10, level: find.level, quizs: find.quizs + 1, Corrects: find.Corrects + 1 } }, { new: true })
                                return message.succesMessage(`🏆 Bravo **${collected.first().author.username}** C'est la bonne réponse ! Tu as gagné \`10\`xp . !`);

                            } else {
                                let update = await QuizBD.findOneAndUpdate({ userID: message.author.id }, { $set: { quizs: find.quizs + 1 } }, { new: true })

                                return message.errorMessage(`Eh non , ce n'est pas la bonne réponse ! Réasayez plus tard`);

                            }
                        })
                        .catch(async(err) => {
                            let update = await QuizBD.findOneAndUpdate({ userID: message.author.id }, { $set: { quizs: find.quizs + 1 } }, { new: true })

                            message.errorMessage(`Vous n'avez pas répondu dans les 30 secondes... Temps écoulé !`);
                        })
                })
            } else {
                const quiz = dispo[Math.floor(Math.random() * dispo.length)];

                let embed = new Discord.MessageEmbed()
                    .setColor("#D6EA2D")
                    .setFooter(message.client.footer)
                    .setDescription(`Vous avez **30** secondes pour répondre ! \n\n${quiz.question} `)
                    .setTitle(`<:quiz:829357477966643220> Quiz #${find.quizs + 1}`)
                message.channel.send(embed).then(() => {
                    message.channel.awaitMessages(m => m.author.id === message.author.id, { max: 1, time: 30000, errors: ['time'] })
                        .then(async collected => {
                            if (collected.first().author.bot) return;
                            if (quiz.reponse.toLowerCase() === collected.first().content.toLowerCase()) {
                                const verynew = new QuizBD({
                                    userID: message.author.id,
                                    xp: 10,
                                    level: 0,
                                    Corrects: 1,
                                    quizs: 1,
                                }).save()
                                return message.succesMessage(`🏆 Bravo **${collected.first().author.username}** C'est la bonne réponse ! Tu as gagné \`10\`xp . !`);

                            } else {
                                const verynew = new QuizBD({
                                    userID: message.author.id,
                                    xp: 0,
                                    Corrects: 0,
                                    level: 0,
                                    quizs: 1,
                                }).save()
                                return message.errorMessage(`Eh non , ce n'est pas la bonne réponse ! Réasayez plus tard`);

                            }
                        })
                        .catch(async(err) => {
                            const verynew = new QuizBD({
                                userID: message.author.id,
                                xp: 0,
                                level: 0,
                                Corrects: 0,
                                quizs: 1,
                            }).save()
                            return message.errorMessage(`Vous n'avez pas répondu dans les 30 secondes... Temps écoulé !`);
                        })
                })

            }
        } else {
            let find = await QuizBD.findOne({ userID: message.author.id })
            if (find) {

                const quiz = quizs[Math.floor(Math.random() * quizs.length)];

                let embed = new Discord.MessageEmbed()
                    .setColor("#D6EA2D")
                    .setFooter(message.client.footer)
                    .setDescription(`Vous avez **30** secondes pour répondre ! \n\n${quiz.question} `)
                    .setTitle(`<:quiz:829357477966643220> Quiz #${find.quizs + 1}`)
                message.channel.send(embed).then(() => {
                    message.channel.awaitMessages(m => m.author.id === message.author.id, { max: 1, time: 30000, errors: ['time'] })
                        .then(async collected => {
                            if (collected.first().author.bot) return;
                            if (quiz.reponses.some(res => collected.first().content.toLowerCase().includes(res.toLowerCase()))) {
                                if (find.xp + 10 == 100) {
                                    let update = await QuizBD.findOneAndUpdate({ userID: message.author.id }, { $set: { xp: '0', level: find.level + 1, quizs: find.quizs + 1, Corrects: find.Corrects + 1 } }, { new: true })
                                    return message.succesMessage(`🏆 Bravo **${collected.first().author.username}** C'est la bonne réponse ! Tu as gagné \`10\`xp . !\n :tada: Tu viens de passer un Niveau . Tu es désormais au niveau **${find.level + 1}** !`);

                                }
                                let update = await QuizBD.findOneAndUpdate({ userID: message.author.id }, { $set: { xp: find.xp + 10, level: find.level, quizs: find.quizs + 1, Corrects: find.Corrects + 1 } }, { new: true })
                                return message.succesMessage(`🏆 Bravo **${collected.first().author.username}** C'est la bonne réponse ! Tu as gagné \`10\`xp . !`);

                            } else {
                                let update = await QuizBD.findOneAndUpdate({ userID: message.author.id }, { $set: { quizs: find.quizs + 1 } }, { new: true })

                                return message.errorMessage(`Eh non , ce n'est pas la bonne réponse ! Réasayez plus tard`);

                            }
                        })
                        .catch(async(err) => {
                            let update = await QuizBD.findOneAndUpdate({ userID: message.author.id }, { $set: { quizs: find.quizs + 1 } }, { new: true })

                            message.errorMessage(`Vous n'avez pas répondu dans les 30 secondes... Temps écoulé !`);
                        })
                })
            } else {
                const quiz = quizs[Math.floor(Math.random() * quizs.length)];

                let embed = new Discord.MessageEmbed()
                    .setColor("#D6EA2D")
                    .setFooter(message.client.footer)
                    .setDescription(`Vous avez **30** secondes pour répondre ! \n\n${quiz.question} `)
                    .setTitle(`<:quiz:829357477966643220> Quiz #${find.quizs + 1}`)
                message.channel.send(embed).then(() => {
                    message.channel.awaitMessages(m => m.author.id === message.author.id, { max: 1, time: 30000, errors: ['time'] })
                        .then(async collected => {
                            if (collected.first().author.bot) return;
                            if (quiz.reponses.some(res => collected.first().content.toLowerCase().includes(res.toLowerCase()))) {
                                const verynew = new QuizBD({
                                    userID: message.author.id,
                                    xp: 10,
                                    level: 0,
                                    Corrects: 1,
                                    quizs: 1,
                                }).save()
                                return message.succesMessage(`🏆 Bravo **${collected.first().author.username}** C'est la bonne réponse ! Tu as gagné \`10\`xp . !`);

                            } else {
                                const verynew = new QuizBD({
                                    userID: message.author.id,
                                    xp: 0,
                                    Corrects: 0,
                                    level: 0,
                                    quizs: 1,
                                }).save()
                                return message.errorMessage(`Eh non , ce n'est pas la bonne réponse ! Réasayez plus tard`);

                            }
                        })
                        .catch(async(err) => {
                            const verynew = new QuizBD({
                                userID: message.author.id,
                                xp: 0,
                                level: 0,
                                Corrects: 0,
                                quizs: 1,
                            }).save()
                            return message.errorMessage(`Vous n'avez pas répondu dans les 30 secondes... Temps écoulé !`);
                        })
                })

            }
        }

    },
};