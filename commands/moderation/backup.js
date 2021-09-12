const fs = require('fs')
var backups = JSON.parse(fs.readFileSync("./Data/backups.json", "utf8"));
const hastebins = require("hastebin-gen");
const Discord = require('discord.js')
const Backup = require('../../database/models/backup');
module.exports = {
        name: 'backup',
        description: 'Gére vos backups',
        botpermissons: ['ADMINISTRATOR'],
        permissions: ['ADMINISTRATOR'],
        aliases: ['bcp'],
        cooldown: 10,
        cat: 'antiraid',
        async execute(message, args) {
            const lang = await message.translate("BACKUP")

            function makeid(length) {
                var result = "";
                var characters =
                    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
                var charactersLength = characters.length;
                for (var i = 0; i < length; i++) {
                    result += characters.charAt(
                        Math.floor(Math.random() * charactersLength)
                    );
                }
                return result;
            }

            function save() {
                fs.writeFile("./Data/backups.json", JSON.stringify(backups), err => {
                    if (err) console.error(err);
                });
            }
            if (!args[0]) {
                let tip = await message.translate("DASHBOARD")

                let embed = new Discord.MessageEmbed()
                    .setAuthor(`${message.author.username}`, message.author.displayAvatarURL({ dynamic: true, size: 512 }))
                    .setColor("#F0B02F")
                    .setTitle(`${message.guild.settings.lang === "fr" ? "Sauvegardes":"Backups"}`)
                    .setDescription(tip)
                    .addField(`${message.guild.settings.lang === "fr" ? "`📜` Utilisation":"`📜` Use"}`, lang.desc.replace("{prefix}", message.guild.settings.prefix).replace("{prefix}", message.guild.settings.prefix).replace("{prefix}", message.guild.settings.prefix).replace("{prefix}", message.guild.settings.prefix))
            .setThumbnail(url = message.client.user.displayAvatarURL({ dynamic: true, size: 512 }))
            .setFooter(message.client.footer, message.client.user.displayAvatarURL({ dynamic: true, size: 512 }))
            message.reply({ embeds: [embed],allowedMentions: { repliedUser: false }
 }).then((m) => {
                if (!message.channel.permissionsFor(message.guild.me).has("MANAGE_MESSAGES")) return;
                if (!message.channel.permissionsFor(message.guild.me).has("ADD_REACTIONS")) return;
                m.react("✅")

                const filter = (reaction, user) => reaction.emoji.name === '✅' && user.id === message.author.id;
                const collector = m.createReactionCollector({ filter, time: 1000000 });
                collector.on('collect', r => m.delete());
                collector.on('end', collected => m.reactions.removeAll());




            });
            return;
        }
        const client = message.client;


        if (args[0] === "create" || args[0] === "c") {
            const unmuteEmbed = new Discord.MessageEmbed()
                .setTitle('<a:green_loading:824308769713815612> Creating the backup...')
                .setDescription(`${message.guild.settings.lang === "fr" ? "Création de la backup en cours...":"Backup creation in progress, please wait"}`)
                .setFooter(message.client.footer)
                .setColor(message.guild.settings.color);
            message.channel.send({ embeds: [unmuteEmbed] }).then(async m => {
                let id = makeid(16);

                const channels = message.guild.channels.cache
                    .sort(function(a, b) {
                        return a.position - b.position;
                    })
                    .array()
                    .map(c => {
                        const channel = {
                            type: c.type,
                            name: c.name,
                            postion: c.calculatedPosition
                        };
                        if (c.parent) channel.parent = c.parent.name;
                        return channel;
                    });

                const roles = message.guild.roles.cache
                    .filter(r => r.name !== "@everyone")
                    .sort(function(a, b) {
                        return a.position - b.position;
                    })
                    .array()
                    .map(r => {
                        const role = {
                            name: r.name,
                            color: r.color,
                            hoist: r.hoist,
                            permissions: r.permissions,
                            mentionable: r.mentionable,
                            position: r.position
                        };
                        return role;
                    });

                if (!backups[message.author.id]) backups[message.author.id] = {};
                backups[message.author.id][id] = {
                    icon: message.guild.iconURL(),
                    name: message.guild.name,
                    owner: message.guild.OWNER,
                    members: message.guild.memberCount,
                    createdAt: message.guild.createdAt,
                    roles,
                    channels
                };
                save();
                const unmuteEmbedee = new Discord.MessageEmbed()
                    .setTitle(`✅ ${message.guild.settings.lang === "en" ? "Backup succefully created":"Backup crée avec succès"}.`)
                    .setDescription(`${message.guild.settings.lang === "fr" ? "Vous êtes le propriétaire de cette sauvegarde , vous seul pouvez l'utiliser.":"You are the owner of this backup, only you can use it."}`)
                    .addField(`${message.guild.settings.lang === "fr" ? "Pour la charger":"To load it"} :`, `
                  \`\`\`*backup load ${id}\`\`\`
                  `).addField(`${message.guild.settings.lang === "fr" ? "Pour des infos":"For informations"} :`, `
                  \`\`\`*backup info ${id}\`\`\`
                  `)
                    .setFooter(message.client.footer)
                    .setColor(message.guild.settings.color);
                m.edit({ embeds: [unmuteEmbedee] })


            });
        } else if (args[0] === "info" || args[0] === "i") {
            let id = args[1];
            if (!id) {
                return message.errorMessage(`${message.guild.settings.lang === "fr" ? "Vous devez fournir l'ID de la sauvegarde à supprimer.":"You must provide the ID of the backup to be deleted."}`)
            }
            if (!backups[message.author.id])
                return message.errorMessage(`${message.guild.settings.lang === "fr" ? "Vous n'avez aucunne backup avec cette ID.":"You don't have any backups with this ID."}`)
            if (!backups[message.author.id][id])
                return message.errorMessage(`${message.guild.settings.lang === "fr" ? "Vous n'avez aucunne backup avec cette ID.":"You don't have any backups with this ID."}`)


            try {
                let embed = new Discord.MessageEmbed()
                    .setTitle(backups[message.author.id][id].name)
                    .setThumbnail(backups[message.author.id][id].icon)
                    .setColor(message.guild.settings.color)
                    .setFooter(message.client.footer, message.client.user.displayAvatarURL({ dynamic: true, size: 512 }))

                .addField(
                        "Owner ",
                        `<@${backups[message.author.id][id].owner}>`,
                        true
                    )
                    .addField(`${message.guild.settings.lang === "fr" ? "Membres":"Members"}`,  `${backups[message.author.id][id].members}`, true)
                            .addField(`${message.guild.settings.lang === "fr" ? "Date de création":"Creation date"}`,`${backups[message.author.id][id].createdAt }`)
                    .addField(
                        `${message.guild.settings.lang === "fr" ? "Salons":"Channels"}`,
                        `\`\`\`${backups[message.author.id][id].channels
                .map(channel => channel.name)
                .join("\n")}\`\`\``,
                        true
                    )
                    .addField(
                        "Roles",
                        `\`\`\`${backups[message.author.id][id].roles
                .map(role => role.name)
                .join("\n")}\`\`\``,
                        true
                    );
                message.reply({ embeds: [embed],allowedMentions: { repliedUser: false }
 });
            } catch (e) {
                hastebins(
                    backups[message.author.id][id].channels
                    .map(channel => channel.name)
                    .join("\n"),
                    "txt"
                ).then(ch => {
                    hastebins(
                        backups[message.author.id][id].roles
                        .map(role => role.name)
                        .join("\n"),
                        "txt"
                    ).then(ro => {
                        let embed = new Discord.MessageEmbed()
                            .setTitle(backups[message.author.id][id].name)
                            .setThumbnail(backups[message.author.id][id].icon)
                            .addField(
                                "Owner",
                                `<@${backups[message.author.id][id].owner}>`,
                                true
                            )
                            .addField(`${message.guild.settings.lang === "fr" ? "Membres":"Members"}`,  `${backups[message.author.id][id].members}`, true)
                            .addField(`${message.guild.settings.lang === "fr" ? "Date de création":"Creation date"}`,`${backups[message.author.id][id].createdAt }`)
                            .addField(`${message.guild.settings.lang === "fr" ? "Salons":"Channels"}`, ch || "Err", true)
                            .addField("Roles", ro || "Err", true);
                        message.reply({ embeds: [embed],allowedMentions: { repliedUser: false }
 });
                    });
                });
            }
        } else if (args[0] === "delete") {
            let backupID = args[1];
            if (!backupID) {
                return message.errorMessage(`${message.guild.settings.lang === "fr" ? "Vous devez fournir l'ID de la sauvegarde à supprimer.":"You must provide the ID of the backup to be deleted."}`)
            }
            if (!backups[message.author.id])
                return message.errorMessage(`${message.guild.settings.lang === "fr" ? "Vous n'avez aucunne backup avec cette ID.":"You don't have any backups with this ID."}`)
            if (!backups[message.author.id][backupID])
                return message.errorMessage(`${message.guild.settings.lang === "fr" ? "Vous n'avez aucunne backup avec cette ID.":"You don't have any backups with this ID."}`)


            delete backups[message.author.id][backupID];
            save();
            message.succesMessage(`${message.guild.settings.lang === "fr" ? "La backup a bien été supprimée":"The backup has been succesfully deleted"}`)


        } else if (args[0] === "load") {
            if (message.author.id !== message.guild.OWNER) {
                return message.errorMessage(`${message.guild.settings.lang === "fr" ? "Seulement l'owner du serveur peut charger une sauvegarde sur le serveur.":"Only the server owner can load a backup on the server."}`)
            }
            let code = args[1];
            if (!code) {
                return message.errorMessage(`${message.guild.settings.lang === "fr" ? "Vous devez fournir l'ID de la sauvegarde à supprimer.":"You must provide the ID of the backup to be deleted."}`)
            }
            if (!backups[message.author.id])
                return message.errorMessage(`${message.guild.settings.lang === "fr" ? "Vous n'avez aucunne backup avec cette ID.":"You don't have any backups with this ID."}`)
            if (!backups[message.author.id][code])
                return message.errorMessage(`${message.guild.settings.lang === "fr" ? "Vous n'avez aucunne backup avec cette ID.":"You don't have any backups with this ID."}`)


            message.guild.channels.cache.forEach(channel => {
                channel.delete({ reason: "Pour charger une backup" });
            });

            message.guild.roles.cache
                .filter(role => !role.managed)
                .forEach(role => {
                    role.delete({ reason: "Pour charger une backup" });
                });
            await backups[message.author.id][code].roles.forEach(async function(
                role
            ) {
                message.guild.roles.create({
                        name: role.name,
                        color: role.color,
                        permissions: role.permissions,
                        hoist: role.hoist,
                        mentionable: role.mentionable,
                        position: role.position,
                        reason: 'Chargement de la backup',
                    })
                    .then(role => {
                        role.setPosition(role.position);
                    });
            });

            await backups[message.author.id][code].channels
                .filter(c => c.type === "category")
                .forEach(async function(ch) {
                    message.guild.channels.create(ch.name, {
                        type: ch.type,
                        permissionOverwrites: ch.permissionOverwrites
                    });
                });

            await backups[message.author.id][code].channels
                .filter(c => c.type !== "category")
                .forEach(async function(ch) {
                    message.guild.channels.create(ch.name, {
                        type: ch.type,
                        permissionOverwrites: ch.permissionOverwrites
                    }).then(c => {
                        const parent = message.guild.channels.cache
                            .filter(c => c.type === "category")
                            .find(c => c.name === ch.parent);
                        ch.parent ? c.setParent(parent) : "";
                    });
                });
            message.guild.setName(backups[message.author.id][code].name);
            message.guild.setIcon(backups[message.author.id][code].icon);

        } else {
            let tip = await message.translate("DASHBOARD")

            let embed = new Discord.MessageEmbed()
                .setAuthor(`${message.author.username}`, message.author.displayAvatarURL({ dynamic: true, size: 512 }))

            .setColor("#F0B02F")
                .setTitle(`${message.guild.settings.lang === "fr" ? "Sauvegardes":"Backups"}`)
                .setDescription(tip)

            .addField(`${message.guild.settings.lang === "fr" ? "`📜` Utilisation":"`📜` Use"}`, lang.desc.replace("{prefix}", message.guild.settings.prefix).replace("{prefix}", message.guild.settings.prefix).replace("{prefix}", message.guild.settings.prefix).replace("{prefix}", message.guild.settings.prefix))



            .setThumbnail(url = message.client.user.displayAvatarURL({ dynamic: true, size: 512 }))

            .setFooter(message.client.footer, message.client.user.displayAvatarURL({ dynamic: true, size: 512 }))


            message.reply({ embeds: [embed],allowedMentions: { repliedUser: false }
 }).then((m) => {
                if (!message.channel.permissionsFor(message.guild.me).has("MANAGE_MESSAGES")) return;
                if (!message.channel.permissionsFor(message.guild.me).has("ADD_REACTIONS")) return;
                m.react("✅")

                const filter = (reaction, user) => reaction.emoji.name === '✅' && user.id === message.author.id;
                const collector = m.createReactionCollector({ filter, time: 1000000 });
                collector.on('collect', r => m.delete());
                collector.on('end', collected => m.reactions.removeAll());




            });
            return;


        }
    },
};