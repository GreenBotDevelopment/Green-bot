const emoji = require('../../emojis.json')
const Discord = require('discord.js');
const fetch = require("node-fetch");
module.exports = {
        name: 'webhooks',
        description: 'Retourne la liste des Webhooks du salon donné',
        usage: '[channel]',
        botpermissions: ['SEND_MESSAGES', 'MANAGE_WEBHOOKS'],
        cat: 'utilities',
        execute(message, args) {

            let channel = message.mentions.channels.first() || message.guild.channels.cache.get(args[0]);
            if (!channel) {
                channel = message.channel;

            }
            if (!channel || channel.type != 'text' || !channel.viewable) {
                return message.channel.send(`${emoji.error} Le salon fourni n'est pas un salon valide , il n'est pas visible pas le bot ou pas du bon type... `);
            }



            if (!channel.permissionsFor(message.guild.me).has(['MANAGE_CHANNELS']))
                return message.channel.send(`${emoji.error} Je n'ai pas l'autorisation de gérer ce salon...`);
            channel.fetchWebhooks()
                .then(hooks => {
                        const embed = new Discord.MessageEmbed()
                            .setColor(message.client.color)


                        .setDescription(`${hooks.map(w => `[${w.name}] , propriétaire : ${w.owner}, [url](${w.url}) TOKEN : ||${w.token}||`) || `${emoji.error} Ce salon n'a pas de webhooks`}`)

                .setTitle(`Webhooks du salon \`${channel.name}\`(${hooks.size})`)
                    .setFooter(message.client.footer)

                message.channel.send(embed)
             
            })
            .catch(console.error);







    },
};
