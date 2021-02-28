const Discord = require('discord.js');
const moment = require('moment')
const guild = require('../../database/models/guild');
const backup = require('../../database/models/backup');
const sugg = require('../../database/models/sugg');

module.exports = {
    name: 'botinfo',
    description: 'Affiche des informations concernant le bot.',
    aliases: ['stats', 'bi', 'botinfos'],
    cat: 'utilities',

    async execute(message, args) {
        let commandOnSErver = await guild.find({ serverID: message.guild.id, reason: `command` })
        let commands = await guild.find({ reason: `command` })
        const currentGiveaways = message.client.manager.giveaways.length;
        const check = await backup.find({})
        let suggs = await sugg.find({})

        const embed = new Discord.MessageEmbed()

        .setAuthor(`Statistiques de ${message.client.user.tag}`, message.client.user.displayAvatarURL())
            .setDescription(`
            **${message.client.user.username}** Vient du bot [\`Green-bot\`](https://github.com/pauldb09/Green-bot/) Un bot open source créer par [\`Pauldb09\`](https://github.com/pauldb09).

           🆔\`Identifiant\` : **${message.client.user.id}**
           👤\`Compte Crée le :\` : **${moment(message.client.user.createdTimestamp).locale('fr').format('LT ,')} ${moment(message.client.user.createdTimestamp).locale('fr').format('LL, ')} ${moment(message.client.user.createdTimestamp).locale('fr').fromNow()}**
           ⏺\`Bot certifié ? :\` : **Oui **
           



           `)
            .addField(`🔢 __Statistiques :__`, `
            🖥 \`Serveurs\` : **${message.client.guilds.cache.size}**
            👨‍👩‍👦\`Utilisateurs\` : **${message.client.users.cache.size}**
            🧾\`Commandes\` : **${message.client.commands.size}**
            🆚\`Version\` : **1.4.8**
            `, true)

        .addField(`🤖 __Informations :__`, `
            📉\`Language\` : **Discord.js**
            👨🏼‍💻\`Développeur\` : **<@${message.client.owner}>**
            💾\`Base de données\` : **MongoDB**
            🖥\`Hébergeur\` : **AdkyNet**
            `, true)
            .addField(`📊 __Utilisation__`, `
            💻\`Personnes différentes ayant fait des commandes\` : **${commands.length}** (**${commandOnSErver.length}** sur ce serveur)
            🎁\`Giveaways\` : **${currentGiveaways}**
            🥡\`Sauvegardes crées\` : **${check.length}**
            💡\`Suggestions\` : **${suggs.length}**
            `)
            .setColor(message.client.color)
            .setFooter(message.client.footer)
            .addFields({ name: "Liens utliles", value: `
                [Dashboard](http://green-bot.tk/)-[Inviter le bot](https://discord.com/oauth2/authorize?client_id=${message.client.user.id}&scope=bot&permissions=8) - [Support](https://discord.gg/nrReAmApVJ) - [Github](https://github.com/pauldb09/Green-bot) - [Documentation](https://docs.green-bot.xyz/)` })


        message.channel.send(embed)


    },
};
