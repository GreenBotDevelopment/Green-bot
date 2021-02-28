const Discord = require('discord.js');
const emoji = require('../../emojis.json')
const ms = require('ms');
const sugg = require('../../database/models/sugg');
const ChannelModel = require('../../database/models/guild');

module.exports = {
    name: 'accept',
    description: 'Accepte une suggestion',
    aliases: ['accept-sugg', 'sugg-accept'],
    guildOnly: true,
    args: true,
    usage: '<id>',
    exemple: '447357094895550474',
    cat: 'moderation',
    permissions: ['MANAGE_GUILD'],
    botpermissions: ["SEND_MESSAGES", "EMBED_LINKS", ],
    async execute(message, args, client) {
        let channeldb = await ChannelModel.findOne({ serverID: message.guild.id, reason: `sugg` })
        if (!channeldb) return message.errorMessage(`Le système de suggestions n'est pas activé sur ce serveur !`)
        else {
            const messageID = args[0];
            if (!messageID) {
                return message.errorMessage(`Veuillez fournir un ID de message valide...`)
            }
            let suggChannel = message.guild.channels.cache.get(channeldb.content)
            if (!suggChannel) return message.errorMessage(`Je n'arrive plus à trouver le salon des suggestions , veuillez le reconfigurer`)
            let suggM = suggChannel.messages.fetch(messageID).then(async msg => {
                    if (msg.partial) await msg.fetch()
                    let findReal = await sugg.findOne({ serverID: message.guild.id, messageID: messageID })
                    if (!findReal) return message.errorMessage(`Ce message n'est pas une suggestion`)
                    const embed = new Discord.MessageEmbed()
                        .setTitle(`Suggestion`)
                        .addField('Etat', `Approuvée par **${message.author.username}**`,true)
.addField('Auteur', `<@${findReal.autorID}>`,true)

                        .addField('Contenu', findReal.content)
                                               .setFooter(message.client.footer)

                    .setColor(message.client.color)
                    msg.edit(embed)
                    message.succesMessage(`Suggestion approuvée avec succès . [Aller à la suggestion](${msg.url})`)
                })
                .catch(err => {
                    if (!suggM) return message.errorMessage(`Il n'y a aucun message avec cet ID sur ce serveur`)

                })


        }

    },
};