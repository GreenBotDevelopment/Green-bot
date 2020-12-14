const config = require('../../config.json');
const Discord = require('discord.js');
const emoji = require('../../emojis.json');
module.exports = {
    name: 'publish',
    description: ' Publie une commande',
    args: true,
    usage: '[command name]',
    cat: 'owner',
    owner: true,
    cooldown: 5,
    async execute(message, args) {
        const data = [];
        const { commands } = message.client;



        const name = args[0].toLowerCase();
        const command = commands.get(name) || commands.find(c => c.aliases && c.aliases.includes(name));

        if (!command) {
            return message.reply(`${emoji.error} La commande indiquée n\'est pas une commande valide !`);
        }
        let sugg = message.guild.channels.cache.get(config.supportID)
        if (!sugg) return message.channel.send(`${emoji.error} Je n'arrive pas à trouver le salon <#${config.supportID}>... vérifiez mes permissions ou si le salon existe encore !`)
        const reportEmbed = new Discord.MessageEmbed()
            .setTitle(`Nouvelle commande ! :  \`${command.name}\``)

        .setFooter(message.client.footer || 'Green-Bot | Open source bot by 𝖕𝖆𝖚𝖑𝖉𝖇09#9846')

        .setColor(message.client.color || '#3A871F')

        .addField("Description", `\`\`\`\n${command.description || "Aucune description"}\`\`\``)
            .addField("Usage", `\`\`\`diff\n${config.prefix}${command.name} ${command.usage || ""}\`\`\``)
            .addField("Aliases", `\`\`\`https\n${command.aliases || "Aucune aliases"}\`\`\``);
        if (command.exemple) reportEmbed.addField('Exemple', `\`\`\`diff\n${config.prefix}${command.name} ${command.exemple}\`\`\``);
        if (command.permissions) reportEmbed.addField('Permissions', `\`\`\`diff\n${command.permissions}\`\`\``)
        if (command.owner) reportEmbed.addField('Pour l\'owner ?', `\`\`\`diff\nOui\`\`\``)


        sugg.send(reportEmbed);
        message.channel.send(`${emoji.succes} Commande publiée avec succès dans le salon <#${config.supportID}>`)
    },
};