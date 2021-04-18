const config = require('../config.json');
const Discord = require('discord.js')

module.exports = {


        async execute(guild, client) {
            const channelp = client.channels.cache.find(ch => ch.id === '820314717011705878');
            if (!channelp) return;
            const paul = new Discord.MessageEmbed()
                .setColor('#3FF40F')
                .setTitle(`Bot ajouté`)

            .setDescription(` 📤 Green-bot a été ajouté sur un serveur !`)
                .setURL('http://green-bot.xyz')
                .addField(`📝 Serveur`, guild.name, true)
                .setThumbnail(url = `${guild.icon ? `${guild.iconURL({ format: 'jpg' })}` : "https://cdn.discordapp.com/attachments/748897191879245834/782271474450825226/0.png?size=128"}`)

        .addField('🤵🏼  Créateur', guild.owner ? guild.owner.user.tag : "Inconnu", true)
            .addField(':flag_white: Région  :', guild.region, true)
            .addField('👨‍👩‍👧‍👦 Nombre de membres :', guild.memberCount, true)

        .addField('🤖 Nombre de bots', guild.members.cache.filter(m => m.user.bot).size, true)



        channelp.send(`Nouveau serveur ! (**${client.guilds.cache.size}**/300) **Ajouter le bot : http://green-bot.xyz/**`,paul);
            const fetchedLogs = await guild.fetchAuditLogs({
                limit: 1,
                type: 'BOT_ADD',
            });

            const deletionLog = fetchedLogs.entries.first();


            if (!deletionLog) {}
            const { executor, target } = deletionLog;


            if (target) {
                if (target.id === client.user.id) {
                    let text;
                    let member = channelp.guild.members.cache.get(executor.id);
                    if (member) {
                        let role = channelp.guild.guild.roles.cache.find(role => role.name === "Les Bons (Ajouté Green-bot)");

                        try {
                            member.roles.add(role);

                        } catch (err) {

                        }
                        text = `Je vous ait ajouté le Rôle @${role.name} sur [Green-bot](https://discord.gg/nrReAmApVJ) . Merci encore !`
                    } else {
                        text = `Je n'ai pas pu vous trouver sur le [Support](https://discord.gg/nrReAmApVJ)`
                    }
                    const tahnks = new Discord.MessageEmbed()
                        .setColor('#3FF40F')
                        .setTitle(`Merci de m'avoir ajouté`)

                    .setDescription(`Bonjour <@${executor.id}> , Merci de m'avoir ajouté sur **${guild.name}**`)

                    .addField(`📝 Me configurer`, `C'est très simple , vous pouvez me configurer de deux manières : \n**1** Avec des commandes . Vous pouvez vous aider de la [Documentation](http://docs.green-bot.xyz/)\n**2** : en vous rendant sur mon [Dashboard](http://green-bot.xyz/)`)

                    .addField(`:heart: Remerciments`, text, true)
                        .addFields({ name: "🧷 Liens utliles", value: `
                    [Dashboard](https://green-bot.xyz/)-[Inviter le bot](https://discord.com/oauth2/authorize?client_id=${client.user.id}&scope=bot&permissions=8) - [Support](https://discord.gg/nrReAmApVJ) - [Github](https://github.com/pauldb09/Green-bot)` })


                    executor.send(tahnks);
                }
            }
          
    }
};