const fetch = require("node-fetch");
const Discord = require('discord.js');
const emoji = require('../../emojis.json')
const Adventure = require('../../database/models/adventure');
const adventure = require("../../database/models/adventure");

module.exports = {
    name: 'quete-start',
    description: 'Démarre une nouvelle quete avec Green',
    cooldown: 100,
    aliases: ['start-quete'],
    cat: 'rpg',
    async execute(message, args) {
        const { client } = message;
        const check = await Adventure.find({ UserID: message.author.id })
        const number = check.length + 1;
        const reportEmbed = new Discord.MessageEmbed()
            .setTitle(`${emoji.quest} | Nouvelle quete`)


        .addField("Buts de quetes", `
    1. Le cristal de Green (🟢)
    2. la pierre Philosophale (🥌)
    3. La lance de feu (🔥)`)

        .setDescription(`Bonjour étranger , tu es sur le point de démarrer une nouvelle quête , mais tout d'abord , donnons un sens à cette quete. Veuillez réagir avec l'emoji correspondant.`)

        .setFooter(client.footer)

        .setColor(client.color);
        message.channel.send(reportEmbed).then(m => {


            m.react("🟢")
            m.react("🥌")
            m.react("🔥")
            const filtro = (reaction, user) => {
                return user.id == message.author.id;
            };
            m.awaitReactions(filtro, {
                max: 1,
                time: 20000,
                errors: ["time"]
            }).catch(() => {
                m.edit(`${emoji.error} Le temps est écoulé... création de la quête annulée`);
            }).then(coleccionado => {

                const reaccion = coleccionado.first();
                if (reaccion.emoji.name === "🟢") {
                    m.delete();
                    const reportEmbed = new Discord.MessageEmbed()
                        .setTitle(` Le cristal de Green 🟢`)


                    .addField("Profils", `
            1. Guerrier (⚔)
            2. Titan (🦮)
            3. Paysan (🌳)`)

                    .setDescription(`Bien , bien , maintenant que nous avons un but , il nous faut choisir de quel moyen l'atteindre. Choisisez un profil .`)

                    .setFooter(client.footer)

                    .setColor(client.color);
                    message.channel.send(reportEmbed).then(m => {


                        m.react("⚔")
                        m.react("🦮")
                        m.react("🌳")
                        const filtro = (reaction, user) => {
                            return user.id == message.author.id;
                        };
                        m.awaitReactions(filtro, {
                            max: 1,
                            time: 20000,
                            errors: ["time"]
                        }).catch(() => {
                            m.edit(`${emoji.error} Le temps est écoulé... création de la quête annulée`);
                        }).then(coleccionado => {

                            const reaccion = coleccionado.first();
                            if (reaccion.emoji.name === "⚔") {
                                m.delete();

                                check.forEach(async(s) => {

                                    await Adventure.findOneAndUpdate({ UserID: message.author.id, _id: s._id }, { $set: { active: null } }, { new: true });
                                    console.log(`${s._id} set to null`)

                                });
                                const verynew = new Adventure({
                                    UserID: `${message.author.id}`,
                                    nom: `Quete sans nom ${number}`,
                                    but: `Le cristal de Green`,
                                    profil: `Guerrier`,
                                    active: true,
                                    level: `0`,
                                    xp: `0`,
                                }).save();
                                const reportEmbed = new Discord.MessageEmbed()

                                .setDescription(`Votre quete a été crée avec succès ! Vous etes **guerrier** et votre but est **Le cristal de Green** . Bonne aventure !`)

                                .setFooter(client.footer)

                                .setColor(client.color);
                                message.channel.send(reportEmbed)
                                return
                            };
                            if (reaccion.emoji.name === "🦮") {
                                check.forEach(async(s) => {

                                    await Adventure.findOneAndUpdate({ UserID: message.author.id, _id: s._id }, { $set: { active: null } }, { new: true });
                                    console.log(`${s._id} set to null`)

                                });
                                const verynew = new Adventure({
                                    UserID: `${message.author.id}`,
                                    nom: `Quete sans nom ${number}`,
                                    but: `Le cristal de Green`,
                                    profil: `Titan`,
                                    active: true,
                                    level: `0`,
                                    xp: `0`,
                                }).save();
                                const reportEmbed = new Discord.MessageEmbed()

                                .setDescription(`Votre quete a été crée avec succès ! Vous etes un **Titan** et votre but est **Le cristal de Green** . Bonne aventure !`)

                                .setFooter(client.footer)

                                .setColor(client.color);
                                message.channel.send(reportEmbed)
                                return
                            };
                            if (reaccion.emoji.name === "🌳") {
                                check.forEach(async(s) => {

                                    await Adventure.findOneAndUpdate({ UserID: message.author.id, _id: s._id }, { $set: { active: null } }, { new: true });
                                    console.log(`${s._id} set to null`)

                                });
                                const verynew = new Adventure({
                                    UserID: `${message.author.id}`,
                                    nom: `Quete sans nom ${number}`,
                                    but: `Le cristal de Green`,
                                    level: `0`,
                                    active: true,
                                    profil: `Paysan`,
                                    xp: `0`,
                                }).save();
                                const reportEmbed = new Discord.MessageEmbed()

                                .setDescription(`Votre quete a été crée avec succès ! Vous etes **paysan** et votre but est **Le cristal de Green** . Bonne aventure !`)

                                .setFooter(client.footer)

                                .setColor(client.color);
                                message.channel.send(reportEmbed)
                                return
                            };
                        });
                    });

                };
                if (reaccion.emoji.name === "🥌") {
                    m.delete();
                    const reportEmbed = new Discord.MessageEmbed()
                        .setTitle(` La Pierre philsophale 🥌`)


                    .addField("Profils", `
            1. Guerrier (⚔)
            2. Alchimiste (🥃)
            3. Mage (🧙🏼‍♂️)`)

                    .setDescription(`Bien , bien , maintenant que nous avons un but , il nous faut choisir de quel moyen l'atteindre. Choisisez un profil .`)

                    .setFooter(client.footer)

                    .setColor(client.color);
                    message.channel.send(reportEmbed).then(m => {


                        m.react("⚔")
                        m.react("🥃")
                        m.react("🧙🏼‍♂️")
                        const filtro = (reaction, user) => {
                            return user.id == message.author.id;
                        };
                        m.awaitReactions(filtro, {
                            max: 1,
                            time: 20000,
                            errors: ["time"]
                        }).catch(() => {
                            m.edit(`${emoji.error} Le temps est écoulé... création de la quête annulée`);
                        }).then(coleccionado => {

                            const reaccion = coleccionado.first();
                            if (reaccion.emoji.name === "⚔") {
                                m.delete();
                                check.forEach(async(s) => {

                                    await Adventure.findOneAndUpdate({ UserID: message.author.id, _id: s._id }, { $set: { active: null } }, { new: true });
                                    console.log(`${s._id} set to null`)

                                });
                                const verynew = new Adventure({
                                    UserID: `${message.author.id}`,
                                    nom: `Quete sans nom ${number}`,
                                    but: `Pierre philsophale `,
                                    profil: `Guerrier`,
                                    level: `0`,
                                    active: true,
                                    xp: `0`,
                                }).save();
                                const reportEmbed = new Discord.MessageEmbed()

                                .setDescription(`Votre quete a été crée avec succès ! Vous etes **Guerrier** et votre but est **La pierre philosophale** . Bonne aventure !`)

                                .setFooter(client.footer)

                                .setColor(client.color);
                                message.channel.send(reportEmbed)
                                return
                            };
                            if (reaccion.emoji.name === "🥃") {
                                check.forEach(async(s) => {

                                    await Adventure.findOneAndUpdate({ UserID: message.author.id, _id: s._id }, { $set: { active: null } }, { new: true });
                                    console.log(`${s._id} set to null`)

                                });
                                m.delete();
                                const verynew = new Adventure({
                                    UserID: `${message.author.id}`,
                                    nom: `Quete sans nom ${number}`,
                                    but: `Pierre philsophale `,
                                    profil: `Alchimiste`,
                                    level: `0`,
                                    active: true,
                                    xp: `0`,
                                }).save();
                                const reportEmbed = new Discord.MessageEmbed()

                                .setDescription(`Votre quete a été crée avec succès ! Vous etes **Alchimiste** et votre but est **La pierre philosophale** . Bonne aventure !`)

                                .setFooter(client.footer)

                                .setColor(client.color);
                                message.channel.send(reportEmbed)
                                return
                            };
                            if (reaccion.emoji.name === "🧙🏼‍♂️") {
                                check.forEach(async(s) => {

                                    await Adventure.findOneAndUpdate({ UserID: message.author.id, _id: s._id }, { $set: { active: null } }, { new: true });
                                    console.log(`${s._id} set to null`)

                                });
                                m.delete();
                                const verynew = new Adventure({
                                    UserID: `${message.author.id}`,
                                    nom: `Quete sans nom ${number}`,
                                    but: `Pierre philsophale `,
                                    level: `0`,
                                    profil: `Mage`,
                                    active: true,
                                    xp: `0`,
                                }).save();
                                const reportEmbed = new Discord.MessageEmbed()

                                .setDescription(`Votre quete a été crée avec succès ! Vous etes **Mage** et votre but est **La pierre philosophale** . Bonne aventure !`)

                                .setFooter(client.footer)

                                .setColor(client.color);
                                message.channel.send(reportEmbed)
                                return
                            };
                        });
                    });
                };
                if (reaccion.emoji.name === "🔥") {
                    m.delete();
                    const reportEmbed = new Discord.MessageEmbed()
                        .setTitle(` La Lance de feu 🔥`)


                    .addField("Profils", `
            1. Fils du feu (🔥)
            2. Alchimiste (🥃)
            3. Prince charmant (🦾)`)

                    .setDescription(`Bien , bien , maintenant que nous avons un but , il nous faut choisir de quel moyen l'atteindre. Choisisez un profil .`)

                    .setFooter(client.footer)

                    .setColor(client.color);
                    message.channel.send(reportEmbed).then(m => {


                        m.react("🔥")
                        m.react("🥃")
                        m.react("🦾")
                        const filtro = (reaction, user) => {
                            return user.id == message.author.id;
                        };
                        m.awaitReactions(filtro, {
                            max: 1,
                            time: 20000,
                            errors: ["time"]
                        }).catch(() => {
                            m.edit(`${emoji.error} Le temps est écoulé... création de la quête annulée`);
                        }).then(coleccionado => {

                            const reaccion = coleccionado.first();
                            if (reaccion.emoji.name === "🔥") {
                                m.delete();
                                check.forEach(async(s) => {

                                    await Adventure.findOneAndUpdate({ UserID: message.author.id, _id: s._id }, { $set: { active: null } }, { new: true });
                                    console.log(`${s._id} set to null`)

                                });
                                const verynew = new Adventure({
                                    UserID: `${message.author.id}`,
                                    nom: `Quete sans nom ${number}`,
                                    but: `La Lance de feu `,
                                    profil: `fils du feu`,
                                    active: true,
                                    level: `0`,
                                    xp: `0`,
                                }).save();
                                const reportEmbed = new Discord.MessageEmbed()

                                .setDescription(`Votre quete a été crée avec succès ! Vous etes **Fils du feu** et votre but est **La Lance de feu** . Bonne aventure !`)

                                .setFooter(client.footer)

                                .setColor(client.color);
                                message.channel.send(reportEmbed)
                                return
                            };
                            if (reaccion.emoji.name === "🥃") {
                                m.delete();
                                check.forEach(async(s) => {

                                    await Adventure.findOneAndUpdate({ UserID: message.author.id, _id: s._id }, { $set: { active: null } }, { new: true });
                                    console.log(`${s._id} set to null`)

                                });
                                const verynew = new Adventure({
                                    UserID: `${message.author.id}`,
                                    nom: `Quete sans nom ${number}`,
                                    but: `La Lance de feu`,
                                    profil: `Alchimiste`,
                                    active: true,
                                    level: `0`,
                                    xp: `0`,
                                }).save();
                                const reportEmbed = new Discord.MessageEmbed()

                                .setDescription(`Votre quete a été crée avec succès ! Vous etes **Alchimiste** et votre but est **La Lance de feu** . Bonne aventure !`)

                                .setFooter(client.footer)

                                .setColor(client.color);
                                message.channel.send(reportEmbed)
                                return
                            };
                            if (reaccion.emoji.name === "🦾") {
                                m.delete();
                                check.forEach(async(s) => {

                                    await Adventure.findOneAndUpdate({ UserID: message.author.id, _id: s._id }, { $set: { active: null } }, { new: true });
                                    console.log(`${s._id} set to null`)

                                });
                                const verynew = new Adventure({
                                    UserID: `${message.author.id}`,
                                    nom: `Quete sans nom ${number}`,
                                    but: `La Lance de feu `,
                                    level: `0`,
                                    active: true,
                                    profil: `Prince`,
                                    xp: `0`,
                                }).save();
                                const reportEmbed = new Discord.MessageEmbed()

                                .setDescription(`Votre quete a été crée avec succès ! Vous êtes **Prince** et votre but est **La Lance de feu** . Bonne aventure !`)

                                .setFooter(client.footer)

                                .setColor(client.color);
                                message.channel.send(reportEmbed)
                                return
                            };
                        });
                    });
                };
            })
        })




    },
};