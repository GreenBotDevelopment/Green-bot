const Discord = require('discord.js');
const premiumDB = require('../../database/models/premium');
const guild = require('../../database/models/guild');
const guildData = require('../../database/models/guildData');
module.exports = {
    name: 'premium',
    description: 'Affiche le statut du premium du serveur ou du votre .',
    cat: 'utilities',
    usage: 'give',

    exemple: 'give',
    async execute(message, args) {
        const translation = await message.translate("PREMIUM_COMMAND");
        if (!args.length) {
            const premium = await premiumDB.findOne({ userID: message.author.id })
            let embed = new Discord.MessageEmbed()
                .setAuthor(`${message.author.username}`, message.author.displayAvatarURL({ dynamic: true, size: 512 }))
                .setColor("#F0B02F")
                .setTitle(`Premium`)
                .setDescription(translation.title)
                .addField(translation.desc1Title, `${message.guild.premium ? translation.desc1Desc1.replace("{user}",message.guild.premiumuserID):translation.desc1Desc2}`)
                .addField(translation.desc2Title, `${premium ? translation.desc2Desc1.replace("{guild}",message.guild.name).replace("{prefix}",message.guild.settings.prefix):translation.desc2Desc2}`)
                .setThumbnail(url = message.client.user.displayAvatarURL({ dynamic: true, size: 512 }))
                .setFooter(message.client.footer, message.client.user.displayAvatarURL({ dynamic: true, size: 512 }))
            message.reply({
                embeds: [embed],
                allowedMentions: { repliedUser: false }
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
        if (args[0].toLowerCase() === "give") {
            const premium = await premiumDB.findOne({ userID: message.author.id })
            if (!premium) return message.errorMessage(translation.NotHave)
            if (message.guild.premium) return message.errorMessage(translation.Already.replace("{prefix}", message.guild.settings.prefix))
            const newchannel = await guildData.findOneAndUpdate({ serverID: message.guild.id, }, { $set: { premium: true, premiumUserID: message.author.id } }, { new: true });
            message.guild.premium = true;
            message.guild.premiumuserID = message.author.id;
            message.succesMessage(translation.succes.replace("{guild}", message.guild.name))
        } else {
            const premium = await premiumDB.findOne({ userID: message.author.id })
            let embed = new Discord.MessageEmbed()
                .setAuthor(`${message.author.username}`, message.author.displayAvatarURL({ dynamic: true, size: 512 }))
                .setColor("#F0B02F")
                .setTitle(` Premium`)
                .setDescription(translation.title)
                .addField(translation.desc1Title, `${message.guild.premium ? translation.desc1Desc1.replace("{user}",message.guild.premiumuserID):translation.desc1Desc2}`)
                .addField(translation.desc2Title, `${premium ? translation.desc2Desc1.replace("{guild}",message.guild.name).replace("{prefix}",message.guild.settings.prefix):translation.desc2Desc2}`)
                .setThumbnail(url = message.client.user.displayAvatarURL({ dynamic: true, size: 512 }))
                .setFooter(message.client.footer, message.client.user.displayAvatarURL({ dynamic: true, size: 512 }))
            message.reply({
                embeds: [embed],
                allowedMentions: { repliedUser: false }
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
    },
};