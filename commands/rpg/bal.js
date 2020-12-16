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

        .setFooter(client.footer)

        .setColor(client.color);
        if (channeldb.length === 0) {
            reportEmbed.addField('Aucuns serveurs', `sorry`)
        } else {
            channeldb.forEach(async(server) => {
                let guild = message.client.guilds.get(server.serverID);
                guild.createInvite().then(invite =>
                   
               
                reportEmbed.addField(`[${guild.name}](${invite.url})`, `${guild.memberCount} membres`)
                );
            });
        }





        message.channel.send(reportEmbed);



    },
};
