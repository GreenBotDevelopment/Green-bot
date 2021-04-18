const config = require('../config.json');
const Welcome = require('../database/models/Welcome');
const emoji = require('../emojis.json');

const Discord = require('discord.js');
const Canvas = require('canvas');
module.exports = {


    async execute(message, client) {

if(!message) return;

        if (!message.guild) return;
        let welcomedb = await Welcome.findOne({ serverID: message.guild.id, reason: 'logs' })
        if (welcomedb) {
            let logchannel = message.guild.channels.cache.get(welcomedb.channelID);
            if (!logchannel) return;

            const fetchedLogs = await message.guild.fetchAuditLogs({
                limit: 1,
                type: 'MESSAGE_DELETE',
            });

            const deletionLog = fetchedLogs.entries.first();


            if (!deletionLog) {
                const reportEmbed = new Discord.MessageEmbed()

                .setAuthor(`Message supprimé`, 'https://vegibit.com/wp-content/uploads/2018/01/How-To-Delete-A-Record-From-The-Database.png')
                    .setDescription(`un message de ${message.author} a été supprimé dans le salon ${message.channel} `)

                .addField("Message", message)


                .setFooter(message.client.footer)

                .setColor("#982318");
                logchannel.send(reportEmbed);
                return;
            }


            const { executor, target } = deletionLog;


            if (target) {
                if (target.id === message.author.id) {
                    const reportEmbed = new Discord.MessageEmbed()
                        .setAuthor(`Message supprimé`, 'https://vegibit.com/wp-content/uploads/2018/01/How-To-Delete-A-Record-From-The-Database.png')
                        .setDescription(`${executor} a supprimé 1 message de ${message.author} dans le salon ${message.channel} `)

                    .addField("Message", message)


                    .setFooter(message.client.footer)

                    .setColor("#982318");
                    logchannel.send(reportEmbed);
                    return;
                } else {
                    const reportEmbed = new Discord.MessageEmbed()
                        .setAuthor(`Message supprimé`, 'https://vegibit.com/wp-content/uploads/2018/01/How-To-Delete-A-Record-From-The-Database.png')

                    .setDescription(` ${message.author} a supprimé son message dans le salon ${message.channel} `)

                    .addField("Message", message)


                    .setFooter(message.client.footer)

                    .setColor("#982318");
                    logchannel.send(reportEmbed);
                    return;
                }
            }
        }

    }
};