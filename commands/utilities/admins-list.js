const Discord = require('discord.js');
const Welcome = require('../../database/models/Welcome')
module.exports = {
    name: 'admins-list',
    description: 'Montre combien de personnes ont la permissions administrateur sur le serveur',
    cat: 'utilities',
    aliases: ['admins'],
    guildOnly: true,
    async execute(message, args) {
        const lang = await message.translate("ADMIN_LIST")
        if (message.guild.memberCount !== message.guild.members.cache.size) await message.guild.members.fetch()
        const u = message.guild.members.cache.filter(m => m.permissions.has("ADMINISTRATOR"));
        if (u.length < 10) {
            const embed = new Discord.MessageEmbed()
                .setAuthor(`${message.author.username}`, message.author.displayAvatarURL({ dynamic: true, size: 512 }))
                .setColor(message.guild.settings.color)
                .setDescription(lang.desc.replace("{size}", u.size))
                .addField(`${lang.title} (${u.size})`, u.map(x => `\`${x.user.tag}\``).join("\n").slice(0, 10), true)
                .setTitle(lang.name)
                .setFooter(message.client.footer, message.client.user.displayAvatarURL({ dynamic: true, size: 512 }))
            message.reply({
                embeds: [embed],
                allowedMentions: { repliedUser: false }
            })
            return
        } else {
            let i0 = 0;
            let i1 = 10;
            let page = 1;
            let description = `${lang.desc.replace("{size}", u.size)} \n\n` +
                u.map(x => `\`${x.user.tag}\``).slice(0, 10).join("\n");
            const embed = new Discord.MessageEmbed()
                .setColor(message.guild.settings.color)
                .setTitle(lang.name)
                .setDescription(description)
                .setThumbnail(url = message.client.user.displayAvatarURL({ dynamic: true, size: 512 }))
                .setFooter(message.client.footer, message.client.user.displayAvatarURL({ dynamic: true, size: 512 }))
            const msg = await message.reply({ embeds: [embed], allowedMentions: { repliedUser: false } });
            await msg.react("⬅");
            await msg.react("➡");
            const filter = (reaction, user) => user.id === message.author.id;
            const c = msg.createReactionCollector({ filter, time: 1000000 });
            c.on("collect", async reaction => {
                if (reaction.emoji.name === "⬅") {
                    i0 = i0 - 10;
                    i1 = i1 - 10;
                    page = page - 1
                    if (i0 < 0) return;
                    if (page < 1) return;
                    let description = `${lang.desc.replace("{size}", u.size)} \n\n` +
                        u.map(x => `\`${x.user.tag}\``).slice(i0, i1).join("\n");
                    embed.setTitle(`${lang.name} ${page}/${Math.ceil(u.length /10)}`)
                        .setDescription(description);
                    msg.edit({ embeds: [embed] });
                }
                if (reaction.emoji.name === "➡") {
                    i0 = i0 + 10;
                    i1 = i1 + 10;
                    page = page + 1
                    if (i1 > u.length + 10) return;
                    if (i0 < 0) return;
                    let description = `${lang.desc.replace("{size}", u.size)} \n\n` +
                        u.map(x => `\`${x.user.tag}\``).slice(i0, i1).join("\n");
                    embed.setTitle(`${lang.name} ${page}/${Math.ceil(u.length / 10)}`)
                        .setDescription(description);
                    msg.edit({ embeds: [embed] });
                }
                await reaction.users.remove(message.author.id);
            })
            c.on("end", async reaction => {
                msg.reactions.removeAll()
            })
        }
    },
};