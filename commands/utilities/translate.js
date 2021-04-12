const emoji = require('../../emojis.json')
const Discord = require('discord.js');
const fetch = require("node-fetch");
const { parse } = require("twemoji-parser");
const { EmojiAPI } = require("emoji-api");
const translate = require("@vitalets/google-translate-api");

module.exports = {
    name: 'translate',
    description: 'Traduit le texte donne dans la langue voulue',
    aliases: ['traduction'],
    usage: '<langue> <texte>',
    exemple: 'en Bonjour',
    cat: 'utilities',
    guildOnly: true,

    async execute(message, args) {
        if (!args.length) {
            let embed = new Discord.MessageEmbed()
                .setAuthor(`${message.author.username}`, message.author.displayAvatarURL({ dynamic: true, size: 512 }))

            .setColor("#F0B02F")
                .setTitle(`Traduction`)
                .setDescription(`Vous devez fournir un argument pour cette commande .`)
                .addField('Utilisation', `\`${message.guild.prefix}translate <cible> <texte>\`\n\`${message.guild.prefix}translate en Bonjour\` : Cela va traduire Bonjour en anglais`)
                .addField('Permissions', `Vous devez être sur que Green-bot a la permission \`Attacher des liens\``)

            .setThumbnail(url = message.client.user.displayAvatarURL({ dynamic: true, size: 512 }))

            .setFooter(message.client.footer, message.client.user.displayAvatarURL({ dynamic: true, size: 512 }))


            message.channel.send(embed).then((m) => {
                m.react("<:delete:830790543659368448>")
                const filtro = (reaction, user) => {
                    return user.id == message.author.id;
                };
                m.awaitReactions(filtro, {
                    max: 1,
                    time: 20000,
                    errors: ["time"]
                }).catch(() => {

                }).then(async(coleccionado) => {

                    const reaccion = coleccionado.first();
                    if (reaccion.emoji.id === "830790543659368448") {
                        m.delete()


                    }

                });
            });
            return

        }
        let target = args[0]
        if (!target) {
            let embed = new Discord.MessageEmbed()
                .setAuthor(`${message.author.username}`, message.author.displayAvatarURL({ dynamic: true, size: 512 }))

            .setColor("#F0B02F")
                .setTitle(`Traduction`)
                .setDescription(`Vous devez fournir un argument pour cette commande .`)
                .addField('Utilisation', `\`${message.guild.prefix}translate <cible> <texte>\`\n\`${message.guild.prefix}translate en Bonjour\` : Cela va traduire Bonjour en anglais`)
                .addField('Permissions', `Vous devez être sur que Green-bot a la permission \`Attacher des liens\``)

            .setThumbnail(url = message.client.user.displayAvatarURL({ dynamic: true, size: 512 }))

            .setFooter(message.client.footer, message.client.user.displayAvatarURL({ dynamic: true, size: 512 }))


            message.channel.send(embed).then((m) => {
                m.react("<:delete:830790543659368448>")
                const filtro = (reaction, user) => {
                    return user.id == message.author.id;
                };
                m.awaitReactions(filtro, {
                    max: 1,
                    time: 20000,
                    errors: ["time"]
                }).catch(() => {

                }).then(async(coleccionado) => {

                    const reaccion = coleccionado.first();
                    if (reaccion.emoji.id === "830790543659368448") {
                        m.delete()


                    }

                });
            });
            return

        }
        let text = args.slice(1).join(" ")
        if (!text) {
            let embed = new Discord.MessageEmbed()
                .setAuthor(`${message.author.username}`, message.author.displayAvatarURL({ dynamic: true, size: 512 }))

            .setColor("#F0B02F")
                .setTitle(`Traduction`)
                .setDescription(`Vous devez fournir un argument pour cette commande .`)
                .addField('Utilisation', `\`${message.guild.prefix}translate <cible> <texte>\`\n\`${message.guild.prefix}translate en Bonjour\` : Cela va traduire Bonjour en anglais`)
                .addField('Permissions', `Vous devez être sur que Green-bot a la permission \`Attacher des liens\``)

            .setThumbnail(url = message.client.user.displayAvatarURL({ dynamic: true, size: 512 }))

            .setFooter(message.client.footer, message.client.user.displayAvatarURL({ dynamic: true, size: 512 }))


            message.channel.send(embed).then((m) => {
                m.react("<:delete:830790543659368448>")
                const filtro = (reaction, user) => {
                    return user.id == message.author.id;
                };
                m.awaitReactions(filtro, {
                    max: 1,
                    time: 20000,
                    errors: ["time"]
                }).catch(() => {

                }).then(async(coleccionado) => {

                    const reaccion = coleccionado.first();
                    if (reaccion.emoji.id === "830790543659368448") {
                        m.delete()


                    }

                });
            });
            return

        }
        let msg = await message.channel.send(`<a:green_loading:824308769713815612> **Récupération des informations en cours , veuillez patienter....**`)

        await translate(text, { to: target }).then((res) => {
            let embed = new Discord.MessageEmbed()
                .setAuthor(`${message.author.username}`, message.author.displayAvatarURL({ dynamic: true, size: 512 }))

            .setColor("#F0B02F")
                .setTitle(`\`${res.from.language.iso}\` ➟ \`${target}\`\n${res.text}\n`)

            .setFooter(message.client.footer, message.client.user.displayAvatarURL({ dynamic: true, size: 512 }))

            setTimeout(() => {
                msg.edit(null, { embed: embed })
            }, 3000);
        }).catch((error) => {
            msg.delete()
            message.errorMessage(`Hmm il me semble que cette langue n'est pas supportée : \n\`${error}\``)

        });

    },
};