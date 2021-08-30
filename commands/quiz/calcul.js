const Discord = require('discord.js');
const guild = require('../../database/models/guild');

const quizs = require('../../quiz.json');
const QuizBD = require('../../database/models/quiz');
const CustomsQuizs = require('../../database/models/CustomsQuizs');
const math = require('mathjs')
module.exports = {
        name: 'calculation',
        description: 'Crée un calcul aléatoire',
        aliases: ['calcul-mental', 'questionnaire', 'calcul'],
        cooldown: 10,
        cat: 'games',
        usage: '<level>',
        exemple: '5',
        args: true,
        botpermissions: ["SEND_MESSAGES", "EMBED_LINKS", ],
        async execute(message, args, client) {
            const content = args[0];
            if (isNaN(content) || content < 1 || content > 100 || content.includes('-') || content.includes('+') || content.includes(',') || content.includes('.') || content.includes('e')) {
                let numberErr = await message.translate("MESSAGE_ERROR")
                return message.errorMessage(numberErr.replace("{amount}", "1").replace("{range}", "100"))
            }
            let dif = parseInt(content, 10)
            const GénererCalcul = function(level = {}) {

                    limit = 50;
                    limit1 = 100;
                    const n = Math.floor(Math.random() * limit + 1);
                    const n1 = Math.floor(Math.random() * limit1);
                    let choisi;
                    const ops = ["+", "-", "*", "/"]
                    if (level == 1 || level == 2) choisi = ops[0]
                    if (level >= 3 && level <= 5) {
                        const n = Math.floor(Math.random() * 2);

                        choisi = ops[Math.floor(n)];
                    }
                    if (level > 5) choisi = ops[Math.floor(Math.random() * 4)]
                    if (level > 50) {
                        const n = Math.floor(Math.random() * 2);
                        if (n == 2) {
                            choisi = "*";
                        } else {
                            choisi = "/";
                        }
                    }
                    let ResultArray = [{ operation: `${n} ${choisi} ${n1}`, result: `${math.evaluate(`${n} ${choisi} ${n1}`)}`}]

             return `${n} ${choisi} ${n1}`
            }
            let calcul = GénererCalcul(dif)
            let embed = new Discord.MessageEmbed()
                .setColor("#D6EA2D")
                .setFooter(message.client.footer, message.client.user.displayAvatarURL({ dynamic: true, size: 512 }))
                .setDescription(`${message.guild.settings.lang === "fr" ? `Vous avez **30** secondes pour résoudre ce calcul ! \n\n**${calcul}**\n\nCalcul de niveau **${dif}** \nDonnez le résultat avec 1 chiffre après la virgule ! `:`You have **30** seconds to solve this calculation !\n\n__**${calcul}**__\n\nLevel calculation: **${dif}**  \nGive the result with 1 digit after the decimal point! `}`)
                .setTitle(`<:quiz:829357477966643220> Calculation`)
            message.reply({ embeds: [embed],allowedMentions: { repliedUser: false }
 }).then(m => {
                const filter = (m, user) => {
                    return m.author.id === message.author.id;
                };
                message.channel.awaitMessages({filter, max: 1, time: 30000, errors: ['time'] })
                    .then(async collected => {
                        if (collected.first().author.bot) return;
                       let res;
                        if(calcul.includes("/")){
                            res = math.evaluate(calcul).toFixed(1)

                        }else{
                           res = math.evaluate(calcul)

                        }            
            if (res == collected.first().content) {

                            return message.succesMessage(`${message.guild.settings.lang === "fr" ? "Bravo , tu as trouvé le bon résultat !! :tada:":"Congratulations, you found the right result ! :tada:"}`);


                        } else {
                            message.errorMessage(`${message.guild.settings.lang === "fr" ? `Eh non, la réponse était ${res}.`:`No, the answer was ${res}.`}`)
                        }
                    })
                    .catch(async(err) => {
                        if (message.client.log) console.log(err)
                        message.errorMessage(`${message.guild.settings.lang === "fr" ? `Vous n'avez pas répondu dans les 30 secondes... Temps écoulé !`:`You did not answer within 30 seconds... Your time is up!`}`);
                    })

            })

          
    },
};