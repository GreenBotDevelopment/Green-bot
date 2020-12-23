const config = require('../config.json');
const Discord = require('discord.js')
module.exports = {


    async execute(guild ,client) {
        const owner = guild.owner.user
        let paule = new Discord.MessageEmbed()
            .setColor('#303136')
            .setTitle(`Merci de m'avoir ajouté`)

        .setDescription(`Vous pouvez voir la liste de mes commandes en tapant \`*help\`. `)
            .addField(`Me configurer`, `c'est très simple , il suffit de vous rendre sur le [Dashboard](http://green-bot.tk/)`)

        .addField('Une question ?', 'Rejoignez le [Serveur support](https://discord.gg/bCK2FrJfAG)')



        owner.send(paule)
        client.user.setActivity(` *help | ${client.guilds.cache.size} serveurs.`);
        const channelp = client.channels.cache.find(ch => ch.id === '790617423346270248');
        if (!channelp) return;
        const paul = new Discord.MessageEmbed()
            .setColor('#3FF40F')
            .setTitle(`Bot ajouté`)

        .setDescription(` 📤 Green a été ajouté sur un serveur !`)
            .addField(`Serveur`, guild.name, true)
            .setThumbnail(url = `${guild.iconURL({ format: 'jpg' })}`)

        .addField(':eight_pointed_black_star:  Créateur', guild.owner.user.tag, true)
            .addField(':flag_white: Région  :', guild.region, true)
            .addField('🔢 Nombre de membres :', guild.memberCount, true)

        .addField('Créée le :', guild.createdAt, true)

        .setTimestamp()


        channelp.send(paul);
    }
};
