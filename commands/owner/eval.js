const { prefix } = require('../../config.json');
const Discord = require('discord.js');
module.exports = {
    name: 'eval',
    description: 'Evalue une variable',
    aliases: ['e', 'evaluate'],
    usage: '<variale>',
    cooldown: 5,
    guildOnly: true,
    owner: true,
    args: true,
    cat: 'owner',
    execute(message, args) {


        try {
            var code = args.join(" ");

            var evaled = eval(code);

            if (typeof evaled !== "string")
                evaled = require("util").inspect(evaled);

            const embed = new Discord.MessageEmbed()
                .setColor(message.client.color || '#3A871F')

            .addField(":inbox_tray: Entrée: ", `\`\`\`${code}\`\`\``)
                .addField(":outbox_tray: Sortie: ", `\`\`\`js\n${clean(evaled)}\n\`\`\``)
                .setFooter(message.client.footer || 'Green-Bot | Open source bot by 𝖕𝖆𝖚𝖑𝖉𝖇09#9846')

            message.channel.send({ embed })
        } catch (err) {
            const embed = new Discord.MessageEmbed()
                .setColor(message.client.color || '#3A871F')

            .addField(":inbox_tray: Entée: ", `\`\`\`${code}\`\`\``)
                .addField(":outbox_tray: Sortie: ", `\`\`\`${clean(err)}\`\`\``)
                .setFooter(message.client.footer || 'Green-Bot | Open source bot by 𝖕𝖆𝖚𝖑𝖉𝖇09#9846')

            message.channel.send({ embed })
        }

        function clean(text) {
            if (typeof(text) === 'string')
                return text.replace(/`/g, '`' + String.fromCharCode(8203)).replace(/@/g, '@' + String.fromCharCode(8203));
            else
                return text;
        }
    },
};