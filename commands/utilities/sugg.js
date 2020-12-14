const emoji = require('../../emojis.json')
const Discord = require('discord.js');
const ChannelModel = require('../../database/models/guild');
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
        if (!channeldb) return message.channel.send(`${emoji.error} Le système de suggestions n'est pas activé sur ce serveur !`)
        else {

            const paul = new Discord.MessageEmbed()
                .setTitle('💡 Suggestion !')
                .setDescription(reason)
                .setFooter(`par : ${message.author.tag}`)
                .setColor("RANDOM")
            let sugg = message.guild.channels.cache.get(channeldb.content)
            if (!sugg) return message.channel.send(`${emoji.error} Je n'arrive pas à trouver le salon <#${channeldb.content}>... vérifiez mes permissions ou si le salon existe encore !`)
            sugg.send(paul).then(function(m) {
                m.react('✅');
                m.react('➖');
                m.react('❌');
                message.channel.send(`${emoji.succes} Suggestion envoyée avec succès dans <#${channeldb.content}>`);

            })
        }


    },
};