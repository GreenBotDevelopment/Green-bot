const Discord = require('discord.js');
const Welcome = require('../../database/models/Welcome')
const emoji = require('../../emojis.json')

module.exports = {
    name: 'interchat-server',
    description: 'Défini le salon de l\'interchat',
    aliases: ['setinterchat-server'],
    cat: 'configuration',
    args: true,
    guildOnly: true,
    usage: '<id du serveur>',
    exemple: '784773050956513290',
    permissions: ['MANAGE_GUILD'],
    async execute(message, args) {
        const server = message.client.guilds.cache.get(args[0]) || message.client.guilds.cache.find(g => g.name === args);
        if (!server) {

            return message.channel.send(`${emoji.error} L'ID de serveur fourni n'est pas valide.... `);


        }

        const verify = await Welcome.findOne({ serverID: message.guild.id, reason: `interchat-s` })
        if (verify) {
     const newserver = await Welcome.findOneAndUpdate({ serverID: message.guild.id, reason: `interchat-s` }, { $set: { channelID: server.id, reason: `interchat-s` } }, { new: true });
   return message.channel.send(`${emoji.succes} Interchat mis à jour !`);


        } else {
            const verynew = new Welcome({
                serverID: `${message.guild.id}`,
                channelID: `${server.id}`,
                message:`no set`,
                reason: 'interchat-s',
            }).save();
              const sec = new Welcome({
                serverID: `${server.id}`,
                channelID: `${message.guild.id}`,
                message:`no set`,
                reason: 'interchat-s',
            }).save();
     let owner = message.client.users.cache.get(server.owner.id)
            if (!owner) {
                console.log('not exits')
                return message.channel.send(`${emoji.error} Je ne peux pas mp l'owner car je n'ai aucuns serveurs en commun avec lui`)

            } else {
              
                const reportEmbed = new Discord.MessageEmbed()
                    .setTitle(`Demande d'interchat`)


                .setDescription(`${message.author.tag} , du serveur \`${message.guild.name}\` a fait une demande d'interchat avec l'un de vos serveurs(\`${server.name}\`)
                    Si vous acceptez , veuillez réagir avec ✅ , sinon , avec ❌  !`)



                .setFooter(message.client.footer)

                .setColor("#73810C");
                owner.send(reportEmbed).then(m => {
                    m.react("✅")
                    m.react("❌");
                });
            }
            return message.channel.send(`${emoji.succes} J'envoie une demande d'interchat au propriétaire de \`${server.name}\`(\`${server.owner.user}\`)`);

        }





    },
};
