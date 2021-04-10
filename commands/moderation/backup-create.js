const backup = require("discord-backup");

const Discord = require('discord.js')
const emoji = require('../../emojis.json')
const Backup = require('../../database/models/backup');
module.exports = {
    name: 'backup-create',
    description: 'crée une backup du seveur',
    botpermissons: ['ADMINISTRATOR'],
    permissions: ['ADMINISTRATOR'],
    aliases: ['b-create'],
    cooldown: 60000,
    cat: 'moderation',
    async execute(message, args) {

        const client = message.client;
        const unmuteEmbed = new Discord.MessageEmbed()
            .setTitle('Création de la backup...')
            .setDescription(`Enregistrement de :
            **${message.guild.channels.cache.size}** salons 
           ** ${message.guild.roles.cache.size}** Rôles
            **${message.guild.emojis.cache.size}** Emojis
            -Du nom du serveur et de l'icone.

            `)
            .setFooter(message.client.footer)
            .setColor(message.client.color);
        message.channel.send(unmuteEmbed).then(async m => {
            await backup.create(message.guild, {
                jsonBeautify: true,
                maxMessagesPerChannel: 0,
                doNotBackup: ["bans"],
                saveImages: "url"
            }).then((backupData) => {
                var chars = "ABCDEFGHIJKLMNOPQRSTUVWXTZabcdefghiklmnopqrstuvwxyz";
                var string_length = 10;
                var randomstring = '';

                for (var x = 0; x < string_length; x++) {

                    var letterOrNumber = Math.floor(Math.random() * 2);
                    if (letterOrNumber == 0) {
                        var newNum = Math.floor(Math.random() * 9);
                        randomstring += newNum;
                    } else {
                        var rnum = Math.floor(Math.random() * chars.length);
                        randomstring += chars.substring(rnum, rnum + 1);
                    }

                }
                const uniqID = randomstring;
                let dateee = Date.now();
                const date = new Date(dateee);
                const yyyy = date.getFullYear().toString(),
                    mm = (date.getMonth() + 1).toString(),
                    dd = date.getDate().toString();
                const formatedDate = `${yyyy}/${(mm[1]?mm:"0"+mm[0])}/${(dd[1]?dd:"0"+dd[0])}`;
                const newbackup = new Backup({
                    autorID: `${message.author.id}`,
                    MessageID: `${backupData.id}`,
                    RealID: `${uniqID}`,
                    Date: `${formatedDate}`,
                    Size: `${backupData.size}`,
                    ChannelsCount: `${message.guild.channels.cache.size}`,
                    RoleCount: `${message.guild.roles.cache.size}`,
              }).save()
                const unmuteEmbedee = new Discord.MessageEmbed()
                    .setTitle(`${emoji.succes} Backup crée avec succès.`)
                    .setDescription(`Vous êtes le propriétaire de cette sauvegarde , vous seul pouvez l'utiliser.`)
                    .addField(`Pour la charger :`, `
                  \`\`\`*backup-load ${uniqID}\`\`\`
                  `).addField(`Pour des infos :`, `
                  \`\`\`*backup-info ${uniqID}\`\`\`
                  `)
                    .setFooter(message.client.footer)
                    .setColor(message.client.color);
                m.edit(unmuteEmbedee)


            });
        })



    },
};