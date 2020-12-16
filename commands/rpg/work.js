const fetch = require("node-fetch");
const Discord = require('discord.js');
const emoji = require('../../emojis.json')
const math = require('mathjs');
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

        .setAuthor(`TRAVAIL [${advdb.profil}]`)

        .setDescription(`Le soleil est écrasant ☀ mais vous avez travaillé avec acharnement et votre maître vous donne votre salaire , bien mérité
        **Maitre** : Je suis fier de toi ${message.author.username} , tu as bien travaillé !
        **${message.author.username}**: merci maître !
        **Maitre** : Voici ta paye :  ${n} crédits.
         
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
            }).then(async(coleccionado) => {

                const reaccion = coleccionado.first();
                if (reaccion.emoji.name === "✅") {
                    limit = 5;
                    const exp = Math.floor(Math.random() * limit + 1);
                    if (exp === 2) {
                        const embed = new Discord.MessageEmbed()


                        .setAuthor(`TRAVAIL [suite]`)

                        .setDescription(`
                     **${message.author.username}**: merci maître , je prend cette paye volontiers !
                    **Maitre** : tu es un bon serviteur et , pour te récompenser , je vais te donner ${n + 5} crédits.
                    **${message.author.username}**: comment vous remercier maitre !
                    **Maitre** : en continuant ton travail.
                    ${emoji.succes} ${n + 5} crédits on étés ajoutés à votre compte avec succès
                    `)


                        .setFooter(message.client.footer)

                        .setColor(message.client.color);
                        let final = n + 5;
                        let useldb = await UserRpg.findOne({ UserID: message.author.id })
                        if (useldb) {
                            let act;
                            if (useldb.credits) {
                                act = useldb.credits;
                            } else {
                                act = 0;
                            }
                            let newfric = math.evaluate(`${act} + ${final}`);
                            const newcbio = await UserRpg.findOneAndUpdate({ UserID: message.author.id }, { $set: { credits: newfric } }, { new: true });

                        } else {
                            const verynew = new UserRpg({
                                UserID: `${message.author.id}`,
                                credits: `${final}`

                            }).save();
                        }
                        m.delete();

                        message.channel.send(embed);
                    } else {
                        const embed = new Discord.MessageEmbed()


                        .setAuthor(`TRAVAIL [suite]`)

                        .setDescription(`
                     **${message.author.username}**: merci maître , je prend cette paye volontiers !
                    **Maitre** : Bien , prend tes  ${n} crédits.
                    ${emoji.succes} ${n} crédits on étés ajoutés à votre compte avec succès`)


                        .setFooter(message.client.footer)

                        .setColor(message.client.color);
                        m.delete();
                        let final = n;
                        let useldb = await UserRpg.findOne({ UserID: message.author.id })
                        if (useldb) {
                            console.log('exits profil');
                            let act;
                            if (useldb.credits) {
                                act = useldb.credits;
                                console.log('exits');
                            } else {
                                act = 0;
                                console.log('not credits exits profil');
                            }
                            let newfric = math.evaluate(`${act} + ${n}`);
                            const newcbio = await UserRpg.findOneAndUpdate({ UserID: message.author.id }, { $set: { credits: newfric } }, { new: true });

                        } else {
                            console.log('not exits profil');
                            const verynew = new UserRpg({
                                UserID: `${message.author.id}`,
                                credits: `${n}`
                              
                            }).save();

                        }
                        message.channel.send(embed);
                    }

                }
                if (reaccion.emoji.name === "😒") {
                    const errorEmbed = new Discord.MessageEmbed()



                    .setDescription(`${emoji.error} Erreur : temps écoulé ! `)


                    .setFooter(message.client.footer)

                    .setColor("#982318");
                    m.edit(errorEmbed);
                }
            });
        });
    },

};
