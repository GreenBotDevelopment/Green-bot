const Discord = require('discord.js');
const guild = require('../../database/models/guild');
module.exports = {
        name: 'serverinfo',
        description: 'Donne toutes le informations disponibles sur le serveur',
        aliases: ['si', 'serveur-info', 'serv-info'],
        cat: 'utilities',
        async execute(message, client) {
            if (message.guild.memberCount !== message.guild.members.cache.size) await message.guild.members.fetch()

            const embed = new Discord.MessageEmbed()

            .setAuthor(`${message.author.username}`, message.author.displayAvatarURL({ dynamic: true, size: 512 }))
                .setTitle(message.guild.name);
            if (message.guild.description) embed.setDescription(message.guild.description);
            embed.setColor(message.client.color)
            embed.addField(`Membres [${message.guild.memberCount}]`, `
        <:green_members:811167997023485973> **Compte:** ${message.guild.memberCount}/${message.guild.maximumMembers}
        <:bot1:830436668997500928> **Bots:** ${message.guild.members.cache.filter(m => m.user.bot).size}
        <:membres:830432144211705916> **Staff:** ${message.guild.members.cache.filter(m => m.permissions.has(["BAN_MEMBERS", "MANAGE_MESSAGES", "KICK_MEMBERS", "MANAGE_GUILD", "ADMINISTRATOR"])).size}
        <:663041911753277442:830432143800532993> **Statut des membres:** <:729074551966924932:830437777388470282> ${message.guild.members.cache.filter(m => ["dnd", "idle", "online"].includes(m.user.presence.status)).size} <:568120239213117487:830437777573019702> ${message.guild.members.cache.filter(m => m.user.presence.status === "offline").size}
`)
            embed.addField(`Global`, `
<:711041810098470913:830460210220630027> **Identifiant :** ${message.guild.id}
<:612058498108227586:830440548007018517> **Région :** ${message.guild.region.charAt(0).toUpperCase() + message.guild.region.slice(1)}
<:green_channel:824304682188537856> **Salons :** ${message.guild.channels.cache.size}
<:ticket1:830440548237574165> Bannière: ${message.guild.banner ? `[lien](${message.guild.bannerURL({size: 1024})})` : "Aucune"}
<:nitro_gris_activ:830451169486700585> **Boosts** : ${message.guild.premiumSubscriptionCount} , \`Niveau ${message.guild.premiumTier} \`
<:676556759875190806:830437777338138635> **Owner** : \`${message.guild.owner ? message.guild.owner.user.tag : "Utilisateur Inconnu"}\` (<@!${message.guild.ownerID}>)
`)
embed.addField(`Autres`, `
<:membres:830432144211705916> **Rôles**: ${message.guild.roles.cache.size > 10 ? `${message.guild.roles.cache.map(x => `<@&${x.id}>`).slice(0,10 )} Et **${message.guild.roles.cache.size - 10}** autres rôles ` : message.guild.roles.cache.map(x => `<@&${x.id}>`)}
<:605031252403290123:830440547717742595> **Emojis**: ${message.guild.emojis.cache.size > 10 ? `${message.guild.emojis.cache.map(x => `${x}`).slice(0,10 )} Et **${message.guild.emojis.cache.size - 10}** autres rôles ` : message.guild.emojis.cache.map(x => `${x}`)}
`)
if(message.guild.splash) embed.setImage(url = message.guild.splashURL())
        embed.setThumbnail(message.guild.icon ? message.guild.iconURL({dynamic:true}) : "https://cdn.discordapp.com/attachments/748897191879245834/782271474450825226/0.png?size=128")

        embed.setFooter(message.client.footer, message.client.user.displayAvatarURL({ dynamic: true, size: 512 }))


        message.channel.send(embed)





    },
};