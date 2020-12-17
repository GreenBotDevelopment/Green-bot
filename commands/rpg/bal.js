const fetch = require("node-fetch");
const Discord = require('discord.js');
const emoji = require('../../emojis.json')

const partner = require("../../database/models/partner");
module.exports = {
    name: 'bal',
    description: 'Affiche tous les serveurs partenaires que vous pouvez rejoindre pour gagner des crédits',

    aliases: ['ballet'],
    cat: 'rpg',
    async execute(message, args) {
        const { client } = message;
        let channeldb = await partner.find({})

        const reportEmbed = new Discord.MessageEmbed()
            .setTitle(`\`✨\` Serveurs pour gagner de l'argent `)
            .setDescription(`Voici tous les serveurs (${channeldb.length}) ou tu gagneras de l'argent en les rejoignants . Si tu souhaite voir ton serveur ici , il suffit de gagner 100 crédits.`)

        .setFooter(message.client.footer)

        .setColor(message.client.color);
        if (channeldb.length === 0) {
            reportEmbed.addField('Aucuns serveurs', `sorry`)
        } else {
            channeldb.forEach(async(server) => {
                let guild = message.client.guilds.cache.get(server.serverID);


                reportEmbed.addField(`${guild.name} (https://discord.gg/${server.reason}) ${server.argent} ${emoji.money}`, `${server.description}`)

            });
        }





        message.channel.send(reportEmbed);



    },
};
