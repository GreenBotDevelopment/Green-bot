const config = require('../config.json');
const rrmodel = require('../database/models/rr')
const emoji = require('../emojis.json');
var db = require('quick.db')
const Discord = require('discord.js');
const Welcome = require('../database/models/Welcome');
module.exports = {


    async execute(reaction, user, client) {
        if (reaction.message.partial) await reaction.message.fetch();
        if (reaction.partial) await reaction.fetch();

        let message = reaction.message;
        if (!message) return;
        if (reaction.emoji.name === "⭐") {


            const stardb = await Welcome.findOne({ serverID: message.guild.id, reason: 'starboard' })
            if (stardb) {

                const starboard = message.guild.channels.cache.get(stardb.channelID)
                if (message.channel.id === starboard.id) return;

                const msgs = await starboard.messages.fetch({ limit: 100 });
                const existingMsg = msgs.find(msg =>
                    msg.embeds.length === 1 ?
                    (msg.embeds[0].footer.text.startsWith(message.id) ? true : false) : false);
                if (existingMsg) existingMsg.edit(`${reaction.count} - ⭐`);
                else {
                let d = message.attachments.map(x => x.url);

                    let att = message.attachments.map(a => a.url)
                    const embed = new Discord.MessageEmbed()
                        .setAuthor(message.author.tag, message.author.displayAvatarURL())
                        .addField('Url', `[Acceder au message](${message.url})`, true)
                        .setColor("#BDD320")
                        .addField('Autheur', message.author, true)
                        .addField('Contenu du Message', message.content || 'Image')

                    .setDescription(`⭐ Le message de ${message.author} passe dans le starboard !`)
                        .setFooter(message.id + ' - ' + new Date(message.createdTimestamp));
                        if(!message.attachments.size) embed.setImage(d[0])
                    if (starboard)
                        starboard.send('1 - ⭐', embed);
                }
            }
        }
        if (user.bot) return;
        if (message.author.id !== client.user.id) return;

        let already = new Discord.MessageEmbed()
            .setColor("#982318")
            .setAuthor(`⛔ | Éh non ..`)
            .setFooter(client.footer)
            .setDescription(`Vous pouvez avoir qu'un seul ticket d'ouvert à la fois.`);

        let success = new Discord.MessageEmbed()
            .setColor(client.color)
            .setTitle(`🎫  Nouveau ticket`)
            .setFooter(client.footer)
            .setDescription("Veuillez expliquer la raison de votre demande. Un membre de l'équipe prendra en charge votre ticket sous peu.");

        let split = '';
        let usr = user.id.split(split);
        for (var i = 0; i < usr.length; i++) usr[i] = usr[i].trim();
        if (message.guild) {
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
                                    .setColor("#DA7226");
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

                                    .setColor("#DA7226");
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

                            .setColor("#DA7226");
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


                        channel.send(`${user}`, { embed: success }).then(m => {
                            m.react("🗑️");
                        });
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

                    message.channel.delete();

                }
            }
        }
        if (reaction.emoji.name === "✅") {
            if (message.channel.type === 'dm') {
                let success = new Discord.MessageEmbed()
                    .setColor(client.color)
                    .setTitle(`Interchat : accepté`)
                    .setFooter(client.footer)
                    .setDescription("Veuillez maintenant définir le salon de l'interchat avec la commande `interchat-channel <salon>` ");
                message.reply(success)
            }
        }
        if (reaction.emoji.name === "❌") {
            if (message.channel.type === 'dm') {

                let success = new Discord.MessageEmbed()
                    .setColor("#DA7226")
                    .setTitle(`Interchat : Réfusé`)
                    .setFooter(client.footer)
                    .setDescription("Vous avez refusé l'interchat.");
                message.reply(success)
            }
        }
    }
};
