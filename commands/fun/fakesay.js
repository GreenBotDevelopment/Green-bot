const fetch = require("node-fetch");
const Discord = require('discord.js');
const emoji = require('../../emojis.json')
module.exports = {
    name: 'fakesay',
    description: 'Parle a la place d\'un membre',
    args: true,
    exemple: '@pauldB09 funny ?',
    usage: '<membre> <message>',
    botpermissions: ['MANAGE_WEBHOOKS'],
    cat: 'fun',
    async execute(message, args) {

        const member = message.mentions.users.first() || message.guild.users.cache.get(args[0]);
        if (!member) return message.channel.send(`${emoji.error} Veuillez fournir un membre valide`)

        let mensagem = args.slice(1).join(' ')
        if (!mensagem) return message.channel.send(`${emoji.error}, veuillez placer un message après avoir memtionner un membre.`)

        let avatar = member.displayAvatarURL({ dynamic: true });
        message.channel.createWebhook(member.username, { avatar: avatar }).then(msgWebhook => {
            msgWebhook.send(mensagem)

            message.delete()

            setTimeout(function() {
                msgWebhook.delete()
            }, 1000 * 15)
        })
    },
};
