const Discord = require('discord.js');
module.exports = {
    name: 'massrole',
    description: 'Ajoute/elève un rôle à tous les membres du serveur',
    cat: 'moderation',
    aliases: ["mass_role", "role-all"],
    guildOnly: true,
    usage: '<add/remove> @role',
    exemple: 'add @user\nremove @bot',
    permissions: ['MANAGE_GUILD'],
    botpermissions: ['MANAGE_ROLES'],
    async execute(message, args) {
        const lang = await message.translate("MASSROLE")
        if (!args.length) {
            let embed = new Discord.MessageEmbed()
                .setAuthor(`${message.author.username}`, message.author.displayAvatarURL({ dynamic: true, size: 512 }))
                .setColor("#F0B02F")
                .setTitle(`Massrole`)
                .setDescription(lang.desc)
                .addField(lang.field1T, lang.field1D.replace("{prefix}", message.guild.settings.prefix))
                .addField(lang.field2T, lang.field2D.replace("{prefix}", message.guild.settings.prefix))
                .addField(lang.field3T, lang.field3D.replace("{prefix}", message.guild.settings.prefix))
                .setThumbnail(url = message.client.user.displayAvatarURL({ dynamic: true, size: 512 }))
                .setFooter(message.client.footer, message.client.user.displayAvatarURL({ dynamic: true, size: 512 }))
            message.reply({
                embeds: [embed],
                allowedMentions: { repliedUser: false }
            }).then((m) => {
                if (!message.channel.permissionsFor(message.guild.me).has("MANAGE_MESSAGES")) return;
                if (!message.channel.permissionsFor(message.guild.me).has("ADD_REACTIONS")) return;
                m.react("✅")
                const filter = (reaction, user) => reaction.emoji.name === '✅' && user.id === message.author.id;
                const collector = m.createReactionCollector({ filter, time: 1000000 });
                collector.on('collect', r => m.delete());
                collector.on('end', collected => m.reactions.removeAll());
            });
            return
        }
        const millisToMinutesAndSeconds = (millis) => {
            var minutes = Math.floor(millis / 60000);
            var seconds = ((millis % 60000) / 1000).toFixed(0);
            return `${minutes}:${(seconds < 10 ? "0" : "")}${seconds}`;
        }
        if (args[0] === "add") {
            try {
                let role = message.mentions.roles.first() || message.guild.roles.cache.get(args[1]) || message.guild.roles.cache.filter(m => m.name.includes(args.join(" "))).first();
                if (!role || role.name === '@everyone' || role.name === 'here') {
                    let err = await message.translate("ERROR_ROLE")
                    return message.errorMessage(err);
                }
                if (message.guild.me.roles.highest.comparePositionTo(role) < 0) {
                    const langA = await message.translate("ROLES")
                    return message.errorMessage(langA.position);
                }
                const guild = message.guild
                let u = 0;

                function addRole(member, role) {
                    setTimeout(async() => {
                        if (guild.members.cache.get(member.id)) {
                            await member.roles.add(role.id).catch(error => console.log('Couldn\'t add role for member ' + member.id + ':', error));
                        }
                    }, 5000)
                }
                let embed = new Discord.MessageEmbed()
                    .setAuthor(`${message.author.username}`, message.author.displayAvatarURL({ dynamic: true, size: 512 }))

                .setColor("#F0B02F")
                    .setTitle(`Massrole`)
                    .setDescription(lang.adding1)
                    .setFooter(message.client.footer, message.client.user.displayAvatarURL({ dynamic: true, size: 512 }))


                message.reply({
                    embeds: [embed],
                    allowedMentions: { repliedUser: false }
                }).then((m) => {
                    guild.members.fetch().then((members) => {
                        let memberCount = members.filter(u => !u.roles.cache.has(role.id)).size
                        members.filter(u => !u.roles.cache.has(role.id)).forEach(membera => {
                            u = u + 1
                            let embed2;
                            if (u == memberCount) {
                                let time = message.guild.memberCount * 500;
                                embed2 = new Discord.MessageEmbed()
                                    .setAuthor(`${message.author.username}`, message.author.displayAvatarURL({ dynamic: true, size: 512 }))

                                .setColor("#F0B02F")
                                    .setTitle(`Massrole`)
                                    .setDescription(lang.addingOK.replace("{role}", role).replace("{count}", memberCount).replace("{time}", millisToMinutesAndSeconds(time)))
                                    .setFooter(message.client.footer, message.client.user.displayAvatarURL({ dynamic: true, size: 512 }))

                            } else {
                                embed2 = new Discord.MessageEmbed()
                                    .setAuthor(`${message.author.username}`, message.author.displayAvatarURL({ dynamic: true, size: 512 }))

                                .setColor("#F0B02F")
                                    .setTitle(`Massrole`)
                                    .setDescription(lang.adding2.replace("{u}", u).replace("{count}", memberCount))
                                    .setFooter(message.client.footer, message.client.user.displayAvatarURL({ dynamic: true, size: 512 }))

                            }


                            m.edit({ embeds: [embed2] })
                            addRole(membera, role)

                        });
                    });
                })

            } catch (err) {
                if (message.client.log) console.log(err)
                return message.errorMessage(`Une erreur est suvenue , vérifiez la hiérachie`)
            }

        } else if (args[0] === "remove") {
            try {
                let role = message.mentions.roles.first() || message.guild.roles.cache.get(args[1]) || message.guild.roles.cache.filter(m => m.name.includes(args.join(" "))).first();
                if (!role || role.name === '@everyone' || role.name === 'here') {
                    let err = await message.translate("ERROR_ROLE")
                    return message.errorMessage(err);
                }

                if (message.guild.me.roles.highest.comparePositionTo(role) < 0) {
                    const langA = await message.translate("ROLES")
                    return message.errorMessage(langA.position);
                }
                const guild = message.guild
                let u = 0;

                function addRole(member, role) {
                    setTimeout(async() => {
                        if (guild.members.cache.get(member.id)) {
                            await member.roles.remove(role.id).catch(error => console.log('Couldn\'t add role for member ' + member.id + ':', error));
                        }
                    }, 5000)
                }
                let embed = new Discord.MessageEmbed()
                    .setAuthor(`${message.author.username}`, message.author.displayAvatarURL({ dynamic: true, size: 512 }))

                .setColor("#F0B02F")
                    .setTitle(`Massrole`)
                    .setDescription(lang.remove1)
                    .setFooter(message.client.footer, message.client.user.displayAvatarURL({ dynamic: true, size: 512 }))


                message.reply({
                    embeds: [embed],
                    allowedMentions: { repliedUser: false }
                }).then((m) => {
                    guild.members.fetch().then((members) => {
                        let memberCount = members.filter(u => u.roles.cache.has(role.id)).size

                        members.filter(u => u.roles.cache.has(role.id)).forEach(membera => {
                            u = u + 1

                            let embed2;
                            if (u == memberCount) {
                                let time = memberCount * 5000;

                                embed2 = new Discord.MessageEmbed()
                                    .setAuthor(`${message.author.username}`, message.author.displayAvatarURL({ dynamic: true, size: 512 }))

                                .setColor("#F0B02F")
                                    .setTitle(`Massrole`)
                                    .setDescription(lang.removeOK.replace("{role}", role).replace("{count}", memberCount).replace("{time}", millisToMinutesAndSeconds(time)))
                                    .setFooter(message.client.footer, message.client.user.displayAvatarURL({ dynamic: true, size: 512 }))

                            } else {
                                embed2 = new Discord.MessageEmbed()
                                    .setAuthor(`${message.author.username}`, message.author.displayAvatarURL({ dynamic: true, size: 512 }))

                                .setColor("#F0B02F")
                                    .setTitle(`Massrole`)
                                    .setDescription(lang.remove2.replace("{u}", u).replace("{count}", memberCount))
                                    .setFooter(message.client.footer, message.client.user.displayAvatarURL({ dynamic: true, size: 512 }))

                            }

                            m.edit({ embeds: [embed2] })
                            addRole(membera, role)

                        });
                    });
                })

            } catch (err) {
                if (message.client.log) console.log(err)
                return message.errorMessage(`Une erreur est suvenue , vérifiez la hiérachie`)
            }

        } else {
            let embed = new Discord.MessageEmbed()
                .setAuthor(`${message.author.username}`, message.author.displayAvatarURL({ dynamic: true, size: 512 }))

            .setColor("#F0B02F")
                .setTitle(`Massrole`)
                .setDescription(lang.desc)
                .addField(lang.field1T, lang.field1D.replace("{prefix}", message.guild.settings.prefix))
                .addField(lang.field2T, lang.field2D.replace("{prefix}", message.guild.settings.prefix))
                .addField(lang.field3T, lang.field3D.replace("{prefix}", message.guild.settings.prefix))

            .setThumbnail(url = message.client.user.displayAvatarURL({ dynamic: true, size: 512 }))

            .setFooter(message.client.footer, message.client.user.displayAvatarURL({ dynamic: true, size: 512 }))


            message.reply({
                embeds: [embed],
                allowedMentions: { repliedUser: false }
            }).then((m) => {
                if (!message.channel.permissionsFor(message.guild.me).has("MANAGE_MESSAGES")) return;
                if (!message.channel.permissionsFor(message.guild.me).has("ADD_REACTIONS")) return;
                m.react("✅")

                const filter = (reaction, user) => reaction.emoji.name === '✅' && user.id === message.author.id;
                const collector = m.createReactionCollector({ filter, time: 1000000 });
                collector.on('collect', r => m.delete());
                collector.on('end', collected => m.reactions.removeAll());




            });
        }



    },
};