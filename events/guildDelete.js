const config = require('../config.json');
const Discord = require('discord.js')

module.exports = {


        async execute(guild, client) {
            const channelp = client.channels.cache.find(ch => ch.id === '820314717011705878');
            if (!channelp) return;
            const paul = new Discord.MessageEmbed()
                .setColor('#F01B0D')
                .setTitle(`Bot Expulsé`)

            .setDescription(` 📤 Green-bot a quitté un serveur !`)
                .setURL('http://green-bot.xyz')
                .addField(`📝 Serveur`, guild.name, true)
                .setThumbnail(url = `${guild.icon ? `${guild.iconURL({ format: 'jpg' })}` : "https://cdn.discordapp.com/attachments/748897191879245834/782271474450825226/0.png?size=128"}`)

        .addField('🤵🏼  Créateur', guild.owner ? guild.owner.user.tag : "Inconnu", true)
            .addField(':flag_white: Région  :', guild.region, true)
            .addField('👨‍👩‍👧‍👦 Nombre de membres :', guild.memberCount, true)

        .addField('🤖 Nombre de bots', guild.members.cache.filter(m => m.user.bot).size, true)



        channelp.send(`Serveur quitté ! (**${client.guilds.cache.size}**/300) **Ajouter le bot : http://green-bot.xyz/**`,paul);
          
          
    }
};