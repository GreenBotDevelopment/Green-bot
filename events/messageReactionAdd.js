const config = require('../config.json');
const rrmodel = require('../database/models/rr')
const emoji = require('../emojis.json');
var db = require('quick.db')
const Discord = require('discord.js');
module.exports = {


    async execute(reaction, user, client) {
        if (reaction.message.partial) await reaction.message.fetch();
        if (reaction.partial) await reaction.fetch();

        let message = reaction.message;
        if (!message) return;
        if (user.bot) return;
       if (message.author.id !== client.user.id) return;

        let already = new Discord.MessageEmbed()
            .setColor("#2f3136")
            .setAuthor(`⛔ | Éh non ..`)
            .setFooter(client.footer)
            .setDescription(`Vous pouvez avoir qu'un seul ticket d'ouvert à la fois.`);

        let success = new Discord.MessageEmbed()
            .setColor("#2f3136")
            .setTitle(`🎫  Nouveau ticket`)
            .setFooter(client.footer)
            .setDescription("Veuillez expliquer la raison de votre demande. Un membre de l'équipe prendra en charge votre ticket sous peu.");

        let split = '';
        let usr = user.id.split(split);
        for (var i = 0; i < usr.length; i++) usr[i] = usr[i].trim();

        let rrdb = await rrmodel.findOne({ serverID: message.guild.id, reaction: reaction.emoji.name })
        if (rrdb) {
            console.log(rrdb.roleID);

            let role = message.guild.roles.cache.get(rrdb.roleID);
            let member = message.guild.members.cache.get(user.id);
            if (role) {

                if (member) {
                    try {
                        if (member.roles.cache.has(`${role.id}`)) {
                            const reportEmbed = new Discord.MessageEmbed()



                            .setDescription(`${emoji.error}  Erreur : Vous avez déja ce role`)


                            .setFooter(client.footer)
                                .setTimestamp()
                                .setColor("#2f3136");
                            const err1 = await message.channel.send(reportEmbed);
                            setTimeout(() => {
                                err1.delete();
                            }, 10000);

                        } else {
                            try {
                                member.roles.add(role);
                                const reportEmbed = new Discord.MessageEmbed()

                                .setDescription(`${emoji.succes} Vous avez reçu le role \`${role.name}\``)


                                .setFooter(client.footer)

                                .setColor("#2f3136");
                                member.send(reportEmbed);

                            } catch (err) {
                                const reportEmbed = new Discord.MessageEmbed()



                                .setDescription(`${emoji.error} Erreur dans l'ajout du role , vérifiez la hiérarchie`)


                                .setFooter(client.footer)

                                .setColor("#2f3136");
                                const err2 = await message.channel.send(reportEmbed);
                                setTimeout(() => {
                                    err2.delete();
                                }, 10000);
                                return;
                            }
                        }


                    } catch (err) {
                        const reportEmbed = new Discord.MessageEmbed()



                        .setDescription(`${emoji.error} Erreur dans l'ajout du role , vérifiez la hiérarchie`)


                        .setFooter(client.footer)

                        .setColor("#2f3136");
                        const err2 = await message.channel.send(reportEmbed);
                        setTimeout(() => {
                            err2.delete();
                        }, 10000);
                        return;
                    }
                }


            }


        }
        if (reaction.emoji.name === "🎫") {
            console.log('GOOD REACTION');
            if (!message.author.id == client.user.id) return;
            if (!message.guild.channels.cache.find(c => c.name === `ticket-${usr[0]}${usr[1]}${usr[2]}${usr[3]}`)) {


                let categoria = message.guild.channels.cache.find(c => c.name == "tickets" && c.type == "category");
                if (!categoria) categoria = await message.guild.channels.create("tickets", { type: "category", position: 1 }).catch(e => { return functions.errorEmbed(message, message.channel, "Une erreur a été rencontrée.") });

                let permsToHave = ['VIEW_CHANNEL', 'SEND_MESSAGES', 'ATTACH_FILES', 'READ_MESSAGE_HISTORY', 'ADD_REACTIONS']

                message.guild.channels.create(`ticket-${usr[0]}${usr[1]}${usr[2]}${usr[3]}`, {
                    permissionOverwrites: [{
                            deny: 'VIEW_CHANNEL',
                            id: message.guild.id
                        },
                        {
                            allow: permsToHave,
                            id: user.id
                        },

                    ],
                    parent: categoria.id,
                    reason: `Cet utilisateur a besoin d'aide.`,
                    topic: `**ID:** ${user.id} -- **Tag:** ${user.tag} | *ticket-close`
                }).then(channel => {


                    channel.send(`${user}`, { embed: success });
                    db.set(`ticket.ticket-${usr[0]}${usr[1]}${usr[2]}${usr[3]}`, { user: user.id });
                })

                reaction.users.remove(user.id);
                return;
            } else {

                reaction.users.remove(user.id);
                message.reply({ embed: already }).then(m => m.delete({ timeout: 3000 }).catch(e => {}));
            }
        } else {

        }


        // ========================= //


        if (reaction.emoji.name === "🗑️") {
            if (user.id === db.get(`ticket.${message.channel.name}.user`)) {
                const reportEmbed = new Discord.MessageEmbed()
                    .setTitle(`Arrivée de ${member.user.tag}`)
                    .setThumbnail(member.user.displayAvatarURL())

                .setDescription(`${member.guild.memberCount} membres dans le serveur.`)



                .setFooter(client.footer)

                .setColor("#04781B");
                if (logchannel) logchannel.send(reportEmbed);
                message.channel.delete();

            }
        }
    }
};
