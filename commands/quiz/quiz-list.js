const Discord = require('discord.js');
const guild = require('../../database/models/guild');

const quizs = require('../../quiz.json');
const QuizBD = require('../../database/models/quiz');
const CustomsQuizs = require('../../database/models/CustomsQuizs');

module.exports = {
        name: 'quiz-list',
        description: 'Donne la liste des quizs personnalisés du serveur',
        aliases: ['quizs', 'questionnaire'],
        cooldown: 10,
        cat: 'games',
        botpermissions: ["SEND_MESSAGES", "EMBED_LINKS", ],
        async execute(message, args, client) {
            const lang = await message.translate("QUIZ_LIST")
            const dispo = await CustomsQuizs.find({ serverID: message.guild.id })
            if (dispo.length == 0) return message.errorMessage(lang.no)
            if (dispo.length < 8) {
                return message.channel.send({
                            embeds: [{
                                        color: message.guild.settings.color,
                                        title: lang.title,
                                        description: `${dispo.map(emoji => `**${emoji.question}** \n${lang.answer} : \`${emoji.reponse}\``).join("\n")}`,
                        footer: {
                            text: "Page 1/1"
                        },
                        timestamp: new Date()
                    }]
                }
            )
        } else {
            let i0 = 0;
        let i1 = 8;
        let page = 1;
        let description = `${lang.title}\n\n`+
        dispo.map(emoji => `**${emoji.question}** \n${lang.answer} : \`${emoji.reponse}\``).slice(0,8).join("\n");
    
       
        const embed = new Discord.MessageEmbed()
        .setColor(message.guild.settings.color)
            .setTitle(`${lang.title} ${page}/${Math.ceil(dispo.length / 8)}`)
            .setDescription(description)
            .setAuthor(`${message.author.username}`, message.author.displayAvatarURL({ dynamic: true, size: 512 }))
            .setFooter(message.client.footer, message.client.user.displayAvatarURL({ dynamic: true, size: 512 }))

    
        const msg = await message.reply({ embeds: [embed],allowedMentions: { repliedUser: false }
 });
            
        await msg.react("⬅");
        await msg.react("➡");
    
        const c = msg.createReactionCollector((_reaction, user) => user.id === message.author.id);
    
        c.on("collect", async reaction => {
            if(reaction.emoji.name === "⬅") {
                i0 = i0 - 8;
                i1 = i1 - 8;
                page = page - 1
    
                if(i0 < 0) return;
                if(page < 1) return;
    
                let description = `${lang.title} \n\n`+
        dispo.map(emoji => `**${emoji.question}** \n${lang.answer} : \`${emoji.reponse}\``).slice(i0,i1).join("\n");
    
                embed.setTitle(`Page : ${page}/${Math.ceil(dispo.length / 8)}`)
                    .setDescription(description);
    
                msg.edit({ embeds: [embed] });
            }
    
            if(reaction.emoji.name === "➡") {
                i0 = i0 + 8;
                i1 = i1 + 8;
                page = page + 1
    
                if(i1 > dispo.length + 8) return;
                if(i0 < 0) return;
    
                let description = `${lang.title} \n\n`+
        dispo.map(emoji => `**${emoji.question}** \n${lang.answer} : \`${emoji.reponse}\``).slice(i0,i1).join("\n");
    
                embed.setTitle(`Page: ${page}/${Math.ceil(dispo.length / 8)}`)
                    .setDescription(description);
    
                msg.edit({ embeds: [embed] });
            }
    
            await reaction.users.remove(message.author.id);
        })
    }

    },
};