const Discord = require('discord.js');
const Welcome = require('../../database/models/Welcome')
const emoji = require('../../emojis.json')

module.exports = {
    name: 'count-channel',
    description: 'Défini le salon du compteur',
    aliases: ['countchannel', 'setcount', 'count'],
    cat: 'configuration',
    args: 'channel',
    guildOnly: true,
    usage: '#salon',
    exemple: '#count',
    permissions: ['MANAGE_GUILD'],
    async execute(message, args) {
        if (args[0] === 'disable') {
            const verify = await Welcome.findOne({ serverID: message.guild.id, reason: `count` })
            if (verify) {
                const newchannel = await Welcome.findOneAndDelete({ serverID: message.guild.id, reason: `count` });


                return message.succesMessage(`Le salon du compteur a bien été désactivé !`)
            } else {
                return message.errorMessage(`Vous devez avoir une configuration pour la supprimer`)
            }

        }
        if (args[0] === 'wiew') {
            const verify = await Welcome.findOne({ serverID: message.guild.id, reason: `count` })
            if (verify) {
                const old = await Welcome.findOne({ serverID: message.guild.id, reason: `old_number` })

                return message.succesMessage(`Le compteur fonctionne bien sur ce serveur .\n**Dernier Nombre**: ${old.channelID}\n**Salon** : <#${verify.channelID}>`)
            } else {
                return message.errorMessage(`Le salon du compteur n'est pas activé sur ce serveur.. Faites \`counter #channel\``)
            }

        }
        let channel = message.mentions.channels.first() || message.guild.channels.cache.get(args[0]);
        if (!channel || channel.type != 'text' || !channel.viewable) {
            return message.errorMessage(`Le salon fourni n'est pas un salon valide , il n'est pas visible pas le bot ou pas du bon type... `);
        }

        const verify = await Welcome.findOne({ serverID: message.guild.id, reason: `count` })
        if (verify) {
            const newchannel = await Welcome.findOneAndUpdate({ serverID: message.guild.id, reason: `count` }, { $set: { channelID: channel.id, reason: `count` } }, { new: true });

            return message.succesMessage(`Le salon du compteur a bien été mis à jour : \`#${channel.name}\`, tout message incohérent dans ce salon sera désormais supprimé !`)

        } else {
            const verynew = new Welcome({
                serverID: `${message.guild.id}`,
                channelID: `${channel.id}`,
                reason: 'count',
            }).save();
            channel.send(`<:green_channel:824304682188537856> **Salon du compteur**\nCe salon a été défini comme le salon du compteur ! tout message n'étant pas un nombre ou ne suivant pas la suite logique sera automatiquement supprimé. \nMerci de resprecter le règlement`)

            return message.succesMessage(`Le salon du compteur a bien été défni : \`#${channel.name}\` , tout message incohérent dans ce salon sera désormais supprimé !`)
        }




    },
};