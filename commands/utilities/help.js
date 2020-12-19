const config = require('../../config.json');
const Discord = require('discord.js');
const guild = require('../../database/models/guild');
const emoji = require('../../emojis.json');
module.exports = {
    name: 'help',
    description: '  Affiche une liste de toutes les commandes actuelles, triées par catégorie. Peut être utilisé en conjonction avec une commande pour plus d\'informations.',
    aliases: ['commands'],
    usage: '[command name]',
    cat: 'utilities',
    cooldown: 5,
    async execute(message, args) {
        const data = [];
        const { commands } = message.client;
        let prefixget = await guild.findOne({ serverID: message.guild.id, reason: `prefix` })
        const prefix = prefixget.content;
        if (!args.length) {

            const exampleEmbed = new Discord.MessageEmbed()
                .setColor(message.client.color || '#3A871F')

            .setAuthor(`${message.client.user.username} - Commande d'aide`, message.client.user.displayAvatarURL())
                .setDescription(`● Bonjour , je suis ${message.client.user.tag} et mon préfixe est \`${prefix}\` 
                ● Je dispose de  \`${commands.size}\` commandes disponibles
             ● J'ai été codé par [𝖕𝖆𝖚𝖑𝖉𝖇09#9846](https://github.com/pauldb09/Green-bot) 
             ● Pour me configurer , allez sur mon  [Dashboard](http://green-bot.tk/) `)
                        .addFields({ name: `🥘 | Inter-serveur (${commands.filter(command => command.cat === "inter").size}) `, value: commands.filter(command => command.cat === "inter").map(command => `\`${command.name}\``).join(', ') })
                .addFields({ name: `${emoji.level} | Système de Niveau (${commands.filter(command => command.cat === "level").size}) `, value: commands.filter(command => command.cat === "level").map(command => `\`${command.name}\``).join(', ') })
                .addFields({ name: `${emoji.rpg} | Economy (${commands.filter(command => command.cat === "rpg").size}) `, value: commands.filter(command => command.cat === "rpg").map(command => `\`${command.name}\``).join(', ') })

            .addFields({ name: `${emoji.picture} | Images (${commands.filter(command => command.cat === "pictures").size}) `, value: commands.filter(command => command.cat === "pictures").map(command => `\`${command.name}\``).join(', ') })
                .addFields({ name: `${emoji.fun}  | Fun (${commands.filter(command => command.cat === "fun").size})`, value: commands.filter(command => command.cat === "fun").map(command => `\`${command.name}\``).join(', ') })
                .addFields({ name: `${emoji.util} | Utilitaires (${commands.filter(command => command.cat === "utilities").size}) `, value: commands.filter(command => command.cat === "utilities").map(command => `\`${command.name}\``).join(', ') })
                .addFields({ name: `${emoji.moderator} | Modération (${commands.filter(command => command.cat === "moderation").size}) `, value: commands.filter(command => command.cat === "moderation").map(command => `\`${command.name}\``).join(', ') })
                .addFields({ name: `${emoji.configuration} | Configuration (${commands.filter(command => command.cat === "configuration").size}) `, value: commands.filter(command => command.cat === "configuration").map(command => `\`${command.name}\``).join(', ') })
                .addFields({ name: `${emoji.role} | Roles à réaction (${commands.filter(command => command.cat === "rr").size}) `, value: commands.filter(command => command.cat === "rr").map(command => `\`${command.name}\``).join(', ') })


                .addFields({ name: `${emoji.owner} | Owner (${commands.filter(command => command.cat === "owner").size})`, value: commands.filter(command => command.cat === "owner").map(command => `\`${command.name}\``).join(', ') })



            .addFields({ name: "Liens utliles", value: `
            [Dashboard](http://green-bot.tk/)-[Inviter le bot](https://discord.com/oauth2/authorize?client_id=${message.client.id}&scope=bot&permissions=8) - [Support](https://discord.gg/X6jZrUf) - [Github](https://github.com/pauldb09/Green-bot)` })

            .setFooter(config.footer || 'Green-bot - open source', message.client.user.displayAvatarURL());


            return message.channel.send(exampleEmbed)
                .then(() => {
                    if (message.channel.type === 'dm') return;

                })
                .catch(error => {
                    console.error(`Could not send help DM to ${message.author.tag}.\n`, error);
                    message.reply('it seems like I can\'t DM you!');
                });
        }

        const name = args[0].toLowerCase();
        const command = commands.get(name) || commands.find(c => c.aliases && c.aliases.includes(name));

        if (!command) {
            return message.reply(`${emoji.error} La commande indiqué n\'est pas une commande valide !`);
        }
        const reportEmbed = new Discord.MessageEmbed()
            .setTitle(`Commande  \`${command.name}\``)

        .setFooter(message.client.footer || 'Green-Bot | Open source bot by 𝖕𝖆𝖚𝖑𝖉𝖇09#9846')

        .setColor(message.client.color || '#3A871F')

        .addField("Description", `\`\`\`\n${command.description || "Aucune description"}\`\`\``)
            .addField("Usage", `\`\`\`diff\n${prefix}${command.name} ${command.usage || ""}\`\`\``)
            .addField("Aliases", `\`\`\`https\n${command.aliases || "Aucune aliases"}\`\`\``);
        if (command.exemple) reportEmbed.addField('Exemple', `\`\`\`diff\n${prefix}${command.name} ${command.exemple}\`\`\``);
        if (command.permissions) reportEmbed.addField('Permissions', `\`\`\`diff\n${command.permissions}\`\`\``)


        message.channel.send(reportEmbed);

    },
};
