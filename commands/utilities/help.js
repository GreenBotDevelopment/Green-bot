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
            let Title = await message.translate(`Commande d'aide`)
            let Description = await message.translate(`● Bonjour , je suis ${message.client.user.tag} et mon préfixe est \`${prefix}\` 
● Pour de l'aide sur une commande : \`${prefix}help <commande>\`
● Pour me configurer , allez sur mon  [Dashboard](http://green-bot.tk/)`)
            const exampleEmbed = new Discord.MessageEmbed()
                .setColor(message.client.color || '#3A871F')

            .setAuthor(`${message.client.user.username} - ${Title}`, message.client.user.displayAvatarURL())
                .setDescription(Description)
                .addFields({ name: `${emoji.music} | Musique (${commands.filter(command => command.cat === "musique").size}) `, value: commands.filter(command => command.cat === "musique").map(command => `\`${command.name}\``).join(', ') })
                .addFields({ name: `${emoji.level} | Système de Niveau (${commands.filter(command => command.cat === "level").size}) `, value: commands.filter(command => command.cat === "level").map(command => `\`${command.name}\``).join(', ') })
                .addFields({ name: `${emoji.util} | Utilitaires (${commands.filter(command => command.cat === "utilities").size}) `, value: commands.filter(command => command.cat === "utilities").map(command => `\`${command.name}\``).join(', ') })
                .addFields({ name: `${emoji.moderator} | Modération (${commands.filter(command => command.cat === "moderation").size}) `, value: commands.filter(command => command.cat === "moderation").map(command => `\`${command.name}\``).join(', ') })
                .addFields({ name: `${emoji.configuration} | Configuration (${commands.filter(command => command.cat === "configuration").size}) `, value: commands.filter(command => command.cat === "configuration").map(command => `\`${command.name}\``).join(', ') })
                .addFields({ name: `🎁 | Giveaway (${commands.filter(command => command.cat === "gway").size}) `, value: commands.filter(command => command.cat === "gway").map(command => `\`${command.name}\``).join(', ') })
                .addFields({ name: `${emoji.fun}  | Fun (${commands.filter(command => command.cat === "fun").size})`, value: commands.filter(command => command.cat === "fun").map(command => `\`${command.name}\``).join(', ') })
                .addFields({ name: `${emoji.picture}  | Images (${commands.filter(command => command.cat === "pictures").size})`, value: commands.filter(command => command.cat === "pictures").map(command => `\`${command.name}\``).join(', ') })




            .addFields({ name: "Liens utliles", value: `
            [Dashboard](http://green-bot.tk/)-[Inviter le bot](https://discord.com/oauth2/authorize?client_id=${message.client.user.id}&scope=bot&permissions=8) - [Support](https://discord.gg/nrReAmApVJ) - [Github](https://github.com/pauldb09/Green-bot)` })



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
            return message.errorMessage(`La commande indiquée n\'est pas une commande valide !`);
        }
        let des = await message.translate(command.description)
        const reportEmbed = new Discord.MessageEmbed()
            .setTitle(`Commande  \`${command.name}\``)

        .setFooter(message.client.footer)

        .setColor(message.client.color)

        .addField("Description", `\`\`\`\n${des  || "Aucune description"}\`\`\``)
            .addField("Usage", `\`\`\`diff\n${prefix}${command.name} ${command.usage || ""}\`\`\``)
            .addField("Aliases", `\`\`\`https\n${command.aliases || "Aucune aliases"}\`\`\``);
        if (command.exemple) reportEmbed.addField('Exemple', `\`\`\`diff\n${prefix}${command.name} ${command.exemple}\`\`\``);
        if (command.permissions) reportEmbed.addField('Permissions', `\`\`\`diff\n${command.permissions}\`\`\``)


        message.channel.send(reportEmbed);

    },
};
