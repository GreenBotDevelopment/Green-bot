const Discord = require('discord.js');
const birthday = require('../../database/models/birthday');
const moment = require("moment");
module.exports = {
        name: 'birthdays-list',
        description: 'Donne la liste des anniversaires du serveur',
        cooldown: 10,
        cat: 'games',
        botpermissions: ["SEND_MESSAGES", "EMBED_LINKS", ],
        async execute(message, args, client) {
            let loadingTest = await message.translate("LOADING")
            let msg1 = await message.channel.send({ embeds: [new Discord.MessageEmbed().setColor(message.guild.settings.color).setDescription(loadingTest)] })
            if (message.guild.memberCount !== message.guild.members.cache.size) await message.guild.members.fetch()
            let find = await birthday.find({})
            if (find.length !== 0) {
                let just = find.filter(c => message.guild.members.cache.get(c.userID))
                if (just.length == 0) return message.errorMessage(`${message.guild.settings.lang === "fr" ? `Il n'y a encore personne qui a défini un anniversaire dans ce serveur`:`No one has set a birthday in this server yet`}`)
                if (just.length < 10) {
                    let embed = new Discord.MessageEmbed()
                    .setAuthor(`${message.author.username}`, message.author.displayAvatarURL({ dynamic: true, size: 512 }))
                    .setColor(message.guild.settings.color)
                    .addField('List', `\n${just.map(a => `\`${message.guild.members.cache.get(a.userID).user.username}\` : ${moment(a.Date).locale(message.guild.settings.lang).format("Do MMMM")}`).join("\n")}`, true)
                    .setDescription(`${message.guild.settings.lang === "fr" ? `\`📚\` Faîtes \`${message.guild.settings.prefix}birthday\` pour modifier votre anniversaire`:`\`📚\` Do \`${message.guild.settings.prefix}birthday\` to change your birthday.`}`)
                    .setThumbnail(url = message.client.user.displayAvatarURL({ dynamic: true, size: 512 }))
                    .setFooter(message.client.footer, message.client.user.displayAvatarURL({ dynamic: true, size: 512 }))
            msg1.edit({ embeds: [embed] })
        }else{
            let i0 = 0;
            let i1 = 8;
            let page = 1;
            let description = `${message.guild.settings.lang === "fr" ? `\`📚\` Faîtes \`${message.guild.settings.prefix}birthday\` pour modifier votre anniversaire`:`\`📚\` Do \`${message.guild.settings.prefix}birthday\` to change your birthday.`}\n\n`+
            just.map(a => `\`${message.guild.members.cache.get(a.userID).user.username}\` : ${moment(a.Date).locale(message.guild.settings.lang).format("Do MMMM")}`).slice(0, 8).join("\n");
        
            const embed = new Discord.MessageEmbed()
            .setColor(message.guild.settings.color)
                .setTitle(`${message.guild.settings.lang === "fr" ? `Anniversaires`:`Birthdays`} ${page}/${Math.ceil(just.length / 8)}`)
                .setDescription(description)
                .setAuthor(`${message.author.username}`, message.author.displayAvatarURL({ dynamic: true, size: 512 }))

                .setFooter(message.client.footer, message.client.user.displayAvatarURL({ dynamic: true, size: 512 }))

        
            const msg = await   msg1.edit({ embeds: [embed] });
                
            await msg.react("⬅");
            await msg.react("➡");
        
  const filter = (reaction, user) => user.id === message.author.id;
            const c = msg.createReactionCollector({ filter, time: 1000000 });
        
            c.on("collect", async reaction => {
                if(reaction.emoji.name === "⬅") {
                    i0 = i0 - 8;
                    i1 = i1 - 8;
                    page = page - 1
        
                    if(i0 < 0) return;
                    if(page < 1) return;
        
                    let description = `${message.guild.settings.lang === "fr" ? `\`📚\` Faîtes \`${message.guild.settings.prefix}birthday\` pour modifier votre anniversaire`:`\`📚\` Do \`${message.guild.settings.prefix}birthday\` to change your birthday.`}\n\n`+
                    just.map(a => `\`${message.guild.members.cache.get(a.userID).user.username}\` : ${moment(a.Date).locale(message.guild.settings.lang).format("Do MMMM")}`).slice(i0, i1).join("\n");
                
                    embed.setTitle(`${message.guild.settings.lang === "fr" ? `Anniversaires`:`Birthdays`} ${page}/${Math.ceil(just.length / 8)}`)
                        .setDescription(description);
        
                    msg.edit({ embeds: [embed] });
                }
        
                if(reaction.emoji.name === "➡") {
                    i0 = i0 + 8;
                    i1 = i1 + 8;
                    page = page + 1
        
                    if(i1 > just.length + 8) return;
                    if(i0 < 0) return;
        
                    let description = `${message.guild.settings.lang === "fr" ? `\`📚\` Faîtes \`${message.guild.settings.prefix}birthday\` pour modifier votre anniversaire`:`\`📚\` Do \`${message.guild.settings.prefix}birthday\` to change your birthday.`}\n\n`+
                    just.map(a => `\`${message.guild.members.cache.get(a.userID).user.username}\` : ${moment(a.Date).locale(message.guild.settings.lang).format("Do MMMM")}`).slice(i0, i1).join("\n");
                
                    embed.setTitle(`${message.guild.settings.lang === "fr" ? `Anniversaires`:`Birthdays`} ${page}/${Math.ceil(just.length / 8)}`)
                        .setDescription(description);
        
                    msg.edit({ embeds: [embed] });
                }
        
                await reaction.users.remove(message.author.id);
            })
        }
    
    
        
               
        } else {

            return message.errorMessage(`${message.guild.settings.lang === "fr" ? `Il n'y a encore personne qui a défini un anniversaire dans ce serveur`:`No one has set a birthday in this server yet`}`)
        }
    },
};