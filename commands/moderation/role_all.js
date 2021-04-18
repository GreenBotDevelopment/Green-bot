const Discord = require('discord.js');
const Welcome = require('../../database/models/Welcome')
const emoji = require('../../emojis.json')

module.exports = {
    name: 'role_all',
    description: 'Ajoute/elève un rôle à tous les membres du serveur',

    cat: 'admin',

    guildOnly: true,
    usage: '<add/remove> @role',
    exemple: 'add @membre\nremove @bot',
    permissions: ['MANAGE_GUILD'],
    botpermissions: ['MANAGE_ROLES'],

    async execute(message, args) {

        if (!args.length) {
            let embed = new Discord.MessageEmbed()
                .setAuthor(`${message.author.username}`, message.author.displayAvatarURL({ dynamic: true, size: 512 }))

            .setColor("#F0B02F")
                .setTitle(`Rôle All`)
                .setDescription(`Vous devez fournir un argument pour cette commande .`)
                .addField('Enlever un rôle', `Pour enlever un rôle à tout le serveur\nExemple : \`${message.guild.prefix}role_all remove @membre\``)
                .addField('Ajouter un rôle', `Pour ajouter un rôle à tout le serveur\nExemple : \`${message.guild.prefix}role_all add @membre\``)
                .addField('Permissions', `Vous devez être sur que Green-bot a la permission \`Gérer les rôles\` et son rôle le plus haut est au dessus du rôle voulu`)

            .setThumbnail(url = message.client.user.displayAvatarURL({ dynamic: true, size: 512 }))

            .setFooter(message.client.footer, message.client.user.displayAvatarURL({ dynamic: true, size: 512 }))


            message.channel.send(embed).then((m) => {
                m.react("<:delete:830790543659368448>")
                const filtro = (reaction, user) => {
                    return user.id == message.author.id;
                };
                m.awaitReactions(filtro, {
                    max: 1,
                    time: 20000,
                    errors: ["time"]
                }).catch(() => {

                }).then(async(coleccionado) => {

                    const reaccion = coleccionado.first();
                    if (reaccion.emoji.id === "830790543659368448") {
                        m.delete()


                    }

                });
            });
            return

        }
        const millisToMinutesAndSeconds = (millis) => {
            var minutes = Math.floor(millis / 60000);
            var seconds = ((millis % 60000) / 1000).toFixed(0);
            //ES6 interpolated literals/template literals 
            //If seconds is less than 10 put a zero in front.
            return `${minutes}:${(seconds < 10 ? "0" : "")}${seconds}`;
        }
        if (args[0] === "add") {
            try {
                let role = message.mentions.roles.first() || message.guild.roles.cache.get(args[1]) || message.guild.roles.cache.filter(m => m.name.includes(args.join(" "))).first();
                if (!role || role.name === 'everyone' || role.name === 'here') {
                    return message.errorMessage(`Veuillez mentionner un rôle valide ou fournir un ID de rôle valide.`);
                }

                if (message.guild.me.roles.highest.comparePositionTo(role) < 0) {
                    return message.errorMessage(`Ma position dans ce serveur n'est pas assez haute pour ajouter ce rôle.`);
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
                    .setTitle(`Rôle All`)
                    .setDescription(`<a:green_loading:824308769713815612> Ajout du rôle en cours à tous les membres qui n'ont pas le rôle`)
                    .setFooter(message.client.footer, message.client.user.displayAvatarURL({ dynamic: true, size: 512 }))


                message.channel.send(embed).then((m) => {
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
                                    .setTitle(`Rôle All`)
                                    .setDescription(`${emoji.succes} Le rôle ${role} à bien été donné aux **${memberCount}** Membres qui n'avaient pas ce rôle, opération réalisée en **${millisToMinutesAndSeconds(time)}** Minutes `)
                                    .setFooter(message.client.footer, message.client.user.displayAvatarURL({ dynamic: true, size: 512 }))

                            } else {
                                embed2 = new Discord.MessageEmbed()
                                    .setAuthor(`${message.author.username}`, message.author.displayAvatarURL({ dynamic: true, size: 512 }))

                                .setColor("#F0B02F")
                                    .setTitle(`Rôle All`)
                                    .setDescription(`<a:green_loading:824308769713815612> Ajout du rôle en cours à tous les membres qui n'ont pas le rôle (**${u}/${memberCount}**)`)
                                    .setFooter(message.client.footer, message.client.user.displayAvatarURL({ dynamic: true, size: 512 }))

                            }


                            m.edit(embed2)
                            addRole(membera, role)

                        });
                    });
                })

            } catch (err) {
                console.log(err)
                return message.errorMessage(`Une erreur est suvenue , vérifiez la hiérachie`)
            }

        } else if (args[0] === "remove") {
            try {
                let role = message.mentions.roles.first() || message.guild.roles.cache.get(args[1]) || message.guild.roles.cache.filter(m => m.name.includes(args.join(" "))).first();
                if (!role || role.name === 'everyone' || role.name === 'here') {
                    return message.errorMessage(`Veuillez mentionner un rôle valide ou fournir un ID de rôle valide.`);
                }

                if (message.guild.me.roles.highest.comparePositionTo(role) < 0) {
                    return message.errorMessage(`Ma position dans ce serveur n'est pas assez haute pour ajouter ce rôle.`);
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
                    .setTitle(`Rôle All`)
                    .setDescription(`<a:green_loading:824308769713815612> Suppresion du rôle en cours à tous les membres qui ont ce rôle `)
                    .setFooter(message.client.footer, message.client.user.displayAvatarURL({ dynamic: true, size: 512 }))


                message.channel.send(embed).then((m) => {
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
                                    .setTitle(`Rôle All`)
                                    .setDescription(`${emoji.succes} Le rôle ${role} à bien été enlevé aux ** ${memberCount}** Membres qui avaient ce rôle , opération réalisée en **${millisToMinutesAndSeconds(time)}** `)
                                    .setFooter(message.client.footer, message.client.user.displayAvatarURL({ dynamic: true, size: 512 }))

                            } else {
                                embed2 = new Discord.MessageEmbed()
                                    .setAuthor(`${message.author.username}`, message.author.displayAvatarURL({ dynamic: true, size: 512 }))

                                .setColor("#F0B02F")
                                    .setTitle(`Rôle All`)
                                    .setDescription(`<a:green_loading:824308769713815612> Suppresion du rôle en cours à tous les membres (${u}/${memberCount})`)
                                    .setFooter(message.client.footer, message.client.user.displayAvatarURL({ dynamic: true, size: 512 }))

                            }

                            m.edit(embed2)
                            addRole(membera, role)

                        });
                    });
                })

            } catch (err) {
                console.log(err)
                return message.errorMessage(`Une erreur est suvenue , vérifiez la hiérachie`)
            }

        } else {
            let embed = new Discord.MessageEmbed()
                .setAuthor(`${message.author.username}`, message.author.displayAvatarURL({ dynamic: true, size: 512 }))

            .setColor("#F0B02F")
                .setTitle(`Rôle All`)
                .setDescription(`Vous devez fournir un argument pour cette commande .`)
                .addField('Enlever un rôle', `Pour enlever un rôle à tout le serveur\nExemple : \`${message.guild.prefix}role_all remove @membre\``)
                .addField('Ajouter un rôle', `Pour ajouter un rôle à tout le serveur\nExemple : \`${message.guild.prefix}role_all add @membre\``)
                .addField('Permissions', `Vous devez être sur que Green-bot a la permission \`Gérer les rôles\` et son rôle le plus haut est au dessus du rôle voulu`)

            .setThumbnail(url = message.client.user.displayAvatarURL({ dynamic: true, size: 512 }))

            .setFooter(message.client.footer, message.client.user.displayAvatarURL({ dynamic: true, size: 512 }))


            message.channel.send(embed).then((m) => {
                m.react("<:delete:830790543659368448>")
                const filtro = (reaction, user) => {
                    return user.id == message.author.id;
                };
                m.awaitReactions(filtro, {
                    max: 1,
                    time: 20000,
                    errors: ["time"]
                }).catch(() => {

                }).then(async(coleccionado) => {

                    const reaccion = coleccionado.first();
                    if (reaccion.emoji.id === "830790543659368448") {
                        m.delete()


                    }

                });
            });


        }




    },
};