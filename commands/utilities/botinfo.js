const Discord = require('discord.js');
const moment = require('moment')
module.exports = {
    name: 'botinfo',
    description: 'Affiche des informations concernant le bot.',
    aliases: ['stats', 'bi', 'botinfos'],
    cat: 'utilities',

    async execute(message, args) {

        const embed = new Discord.MessageEmbed()

        .setAuthor(`Statistiques de ${message.client.user.tag}`, message.client.user.displayAvatarURL())
            .setDescription(`
            **${message.client.user.username}** Vient du bot [\`Green-bot\`](https://github.com/pauldb09/Green-bot/) Un bot open source créer par [\`Pauldb09\`](https://github.com/pauldb09).


           🆔\`Identifiant\` : **${message.client.user.id}**
           👤\`Compte Crée le :\` : **${moment(message.client.user.createdTimestamp).locale('fr').format('LT ,')} ${moment(message.client.user.createdTimestamp).locale('fr').format('LL, ')} ${moment(message.client.user.createdTimestamp).locale('fr').fromNow()}**
           ⏺\`Bot certifié ? :\` : **${message.client.user.verified ? 'Non 😕': 'oui 😹'}**
           



           `)
            .addField(`🔢 __Statistiques :__`, `
            🖥 \`Serveurs\` : **${message.client.guilds.cache.size}**
            👨‍👩‍👦\`Utilisateurs\` : **${message.client.users.cache.size}**
            🧾\`Commandes\` : **${message.client.commands.size}**
            🆚\`Version\` : **1.4.8**
            `)
            .addField(`🤖 __Informations :__`, `
            💻\`Language\` : **Discord.js**
            👨🏼‍💻\`Développeur\` : **<@${message.client.owner}>**
            💾\`Base de données\` : **MongoDB**
           \`Merci à :\` : **Universe Tech YT#0077** , **!Zerio.js#0001**
            `)

        .setColor(message.client.color)
            .setFooter(message.client.footer)
            .addFields({ name: "Liens utliles", value: `
                [Dashboard](http://green-bot.tk/)-[Inviter le bot](https://discord.com/oauth2/authorize?client_id=${message.client.user.id}&scope=bot&permissions=8) - [Support](https://discord.gg/nrReAmApVJ) - [Github](https://github.com/pauldb09/Green-bot)` })


        message.channel.send(embed)


    },
};
