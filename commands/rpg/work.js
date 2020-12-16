const fetch = require("node-fetch");
const Discord = require('discord.js');
const emoji = require('../../emojis.json')

const adventure = require("../../database/models/adventure");
const UserRpg = require("../../database/models/userrpg");
module.exports = {
    name: 'work',
    description: 'effectue du travail en fonction de votre profil',
    cooldown: 10000,
    botpermission: ['EMBED_LINKS'],
    cat: 'rpg',
    adventure: true,
    async execute(message, args) {

        let advdb = await adventure.findOne({ UserID: message.author.id, active: true })

        limit = 15;
        const n = Math.floor(Math.random() * limit + 1);
        const reportEmbed = new Discord.MessageEmbed()

        .setAuthor(`TRAVAIL[ ${advdb.profil}]`)

        .setDescription(`Le soileil est écrasant mais vous avez travaillé avec acharnement et votre maître vous donne votre salaire , bien mérité
        **Maitre** : Je suis fier de toi ${message.author.username} , tu as bien travaillé !
        **${message.author.username}**: merci maître !
        **Maitre** : Voici ta paye ${n} Credits.
         
        Voulez vous contester la paye ou accepter ce que vous donne votre maître ?
        ✅ : accepter la paye.
        😒 : contester.
        Attention , choissisez bien.....

        `)


        .setFooter(message.client.footer)

        .setColor(message.client.color);
        message.channel.send(reportEmbed).then(m => {
            m.react("✅")
            m.react("😒")
         
        });
        const filtro = (reaction, user) => {
            return user.id == message.author.id;
        };
        m.awaitReactions(filtro, {
            max: 1,
            time: 40000,
            errors: ["time"]
        }).catch(() => {
            const errorEmbed = new Discord.MessageEmbed()

         
    
            .setDescription(`${emoji.error} Erreur : temps écoulé ! `)
    
    
            .setFooter(message.client.footer)
    
            .setColor("#982318");
            m.edit(errorEmbed);
        }).then(coleccionado => {

            const reaccion = coleccionado.first();
            if (reaccion.emoji.name === "✅") {

            }
            if (reaccion.emoji.name === "😒") {

            }
        });

    },
};
