const Discord = require('discord.js');
const guild = require('../../database/models/guild');

const quizs = require('../../quiz.json');
const QuizBD = require('../../database/models/quiz');
const CustomsQuizs = require('../../database/models/CustomsQuizs');
const Canvas = require('canvas');
const { registerFont } = require('canvas');
registerFont('./roboto-black.ttf', { family: 'Roboto' });

module.exports = {
    name: 'quiz',
    description: 'Crée un quiz',
    aliases: ['quizs', 'questionnaire'],
    cooldown: 10,
    cat: 'games',
    botpermissions: ["SEND_MESSAGES", "EMBED_LINKS", ],
    async execute(message, args, client) {
        const lang = await message.translate("QUIZ")
        const verify = await guild.findOne({ serverID: message.guild.id, reason: `quiz` })
        if (verify) {
            const dispo = await CustomsQuizs.find({ serverID: message.guild.id })
            let find = await QuizBD.findOne({ userID: message.author.id })
            if (find) {

                if (dispo.length == 0) return message.errorMessage(lang.no)
                const quiz = dispo[Math.floor(Math.random() * dispo.length)];
                const canvas = Canvas.createCanvas(800, 300);
                const ctx = canvas.getContext('2d');

                ctx.font = '40px "Roboto Black"';
                ctx.fillStyle = "#fff";
                ctx.fillText(message.member.user.username, 130, 70);


                ctx.font = '40px "Roboto Black"';
                ctx.textAlign = "center";
                ctx.fillStyle = "#fff";
                ctx.fillText(`quiz #${find.quizs + 1}`, 700, 70);

                ctx.font = '28px "Roboto Black"';
                ctx.textAlign = "center";
                ctx.fillStyle = "#fff";
                ctx.fillText(quiz.question, 400, 180);

                ctx.beginPath();
                ctx.fillStyle = "#00ff00";
                ctx.arc(60, 60, 44, 0, Math.PI * 2, true);
                ctx.fill();
                ctx.closePath();

                ctx.beginPath();
                ctx.arc(60, 60, 40, 0, Math.PI * 2, true);
                ctx.closePath();
                ctx.clip();

                ctx.drawImage(await Canvas.loadImage(message.member.user.displayAvatarURL({ format: 'jpg' })), 20, 20, 80, 80);

                const attachment = new Discord.MessageAttachment(canvas.toBuffer(), "quiz3.jpg");
                let embed = new Discord.MessageEmbed()
                    .setColor("#D6EA2D")
                    .setAuthor(`${message.author.username}`, message.author.displayAvatarURL({ dynamic: true, size: 512 }))

                .setFooter(message.client.footer, message.client.user.displayAvatarURL({ dynamic: true, size: 512 }))
                    .setDescription(lang.desc)
                    .setImage(`attachment://quiz3.jpg`)
                message.channel.send({ embeds: [embed], files: [attachment] }).then(() => {
                    const filtro = (m, user) => {
                        return m.author.id == message.author.id;
                    };
                    message.channel.awaitMessages({ filtro, max: 1, time: 30000, errors: ['time'] })
                        .then(async collected => {
                            if (collected.first().author.bot) return;
                            if (quiz.reponse.toLowerCase() === collected.first().content.toLowerCase()) {
                                if (find.xp + 10 == 100) {
                                    let update = await QuizBD.findOneAndUpdate({ userID: message.author.id }, { $set: { xp: '0', level: find.level + 1, quizs: find.quizs + 1, Corrects: find.Corrects + 1 } }, { new: true })
                                    return message.succesMessage(lang.okXP.replace("{user}", collected.first().author.username).replace("level", find.level + 1));

                                }
                                let update = await QuizBD.findOneAndUpdate({ userID: message.author.id }, { $set: { xp: find.xp + 10, level: find.level, quizs: find.quizs + 1, Corrects: find.Corrects + 1 } }, { new: true })
                                return message.succesMessage(lang.ok.replace("{user}", collected.first().author.username));

                            } else {
                                let update = await QuizBD.findOneAndUpdate({ userID: message.author.id }, { $set: { quizs: find.quizs + 1 } }, { new: true })

                                return message.errorMessage(lang.invalid);

                            }
                        })
                        .catch(async(err) => {
                            let update = await QuizBD.findOneAndUpdate({ userID: message.author.id }, { $set: { quizs: find.quizs + 1 } }, { new: true })

                            return message.errorMessage(lang.time);
                        })
                })
            } else {
                const quiz = dispo[Math.floor(Math.random() * dispo.length)];
                const canvas = Canvas.createCanvas(800, 300);
                const ctx = canvas.getContext('2d');

                ctx.font = '40px "Roboto Black"';
                ctx.fillStyle = "#fff";
                ctx.fillText(message.member.user.username, 130, 70);


                ctx.font = '40px "Roboto Black"';
                ctx.textAlign = "center";
                ctx.fillStyle = "#fff";
                ctx.fillText(`quiz #1`, 700, 70);

                ctx.font = '28px "Roboto Black"';
                ctx.textAlign = "center";
                ctx.fillStyle = "#fff";
                const tr = await message.gg(quiz.question)
                ctx.fillText(tr, 400, 180);
                ctx.beginPath();
                ctx.fillStyle = "#00ff00";
                ctx.arc(60, 60, 44, 0, Math.PI * 2, true);
                ctx.fill();
                ctx.closePath();

                ctx.beginPath();
                ctx.arc(60, 60, 40, 0, Math.PI * 2, true);
                ctx.closePath();
                ctx.clip();

                ctx.drawImage(await Canvas.loadImage(message.member.user.displayAvatarURL({ format: 'jpg' })), 20, 20, 80, 80);

                const attachment = new Discord.MessageAttachment(canvas.toBuffer(), "quiz3.jpg");
                let embed = new Discord.MessageEmbed()
                    .setColor("#D6EA2D")
                    .setAuthor(`${message.author.username}`, message.author.displayAvatarURL({ dynamic: true, size: 512 }))

                .setFooter(message.client.footer, message.client.user.displayAvatarURL({ dynamic: true, size: 512 }))
                    .setDescription(lang.desc)
                    .setImage(`attachment://quiz3.jpg`)
                message.channel.send({ embeds: [embed], files: [attachment] }).then(() => {
                    const filtro = (m, user) => {
                        return m.author.id == message.author.id;
                    };
                    message.channel.awaitMessages({ filtro, max: 1, time: 30000, errors: ['time'] }).then(async collected => {
                            if (collected.first().author.bot) return;
                            if (quiz.reponse.toLowerCase() === collected.first().content.toLowerCase()) {
                                const verynew = new QuizBD({
                                    userID: message.author.id,
                                    xp: 10,
                                    level: 0,
                                    Corrects: 1,
                                    quizs: 1,
                                }).save()
                                return message.succesMessage(lang.ok.replace("{user}", collected.first().author.username));

                            } else {
                                const verynew = new QuizBD({
                                    userID: message.author.id,
                                    xp: 0,
                                    Corrects: 0,
                                    level: 0,
                                    quizs: 1,
                                }).save()
                                return message.errorMessage(lang.invalid);

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
                            return message.errorMessage(lang.time);
                        })
                })

            }
        } else {
            let find = await QuizBD.findOne({ userID: message.author.id })
            if (find) {

                const quiz = quizs[Math.floor(Math.random() * quizs.length)];
                const canvas = Canvas.createCanvas(800, 300);
                const ctx = canvas.getContext('2d');

                ctx.font = '40px "Roboto Black"';
                ctx.fillStyle = "#fff";
                ctx.fillText(message.member.user.username, 130, 70);


                ctx.font = '40px "Roboto Black"';
                ctx.textAlign = "center";
                ctx.fillStyle = "#fff";
                ctx.fillText(`quiz #${find.quizs + 1}`, 700, 70);

                ctx.font = '28px "Roboto Black"';
                ctx.textAlign = "center";
                ctx.fillStyle = "#fff";
                const tr = await message.gg(quiz.question)
                ctx.fillText(tr, 400, 180);

                ctx.beginPath();
                ctx.fillStyle = "#00ff00";
                ctx.arc(60, 60, 44, 0, Math.PI * 2, true);
                ctx.fill();
                ctx.closePath();

                ctx.beginPath();
                ctx.arc(60, 60, 40, 0, Math.PI * 2, true);
                ctx.closePath();
                ctx.clip();

                ctx.drawImage(await Canvas.loadImage(message.member.user.displayAvatarURL({ format: 'jpg' })), 20, 20, 80, 80);

                const attachment = new Discord.MessageAttachment(canvas.toBuffer(), "quiz3.jpg");
                let embed = new Discord.MessageEmbed()
                    .setColor("#D6EA2D")

                .setFooter(message.client.footer, message.client.user.displayAvatarURL({ dynamic: true, size: 512 }))
                    .setAuthor(`${message.author.username}`, message.author.displayAvatarURL({ dynamic: true, size: 512 }))

                .setDescription(lang.desc)
                    .setImage(`attachment://quiz3.jpg`)
                message.channel.send({ embeds: [embed], files: [attachment] }).then(() => {
                    const filtro = (m, user) => {
                        return m.author.id == message.author.id;
                    };
                    message.channel.awaitMessages({ filtro, max: 1, time: 30000, errors: ['time'] }).then(async collected => {
                            if (collected.first().author.bot) return;
                            if (quiz.reponses.some(res => collected.first().content.toLowerCase().includes(res.toLowerCase()))) {
                                if (find.xp + 10 == 100) {
                                    let update = await QuizBD.findOneAndUpdate({ userID: message.author.id }, { $set: { xp: '0', level: find.level + 1, quizs: find.quizs + 1, Corrects: find.Corrects + 1 } }, { new: true })
                                    return message.succesMessage(lang.okXP.replace("{user}", collected.first().author.username).replace("level", find.level + 1));

                                }
                                let update = await QuizBD.findOneAndUpdate({ userID: message.author.id }, { $set: { xp: find.xp + 10, level: find.level, quizs: find.quizs + 1, Corrects: find.Corrects + 1 } }, { new: true })
                                return message.succesMessage(lang.ok.replace("{user}", collected.first().author.username));

                            } else {
                                let update = await QuizBD.findOneAndUpdate({ userID: message.author.id }, { $set: { quizs: find.quizs + 1 } }, { new: true })

                                return message.errorMessage(lang.invalid);

                            }
                        })
                        .catch(async(err) => {
                            let update = await QuizBD.findOneAndUpdate({ userID: message.author.id }, { $set: { quizs: find.quizs + 1 } }, { new: true })

                            return message.errorMessage(lang.time);
                        })
                })
            } else {
                const quiz = quizs[Math.floor(Math.random() * quizs.length)];
                const canvas = Canvas.createCanvas(800, 300);
                const ctx = canvas.getContext('2d');

                ctx.font = '40px "Roboto Black"';
                ctx.fillStyle = "#fff";
                ctx.fillText(message.member.user.username, 130, 70);


                ctx.font = '40px "Roboto Black"';
                ctx.textAlign = "center";
                ctx.fillStyle = "#fff";
                ctx.fillText(`quiz #1`, 700, 70);

                ctx.font = '28px "Roboto Black"';
                ctx.textAlign = "center";
                ctx.fillStyle = "#fff";
                ctx.fillText(quiz.question, 400, 180);

                ctx.beginPath();
                ctx.fillStyle = "#00ff00";
                ctx.arc(60, 60, 44, 0, Math.PI * 2, true);
                ctx.fill();
                ctx.closePath();

                ctx.beginPath();
                ctx.arc(60, 60, 40, 0, Math.PI * 2, true);
                ctx.closePath();
                ctx.clip();

                ctx.drawImage(await Canvas.loadImage(message.member.user.displayAvatarURL({ format: 'jpg' })), 20, 20, 80, 80);

                const attachment = new Discord.MessageAttachment(canvas.toBuffer(), "quiz3.jpg");
                let embed = new Discord.MessageEmbed()
                    .setColor("#D6EA2D")
                    .setAuthor(`${message.author.username}`, message.author.displayAvatarURL({ dynamic: true, size: 512 }))

                .setFooter(message.client.footer, message.client.user.displayAvatarURL({ dynamic: true, size: 512 }))
                    .setDescription(lang.desc)
                    .setImage(`attachment://quiz3.jpg`)
                message.channel.send({ embeds: [embed], files: [attachment] }).then(() => {
                    const filtro = (m, user) => {
                        return m.author.id == message.author.id;
                    };
                    message.channel.awaitMessages({ filtro, max: 1, time: 30000, errors: ['time'] }).then(async collected => {
                            if (collected.first().author.bot) return;
                            if (quiz.reponses.some(res => collected.first().content.toLowerCase().includes(res.toLowerCase()))) {
                                const verynew = new QuizBD({
                                    userID: message.author.id,
                                    xp: 10,
                                    level: 0,
                                    Corrects: 1,
                                    quizs: 1,
                                }).save()
                                return message.succesMessage(lang.ok.replace("{user}", collected.first().author.username));

                            } else {
                                const verynew = new QuizBD({
                                    userID: message.author.id,
                                    xp: 0,
                                    Corrects: 0,
                                    level: 0,
                                    quizs: 1,
                                }).save()
                                return message.errorMessage(lang.invalid);

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
                            return message.errorMessage(lang.time);
                        })
                })

            }
        }

    },
};