const config = require('../../config.json');
const Discord = require('discord.js');
const guild = require('../../database/models/guild');
const CmdModel = require('../../database/models/cmd');

const emoji = require('../../emojis.json');
module.exports = {
        name: 'help',
        description: '  Affiche une liste de toutes les commandes actuelles, triées par catégorie. Peut être utilisé en conjonction avec une commande pour plus d\'informations.',
        aliases: ['commands', 'aide', 'cmd', 'h'],
        usage: '[command name]',
        cat: 'utilities',
        cooldown: 5,
        async execute(message, args) {
            const data = [];
            const { commands } = message.client;
            let prefixget = await guild.findOne({ serverID: message.guild.id, reason: `prefix` }).sort()
            const prefix = prefixget.content;
            if (!args.length) {
                let customs = await CmdModel.find({ serverID: message.guild.id })
                let Title = await message.translate(`Commande d'aide - Green-bot`)
                let Description = await message.translate(`● Vous pouvez me configurer depuis mon [Dashboard](http://green-bot.xyz/commands) `)
                const exampleEmbed = new Discord.MessageEmbed()
                    .setColor(message.client.color)
                    .setDescription(`Commandes : **${commands.size}**\nVous pouvez me configurer **entièrement** depuis mon [Dashboard](http://green-bot.xyz/)`)
                    .setAuthor(`Liste des commande Green-bot`)
                    .setFooter(`Fait ${prefix}help <commande> pour de l'aide sur une commande !`, message.client.user.displayAvatarURL({ dynamic: true, size: 512 }))
                .addFields({ name: `${emoji.music} | Musique (${commands.filter(command => command.cat === "musique").size}) `, value: commands.filter(command => command.cat === "musique").map(command => `\`${command.name}\``).join(', ') })
                    .addFields({ name: `${emoji.level} | Système de Niveau (${commands.filter(command => command.cat === "level").size}) `, value: commands.filter(command => command.cat === "level").map(command => `\`${command.name}\``).join(', ') })
                    .addFields({ name: `${emoji.util} | Utilitaires (${commands.filter(command => command.cat === "utilities").size}) `, value: commands.filter(command => command.cat === "utilities").map(command => `\`${command.name}\``).join(', ') })
                    .addFields({ name: `${emoji.moderator} | Modération (${commands.filter(command => command.cat === "moderation").size}) `, value: commands.filter(command => command.cat === "moderation").map(command => `\`${command.name}\``).join(', ') })
                    .addFields({ name: `${emoji.configuration} | Configuration (${commands.filter(command => command.cat === "configuration").size}) `, value: commands.filter(command => command.cat === "configuration").map(command => `\`${command.name}\``).join(', ') })
                    .addFields({ name: `<:gift:829357477682085968> | Giveaway (${commands.filter(command => command.cat === "gway").size}) `, value: commands.filter(command => command.cat === "gway").map(command => `\`${command.name}\``).join(', ') })
                    .addFields({ name: `<:quiz:829357477966643220> | Jeux (${commands.filter(command => command.cat === "quiz").size}) `, value: commands.filter(command => command.cat === "quiz").map(command => `\`${command.name}\``).join(', ') });

                if (customs.filter(c => c.displayHelp === "ok").length > 0) exampleEmbed.addFields({ name: `<:panelconfig:830347712330203146> | Commandes personnalisées (${customs.filter(c=>c.displayHelp === "ok").length}) `, value: `${customs.filter(c=>c.displayHelp === "ok").map(command => `\`${command.name}\``).join(', ') || `Aucunne commandes personnalisée. [Créer une commande](http://green-bot.xyz/server/${message.guild.id}/customs/add)`} ` })

               exampleEmbed.addField("> Dashboard" ,`[Clique ici](http://green-bot.xyz/)` ,true)

                  exampleEmbed.addField("> Support" ,`[Clique Ici](http://green-bot.xyz/discord)` ,true)
                  exampleEmbed.addField("> Inviter" ,`[Clique ici](https://discord.com/oauth2/authorize?client_id=783708073390112830&scope=bot&permissions=8)` ,true)



            message.channel.send(exampleEmbed)
                .then(() => {


                })
                .catch(error => {

                    message.errorMessage(`Une erreur est survenue , surement les permissions`)
                });
            return;
        }

        const name = args[0].toLowerCase(), command = commands.get(name) || commands.find(c => c.aliases && c.aliases.includes(name));

        if (!command) return message.errorMessage(`Je n'ai aucunne commande ou aliases de nom : \`${name}\``);
                
        let des = await message.translate(command.description)
        
        const reportEmbed = new Discord.MessageEmbed()
            .setTitle(`${command.name}`)
.setDescription(command.description || "Aucunne description pour cette commande")
        .setFooter(message.client.footer)
        .setColor(message.client.color)
            .addField("> Usage", `${prefix}${command.name} ${command.usage || ""}`,true)
            .addField("> Exemple", `${command.exemple ? `${prefix}${command.name} ${command.exemple}` : "Aucun exemple"}`,true)
        .addField("Statut", "Satut de la commande : <:IconSwitchIconOn:825378657287274529>\nEn mp : " + `${command.guildOnly ? "<:icon_SwitchIconOff:825378603252056116>" :"<:IconSwitchIconOn:825378657287274529>"}`, true)
            .addField("> Aliases", `${command.aliases.join(', ') || "Aucune aliases"}`)
      .addField('> Permissions Requises', `${command.permissions || "Vous n'avez pas besoin de permission :)"}`)
      .addField('> Permissions du bot', `${command.botpermissions ? `${command.botpermissions}`: "Le bot n'a pas besoin de permissions :)"}`);


        message.channel.send(null, { embed: reportEmbed });

    },
};
