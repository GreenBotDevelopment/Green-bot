const emoji = require('../../emojis.json')
const Discord = require('discord.js');
const ChannelModel = require('../../database/models/guild');
const sugg = require('../../database/models/sugg');

module.exports = {
    name: 'suggest',
    description: 'Fait une suggestion si le système est activé sur le serveur',
    aliases: ["suggestion", "sugg"],
    usage: '<contenu>',
    args: true,
    exemple: 'un salon pour les gifs !',
    cat: 'utilities',
    guildOnly: true,

    async execute(message, args) {
        let reason = args.join(" ");

        let channeldb = await ChannelModel.findOne({ serverID: message.guild.id, reason: `sugg` })
        if (!channeldb) return message.errorMessage(`Le système de suggestions n'est pas activé sur ce serveur !`)
        else {
            let suggs = await sugg.find({ serverID: message.guild.id })

            const paul = new Discord.MessageEmbed()
                .setTitle(`Suggestion #${suggs.length || '1'}`)
                .addField('Etat', `En attente d'approbation`,true)
   .addField('Auteur', message.author,true)
                .addField('Contenu', reason)
             
                .setFooter(message.client.footer)
                .setColor("#F0F010")
            let suggc = message.guild.channels.cache.get(channeldb.content)
            if (!suggc) return message.errorMessage(`Je n'arrive pas à trouver le salon <#${channeldb.content}>... vérifiez mes permissions ou si le salon existe encore !`)
            suggc.send(paul).then(function(m) {
                m.react('✅');
                m.react('➖');
                m.react('❌');
                const verynew = new sugg({
                    autorID: message.author.id,
                    messageID: m.id,
                    serverID: m.guild.id,
                    content: reason,
                    Date: new Date,
                }).save()
                message.succesMessage(`Suggestion envoyée avec succès dans <#${channeldb.content}>`);

            })
        }


    },
};
