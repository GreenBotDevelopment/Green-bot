const Discord = require('discord.js');
const ms = require('ms');
const guild = require('../../database/models/guild');
const math = require('mathjs');
var db = require('quick.db')
module.exports = {
    name: 'ticket-close',
    description: 'Ferme un ticket crée par le bot',

    guildOnly: true,
    aliases: ["close"],
    usage: '[force]',
    exemple: 'force',
    cat: 'moderation',

    botpermissions: ["SEND_MESSAGES", "EMBED_LINKS", "MANAGE_CHANNELS"],
    async execute(message, args, client) {

        const lang = await message.translate("TICKET_CLOSE")
        if (!message.channel.name.startsWith(`ticket-`)) return message.errorMessage(lang.noTicket)
        if (message.author.id === db.get(`ticket.${message.channel.name}.user`)) {


            let embed2 = new Discord.MessageEmbed()
                .setColor('#90EE90')
                .setTitle(lang.title1)

            .setDescription(lang.text1);

            message.channel.send({ embeds: [embed2] }).then(m => m.react(`🗑️`));
        } else {

            if (args[0] === "force") {

                let embed1 = new Discord.MessageEmbed()
                    .setAuthor(lang.dm1.replace("{guild}", message.guild.name))
                    .setColor('#90EE90')

                .setDescription(lang.dm2.replace("{tag}", message.author.tag));
                db.delete(`ticket.${message.channel.name}`);
                message.channel.delete();

                if (message.guild.members.cache.get(db.get(`ticket.${message.channel.name}.user`))) message.guild.members.cache.get(db.get(`ticket.${message.channel.name}.user`)).send({ embeds: [embed1] }).catch(e => { console.log(e) })


            } else {

                let embed2 = new Discord.MessageEmbed()
                    .setColor('#90EE90')
                    .setTitle(lang.title1)
                    .addField('Actions', `🗑️ : ${lang.close}`)

                .setDescription(lang.desc);

                message.channel.send({ embeds: [embed2] }).then((m) => {
                    m.react(`🗑️`);
                });
            }
        }







    },
};