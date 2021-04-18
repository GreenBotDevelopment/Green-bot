const Discord = require('discord.js');
const guild = require('../../database/models/guild');

const quizs = require('../../quiz.json');
const QuizBD = require('../../database/models/quiz');
const CustomsQuizs = require('../../database/models/CustomsQuizs');
const emoji = require('../../emojis.json')

module.exports = {
        name: 'quiz-list',
        description: 'Donne la liste des quizs personnalisés du serveur',
        aliases: ['quizs', 'questionnaire'],
        cooldown: 10,
        cat: 'quiz',
        botpermissions: ["SEND_MESSAGES", "EMBED_LINKS", ],
        async execute(message, args, client) {
            const dispo = await CustomsQuizs.find({ serverID: message.guild.id })

            if (dispo.length == 0) return message.errorMessage(`Ce serveur n'a pas encore créer de quizs`)



            if (dispo.length < 8) {
                return message.channel.send({
                            embed: {
                                color: message.client.color,
                                title: "Liste des Quiz",
                                url: "http://green-bot.xyz",
                                description: `${dispo.map(emoji => `**${emoji.question}** \nRéponse : \`${emoji.reponse}\``).join("\n")}`,
                        footer: {
                            text: "Page 1/1"
                        },
                        timestamp: new Date()
                    }
                }
            )
        } else {
            let i0 = 0;
        let i1 = 8;
        let page = 1;
        let description = `Quiz du serveur (${dispo.length} sons) \n\n`+
        dispo.map(emoji => `**${emoji.question}** \nRéponse : \`${emoji.reponse}\``).slice(0,8).join("\n");
    
       
        const embed = new Discord.MessageEmbed()
        .setColor(message.client.color)
            .setTitle(`Quiz du serveur ${page}/${Math.ceil(dispo.length / 8)}`)
            .setDescription(description)
          
    
        const msg = await message.channel.send(embed);
            
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
    
                let description = `Quiz du serveur (${dispo.length} sons) \n\n`+
        dispo.map(emoji => `**${emoji.question}** \nRéponse : \`${emoji.reponse}\``).slice(i0,i1).join("\n");
    
                embed.setTitle(`Page : ${page}/${Math.ceil(dispo.length / 8)}`)
                    .setDescription(description);
    
                msg.edit(embed);
            }
    
            if(reaction.emoji.name === "➡") {
                i0 = i0 + 8;
                i1 = i1 + 8;
                page = page + 1
    
                if(i1 > dispo.length + 8) return;
                if(i0 < 0) return;
    
                let description = `Quiz du serveur (${dispo.length} sons) \n\n`+
        dispo.map(emoji => `**${emoji.question}** \nRéponse : \`${emoji.reponse}\``).slice(i0,i1).join("\n");
    
                embed.setTitle(`Page: ${page}/${Math.ceil(dispo.length / 8)}`)
                    .setDescription(description);
    
                msg.edit(embed);
            }
    
            await reaction.users.remove(message.author.id);
        })
    }

    },
};