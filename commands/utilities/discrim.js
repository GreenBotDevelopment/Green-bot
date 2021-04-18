const Discord = require('discord.js');
const Welcome = require('../../database/models/Welcome')
const emoji = require('../../emojis.json')

module.exports = {
        name: 'discrim',
        description: 'Montre combien de personnes ont un certain discriminateur sur le serveur',
        cat: 'utilities',

        aliases: ['role_num'],
        guildOnly: true,
        usage: '<discrim>',
        exemple: '#0001',
        async execute(message, args) {

            let discrim = args[0];
            if (!discrim) {
                return message.errorMessage(`Veuillez fournir un discriminateur valide valide.`);
            }


            if (message.guild.memberCount !== message.guild.members.cache.size) await message.guild.members.fetch()

            const u = message.guild.members.cache.filter(m => m.user.discriminator === discrim);

            if (u.size == 0) return message.errorMessage(`Il n'y a personne dans le serveur qui a pour discriminateur \`${discrim}\``)
            const embed = new Discord.MessageEmbed()

            .setAuthor(`${message.author.username}`, message.author.displayAvatarURL({ dynamic: true, size: 512 }))

            .setColor(message.client.color)
                .setDescription(`Voici les **${u.size}** personnes qui ont le discriminateur ${discrim}`)
                .addField(`Personnes (${u.size})`, `${u.size > 20 ? `${u.map(x => `\`${x.user.tag}\``).slice(0,20 )} Et **${u.size - 20}** autres personnes ` : u.map(x => `\`${x.user.tag}\``)}`, true)
            .addField('Vous voulez des statistiques sur les discriminateurs  sur votre serveur ? ', `[Invitez moi](http://green-bot.xyz/invite)`)


        .setFooter(message.client.footer, message.client.user.displayAvatarURL({ dynamic: true, size: 512 }))


        message.channel.send(embed)


    },
};