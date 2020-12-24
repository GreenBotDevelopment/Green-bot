const Discord = require("discord.js");
const backup = require("discord-backup");
const emoji = require('../../emojis.json')
module.exports = {
    name: 'backup-create',
    description: 'crée une backup du seveur',
    botpermissons: ['MANAGE_GUILD'],
    permissions: ['ADMINISTRATOR'],
    aliases: ['b-create'],
    cooldown: 30000,
    cat: 'utilities',
    execute(message, args) {

        const client = message.client;
        const unmuteEmbed = new Discord.MessageEmbed()
            .setTitle('Création de la backup...')
            .setDescription(`Enregistrement de :
            **${message.guild.channels.cache.size}** salons 
           ** ${message.guild.roles.cache.size}** Rôles
            **${message.guild.emojis.cache.size}** salons
            -Du nom du serveur et de l'icone.

            `)
            .setFooter(message.client.footer)
            .setColor(message.client.color);
        message.channel.send(unmuteEmbed).then(m=>{
            backup.create(message.guild, {
                jsonBeautify: true
            }).then((backupData) => {

                 const unmuteEmbedee = new Discord.MessageEmbed()
                    .setTitle('Backup crée avec succès.')
                  .addField(`Pour la charger :`, `
                  \`\`\`*backup-load ${backupData.id}\`\`\`
                  `)  .addField(`Pour des infos :`, `
                  \`\`\`*backup-info ${backupData.id}\`\`\`
                  `)
                    .setFooter(message.client.footer)
                    .setColor(message.client.color);
                message.author.send(unmuteEmbedee)
            const unmuteEmbede = new Discord.MessageEmbed()
                .setTitle('Backup crée avec succès.')
                .setDescription(`Vous avez reçu les informations en MP 😉`)
                .setFooter(message.client.footer)
                .setColor(message.client.color);
            
              m.edit(unmuteEmbede);
            
            });
        })
      
   

},
};
