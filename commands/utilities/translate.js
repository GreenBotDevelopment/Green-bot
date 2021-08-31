const Discord = require('discord.js');
const fetch = require("node-fetch");
const { parse } = require("twemoji-parser");
const { EmojiAPI } = require("emoji-api");
const translate = require("@vitalets/google-translate-api");
module.exports = {
        name: 'translate',
        description: 'Translates the text gives in the desired language',
        aliases: ['traduction', 'tr'],
        usage: '<target language> <text>',
        uargs: true,
        exemple: 'en Bonjour',
        cat: 'utilities',
        guildOnly: true,
        async execute(message, args) {
            const lang = await message.translate("TRANSLATE")
            if (!args.length) {
                let embed = new Discord.MessageEmbed()
                    .setAuthor(`${message.author.username}`, message.author.displayAvatarURL({ dynamic: true, size: 512 }))
                    .setColor("#F0B02F")
                    .setTitle(`Translate`)
                    .setDescription(lang.argsTip)
                    .addField(`${message.guild.settings.lang === "fr" ? "`📜` Utilisation":"`📜` Use"}`, lang.use.replace("{prefix}", message.guild.settings.prefix).replace("{prefix}", message.guild.settings.prefix))
                    .addField('Permissions', lang.perms)
                    .setThumbnail(url = message.client.user.displayAvatarURL({ dynamic: true, size: 512 }))
                    .setFooter(message.client.footer, message.client.user.displayAvatarURL({ dynamic: true, size: 512 }))
                message.reply({ embeds: [embed],allowedMentions: { repliedUser: false }}).then((m) => {
                if (!message.channel.permissionsFor(message.guild.me).has("MANAGE_MESSAGES")) return;
                if (!message.channel.permissionsFor(message.guild.me).has("ADD_REACTIONS")) return;
                m.react("✅")
                const filter = (reaction, user) => reaction.emoji.name === '✅' && user.id === message.author.id;
                const collector = m.createReactionCollector({ filter, time: 1000000 });
                collector.on('collect', r => m.delete());
                collector.on('end', collected => m.reactions.removeAll());
            });
            return;
        }
        let target = args[0]
        if (!target) {
            let embed = new Discord.MessageEmbed()
            .setAuthor(`${message.author.username}`, message.author.displayAvatarURL({ dynamic: true, size: 512 }))
            .setColor("#F0B02F")
            .setTitle(`Translate`)
            .setDescription(lang.argsTip)
            .addField(`${message.guild.settings.lang === "fr" ? "`📜` Utilisation":"`📜` Use"}`, lang.use.replace("{prefix}", message.guild.settings.prefix).replace("{prefix}", message.guild.settings.prefix))
            .addField('Permissions', lang.perms)
            .setThumbnail(url = message.client.user.displayAvatarURL({ dynamic: true, size: 512 }))
            .setFooter(message.client.footer, message.client.user.displayAvatarURL({ dynamic: true, size: 512 }))
        message.reply({ embeds: [embed],allowedMentions: { repliedUser: false }}).then((m) => {
        if (!message.channel.permissionsFor(message.guild.me).has("MANAGE_MESSAGES")) return;
        if (!message.channel.permissionsFor(message.guild.me).has("ADD_REACTIONS")) return;
        m.react("✅")
        const filter = (reaction, user) => reaction.emoji.name === '✅' && user.id === message.author.id;
        const collector = m.createReactionCollector({ filter, time: 1000000 });
        collector.on('collect', r => m.delete());
        collector.on('end', collected => m.reactions.removeAll());
    });
    return;
        }
        if (target.length < 0 || target.length > 15) {
            let numberErr = await message.translate("MESSAGE_ERROR")
            return message.errorMessage(numberErr.replace("{amount}", "2").replace("{range}", "15"))
        }
        let text = args.slice(1).join(" ")
        if (!text) {
            let embed = new Discord.MessageEmbed()
            .setAuthor(`${message.author.username}`, message.author.displayAvatarURL({ dynamic: true, size: 512 }))
            .setColor("#F0B02F")
            .setTitle(`Translate`)
            .setDescription(lang.argsTip)
            .addField(`${message.guild.settings.lang === "fr" ? "`📜` Utilisation":"`📜` Use"}`, lang.use.replace("{prefix}", message.guild.settings.prefix).replace("{prefix}", message.guild.settings.prefix))
            .addField('Permissions', lang.perms)
            .setThumbnail(url = message.client.user.displayAvatarURL({ dynamic: true, size: 512 }))
            .setFooter(message.client.footer, message.client.user.displayAvatarURL({ dynamic: true, size: 512 }))
        message.reply({ embeds: [embed],allowedMentions: { repliedUser: false }
 }).then((m) => {
        if (!message.channel.permissionsFor(message.guild.me).has("MANAGE_MESSAGES")) return;
        if (!message.channel.permissionsFor(message.guild.me).has("ADD_REACTIONS")) return;
        m.react("✅")
        const filter = (reaction, user) => reaction.emoji.name === '✅' && user.id === message.author.id;
        const collector = m.createReactionCollector({ filter, time: 1000000 });
        collector.on('collect', r => m.delete());
        collector.on('end', collected => m.reactions.removeAll());
    });
    return;
        }
        if (text.length < 2 || text.length > 256) {
            let numberErr = await message.translate("MESSAGE_ERROR")
            return message.errorMessage(numberErr.replace("{amount}", "2").replace("{range}", "256"))
        }
        let loadingTest = await message.translate("LOADING")
        let msg = await message.channel.send(({ embeds: [new Discord.MessageEmbed().setColor(message.guild.settings.color).setDescription(loadingTest)] }))
        await translate(text, { to: target }).then((res) => {
            let embed = new Discord.MessageEmbed()
                .setAuthor(`${message.author.username}`, message.author.displayAvatarURL({ dynamic: true, size: 512 }))
                .setColor("#F0B02F")
                .setTitle(`\`${res.from.language.iso}\` ➟ \`${target}\`\n${res.text}\n`)
                .setFooter(message.client.footer, message.client.user.displayAvatarURL({ dynamic: true, size: 512 }))
            msg.edit({ embeds: [embed] })
        }).catch((error) => {
            msg.delete()
            message.errorMessage(lang.err.replace("{error}", error))
        });
    },
};