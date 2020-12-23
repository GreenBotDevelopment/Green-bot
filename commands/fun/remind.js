const Discord = require('discord.js');
const emoji = require('../../emojis.json')
const ms = require('ms');
module.exports = {
    name: 'remind',
    description: 'Crée un rappe',
    args: true,
    usage: '<temps> <raison>',
    exemple: '1m Coder',
    cat: 'fun',
    botpermissions: ["SEND_MESSAGES", "EMBED_LINKS"],
    async execute(message, args, client) {


        if (!args[0])
            return message.channel.send(`${emoji.error} Veuillez fournir une durée de 14 jours ou moins (1s/m/h/d)`);
        let time = ms(args[0]);
        if (!time || time > 1209600000)
            return message.channel.send(`${emoji.error} Veuillez fournir une durée de 14 jours ou moins (1s/m/h/d)`);

        let reason = args.slice(1).join(" ")
        if (!reason) return message.channel.send(`${emoji.error} Veuillez fournir une raison)`);



        message.channel.send(`${emoji.succes} Je vous rapelle de ${reason} dans ${args[0]}.`);



        setTimeout(() => {

            message.channel.send(`${message.author} : ${reason}`);
        }, time);



    },
};
