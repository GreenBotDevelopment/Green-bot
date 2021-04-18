const emoji = require('../../emojis.json')
const Discord = require('discord.js');
const fetch = require("node-fetch");
const { parse } = require("twemoji-parser");
const { EmojiAPI } = require("emoji-api");
module.exports = {
    name: 'emoji',
    description: 'Envoie un emoji en grand',
    aliases: ['emote', 'jumbo'],
    usage: '<emoji>',
    cat: 'utilities',
    guildOnly: true,

    async execute(message, args) {
if(!args[0]) return message.errorMessage('Veuillez fournir un emoji')

        // supporte les emojis basiques
        if (args[0].charCodeAt(0) >= 55296) {

            const emoji = new EmojiAPI();
            emoji.get(args.join(" ")).then(async(emote) => {

                if (emote.images[5] && emote.images[5].vendor === "Twitter") {
                    const fichier = new Discord.MessageAttachment(emote.images[5].url, `${message.client.user.username}.png`)
                    return message.channel.send({
                        files: [fichier]
                    })

                } else {
                    return message.errorMessage(`L'emoji fourni n'est pas supporté`);
                };
            }).catch(function(error) {
                return message.client.error(message, error);
            });

        } else {
            //supporte les emojis customisés
            const type = args.join(" ").startsWith("<a:") ? ".gif" : ".png";
            const match = args.join(" ").startsWith("<a:") ? args.join(" ").match(/<a:[a-zA-Z0-9_-]+:(\d{18})>/) : args.join(" ").match(/<:[a-zA-Z0-9_-]+:(\d{18})>/);

            if (!match || !match[1]) {
                return message.errorMessage(`Vous devez fournir un emoji valide`);
            } else {

                const attachment = new Discord.MessageAttachment(`https://cdn.discordapp.com/emojis/${match[1]}${type}`, `${message.client.user.username}-${match[1]}${type}`);

                message.channel.send({
                    files: [attachment]
                });

            };
        }
    },
};