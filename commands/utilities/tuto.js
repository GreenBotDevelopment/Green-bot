const emoji = require('../../emojis.json')
const Discord = require('discord.js');
const fetch = require("node-fetch");
const axios = require('axios')
module.exports = {
    name: 'tuto',
    description: 'Recherche un Tuto sur tutos du Web',
    aliases: ['tutoriel'],
    usage: '<nom>',
    args: true,
    exemple: 'barre de recherche',
    cat: 'utilities',


    execute(message, args) {
        const axios = require('axios')
        const uri = `http://tutos-du-web.ml/api/?q=${encodeURIComponent(
            args.join(" ")
          )}`

        axios
            .get(uri)
            .then((req) => {
                const { data } = req
                if (data && !data.error) {
                    const embede = new Discord.MessageEmbed()
                        .setColor(message.client.color)
                        .setFooter(message.client.footer)
                        .setTitle(`Résultats pour : \`${args.join(" ")}\``)
                        .setURL(uri)
                        .addField('`🗒` Nom', data.nom)

                    .addField('`⛺` Description', data.description)
                        .addField('`👱🏼‍♂️` Autheur', data.autheur, true)
                        .addField('`🥜` Catégorie', data.catégorie, true)

                    .addField('`👀` Vues', data.vues, true)
                        .addField('🗓 Date de création', data.date, true)

                    message.channel.send(embede)
                } else {
                    message.channel.send(`${emoji.error} - Je n'ai trouvé aucun tuto sur Tutos du web pour : \`${args.join(" ")}\``)
                }
                console.log(data)

            })
            .catch((err) => {
                message.channel.send(`${emoji.error} - Je n'ai trouvé aucun tuto sur Tutos du web pour : \`${args.join(" ")}\``)
            })





    },
};
