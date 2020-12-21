const Discord = require('discord.js');
const emoji = require('../../emojis.json')
const ms = require('ms');
var db = require('quick.db')
module.exports = {
    name: 'ticket-close',
    description: 'Ferme un ticket crée par le bot',

    guildOnly: true,
   
    usage: '[force]',
    exemple: 'force',
    cat: 'moderation',
   
    botpermissions: ["SEND_MESSAGES", "EMBED_LINKS", "MANAGE_CHANNELS"],
    async execute(message, args, client) {

        if (!message.channel.name.startsWith(`ticket-`)) return message.channel.send(`${emoji.error} Ce salon n'est pas un ticket....`)

        if (message.author.id === db.get(`ticket.${message.channel.name}.user`)) {


            let embed2 = new Discord.MessageEmbed()
                .setColor('#90EE90')
                .setTitle(`🎟️ | Ticket Terminé`)

            .setDescription(`L'autheur du ticket a terminé son ticket . Pour le fermer , réagissez avec 🗑️`);

            message.channel.send(embed2).then(m => m.react(`🗑️`));
        } else {

            if (args[0] === "force") {

                let embed1 = new Discord.MessageEmbed()
                    .setAuthor(`📥 | Ticket Fermé`)
                    .setColor('#90EE90')

                .setDescription(`\`${message.author.tag}\` a forcé la fermeture de votre ticket. sur **${message.guild.name}**`);
                db.delete(`ticket.${message.channel.name}`);

                if (client.users.cache.get(db.get(`ticket.${message.channel.name}.user`))) message.client.users.cache.get(db.get(`ticket.${message.channel.name}.user`)).send(embed1).catch(e => { console.log(e) })
                message.channel.delete();


            } else {

                let embed2 = new Discord.MessageEmbed()
                    .setColor('#90EE90')
                    .setTitle(`🎟️ | Ticket Terminé`)

                .setDescription(`Réagissez avec \\🗑️ pour fermer le ticket ou ne réagissez pas si vous avez d'autres demandes.`);

                message.channel.send(embed2).then(m => m.react(`🗑️`));
            }

        }





    },
};
