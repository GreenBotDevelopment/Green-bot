const fetch = require("node-fetch");
const Discord = require('discord.js');
const emoji = require('../../emojis.json')
const request = require('node-superfetch');
module.exports = {
    name: 'web',
    description: 'Renvoie un screen d\'un site web ',
    aliases: ['screenweb'],
    args: true,
    usage: '<url>',
    exemple: 'http://green-bot.tk/',
    cat: 'fun',
    async execute(message, args) {

        try {
            if (args.length !== 0) {
                const { body } = await request.get(`https://image.thum.io/get/width/1920/crop/675/noanimate/${args[0]}`);
                return message.channel.send({ files: [{ attachment: body, name: 'screenshot.png' }] });
            } else {

            }
        } catch (err) {
            return message.channel.send(`${emoji.error} Veuillez fournir une URL à ce format : \`http://green-bot.tk/\``);
        }
    },
};