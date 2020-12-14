const Discord = require('discord.js');
const sendErrorMessage = require('../../util.js');
const Welcome = require('../../database/models/guild');
const emoji = require('../../emojis.json')
const { oneLine } = require('common-tags');
module.exports = {
    name: 'setlevel',
    description: 'Active ou désactive le système de niveaux',
    aliases: ['level-system'],

    cat: 'level',
    args: true,
    usage: 'on/off',
    exemple: 'on',
    permissions: ['MANAGE_GUILD'],
    async execute(message, args) {
        if (args[0] === 'off') {
            const verify = await Welcome.findOne({ serverID: message.guild.id, reason: `level` })
            if (verify) {
                const newchannel = await Welcome.findOneAndDelete({ serverID: message.guild.id, reason: `level` });

                const embed = new Discord.MessageEmbed()

                .setTitle('Paramètres : `Plugin de niveau`')
                    .setDescription(`le système de niveau a été désactivé avec succès. ${emoji.succes}`)
                    .addField('Status', `activé ➔ désactivé`)
                    .setThumbnail(message.guild.iconURL({ dynamic: true }))
                    .setFooter(message.client.footer)

                .setColor("#2f3136");

                return message.channel.send(embed)
            } else {
                return message.channel.send(`${emoji.error} Vous devez avoir une configuration pour la supprimer`)
            }

        }
        if (args[0] === 'on') {
            const verify = await Welcome.findOne({ serverID: message.guild.id, reason: `level` })
            if (verify) {
                return message.channel.send(`${emoji.error} le plugin de niveau est déja activé dans ce serveur...`);

            } else {
                const verynew = new Welcome({
                    serverID: `${message.guild.id}`,
                    content: `hy`,
                    reason: 'level',
                }).save();
                return message.channel.send(`${emoji.succes} le plugin de niveau est désormais activé dans ce serveur !`);

            }


        } else {
            return message.channel.send(`${emoji.error} Veuillez mettre un argument , on ou off !`)
        }












    },
};