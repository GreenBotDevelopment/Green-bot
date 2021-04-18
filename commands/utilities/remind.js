const Discord = require('discord.js');
const emoji = require('../../emojis.json')
const ms = require('ms');
module.exports = {
    name: 'remind',
    description: 'Crée un rappel',
    args: true,
    usage: '<temps> <raison>',
    exemple: '1m Coder',
    cat: 'utilities',
    botpermissions: ["SEND_MESSAGES", "EMBED_LINKS"],
    async execute(message, args, client) {


        if (!args[0])
            return message.errorMessage(`Veuillez fournir une durée de 14 jours ou moins (1s/m/h/d)`);
        let time = ms(args[0]);
        if (!time || time > 1209600000)
            return message.errorMessage(`Veuillez fournir une durée de 14 jours ou moins`);

        let reason = args.slice(1).join(" ")
        if (!reason) return message.errorMessage(` Veuillez fournir une raison`);



        message.succesMessage(`Je vous rapelle de ${reason} dans ${args[0]}.`);



        setTimeout(() => {

            message.channel.send(Discord.Util.removeMentions(`${message.author} : ${reason}`));
        }, time);



    },
};