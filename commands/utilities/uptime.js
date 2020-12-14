const Discord = require('discord.js');
const moment = require('moment');
module.exports = {
    name: 'uptime',
    description: 'Récupère la disponibilité actuelle de de Green',

    cat: 'utilities',

    execute(message) {
        const d = moment.duration(message.client.uptime);
        const days = (d.days() == 1) ? `${d.days()} jour` : `${d.days()} jours`;
        const hours = (d.hours() == 1) ? `${d.hours()} heure` : `${d.hours()} heures`;
        const minutes = (d.minutes() == 1) ? `${d.minutes()} minute` : `${d.minutes()} minutes`;
        const seconds = (d.seconds() == 1) ? `${d.seconds()} seconde` : `${d.seconds()} secondes`;
        const date = moment().subtract(d, 'ms').format('DD/MM/YYYY');
        const embed = new Discord.MessageEmbed()
            .setTitle(`UPTIME DE ${message.client.user.username}`)

        .setDescription(`\`${days}\`, \`${hours}\`, \`${minutes}\`, et \`${seconds}\``)
            .addField('Date de la dernière mise à jour', date)
            .setFooter(message.client.footer)

        .setColor(message.client.color);
        message.channel.send(embed);

    },
};