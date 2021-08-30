const config = require("../../config.js"),
    rrmodel = require("../../database/models/rr"),
    emoji = require("../../emojis.json");
var db = require("quick.db");
const Discord = require("discord.js"),
    ticketPanel = require("../../database/models/ticketPanel"),
    Welcome = require("../../database/models/Welcome");
module.exports = {
        async execute(e, t, s) {
            e.message.partial && await e.message.fetch(), e.partial && await e.fetch();
            let r = e.message;
            if (!r) return;
            const i = await Welcome.findOne({ serverID: r.guild.id, reason: "verification", channelID: r.id, message: e.emoji.name });
            if (i) {
                let e = r.guild.roles.cache.get(i.image);
                if (e) {
                    r.guild.members.cache.get(t.id).roles.add(e)
                    const member = r.guild.members.cache.get(t.id)
                    member.verified = true
                    s.emit("guildMemberAdd", member)
                } else {
                    let e, t = await Welcome.findOne({ serverID: r.guild.id, reason: "logs" });
                    (e = t ? r.guild.channels.cache.get(t.channelID) : null) && e.send("`ERREUR:`: Je n'arrive pas à trouver le rôle de la vérification")
                }
            }
            if ("⭐" === e.emoji.name) {
                const t = await Welcome.findOne({ serverID: r.guild.id, reason: "starboard", channelID: r.channel.id });
                if (t) {
                    const i = r.guild.channels.cache.get(t.channelID);
                    if (!i) return;
                    const a = (await sstarboard.messages.fetch({ limit: 100 })).find(e => e.author.id == s.user.id && (1 === e.embeds.length && !!e.embeds[0].footer.text.startsWith(r.id)));
                    let o = r.attachments.map(e => e.url);
                    const n = (new Discord.MessageEmbed).setAuthor(r.author.tag, r.author.displayAvatarURL()).setTitle(`${e.count} ⭐ - Starboard`).setURL(`${r.url}`).addField("Lien du message", `[Acceder au message](${r.url})`, !0).setColor("#BDD320").addField("Auteur", r.author, !0).setFooter(r.id + " - " + new Date(r.createdTimestamp));
                    if (r.attachments.size || n.setDescription(r.content), r.attachments.size && n.setImage(o[0]), a) a.edit(`${e.count} - ⭐`, { embeds: [n] });
                    else {
                        let e = r.attachments.map(e => e.url);
                        const t = (new Discord.MessageEmbed).setAuthor(r.author.tag, r.author.displayAvatarURL()).setTitle("⭐ - Starboard").setURL(`${r.url}`).addField("Lien du message", `[Acceder au message](${r.url})`, !0).setColor("#BDD320").addField("Auteur", r.author, !0).setFooter(r.id + " - " + new Date(r.createdTimestamp));
                        r.attachments.size || t.setDescription(r.content), r.attachments.size && t.setImage(e[0]), i && i.send("1 - ⭐", { embeds: [t] })
                    }
                }
            }
            if (t.bot) return;
            if (r.author.id !== s.user.id) return;
            let a = t.id.split("");
            for (var o = 0; o < a.length; o++) a[o] = a[o].trim();
            if (r.guild) {
                let i = await rrmodel.findOne({ serverID: r.guild.id, reaction: e.emoji.name });
                if (i) {
                    if (s.log) console.log(i.roleID);
                    let e = r.guild.roles.cache.get(i.roleID),
                        a = r.guild.members.cache.get(t.id);
                    if (e && a) try {
                        if (a.roles.cache.has(`${e.id}`)) return;
                        try {
                            a.roles.add(e);
                        } catch (e) {
                            const t = (new Discord.MessageEmbed).setDescription(`${emoji.error} Erreur dans l'ajout du role , vérifiez la hiérarchie`).setFooter(s.footer).setColor("#DA7226"),
                                r = awaitmessage.channel.send({ embeds: [t] });
                            return void setTimeout(() => { r.delete() }, 1e4)
                        }
                    } catch (e) {
                        const t = (new Discord.MessageEmbed).setDescription(`${emoji.error} Erreur dans l'ajout du role , vérifiez la hiérarchie`).setFooter(s.footer).setColor("#DA7226"),
                            r = awaitmessage.channel.send({ embeds: [t] });
                        return void setTimeout(() => { r.delete() }, 1e4)
                    }
                }
                if ("🎫" === e.emoji.name) {
                    const i = await r.guild.translate("TICKETS");
                    let o = (new Discord.MessageEmbed).setColor("#982318").setAuthor(i.alreadyTitle).setFooter(s.footer).setDescription(i.alreadyDesc),
                        n = await ticketPanel.findOne({ messageID: r.id, serverID: r.guild.id });
                    if (!r.guild.channels.cache.find(e => e.name === `ticket-${a[0]}${a[1]}${a[2]}${a[3]}`)) {
                        let o = r.guild.channels.cache.get(n.category),
                            c = ["VIEW_CHANNEL", "SEND_MESSAGES", "ATTACH_FILES", "READ_MESSAGE_HISTORY", "ADD_REACTIONS"];
                        return r.guild.channels.create(`ticket-${a[0]}${a[1]}${a[2]}${a[3]}`, { permissionOverwrites: [{ deny: "VIEW_CHANNEL", id: r.guild.id }, { allow: c, id: t.id }, { allow: c, id: n.roleID }], parent: o.id, reason: "Ticket system.", topic: `**ID:** ${t.id} -- **Tag:** ${t.tag} | *ticket-close` }).then(e => {
                            let embed = (new Discord.MessageEmbed).setColor(s.color).setTitle(`${n.titleEmbed}`).addField("Actions", i.actionDesc)
                                .setFooter(s.footer, s.user.displayAvatarURL({ dynamic: true, size: 512 }));
                            e.send({ content: n.welcomeMessage.replace("{user}", t) || `${t}`, embeds: [embed] }).then(async e => {
                                e.react("🗑️"), e.react("🔒"), e.pin({ reason: "Ticket openned" })
                                let welcomedb = await Welcome.findOne({ serverID: r.guild.id, reason: 'logs' })
                                if (welcomedb) {
                                    let logchannel = r.guild.channels.cache.get(welcomedb.channelID);
                                    if (!logchannel) return;
                                    const lang = await r.guild.translate("TICKET_CREATE")
                                    const embed = new Discord.MessageEmbed()
                                        .setColor('#70D11A')
                                        .setTitle(lang.title)
                                        .setDescription(lang.desc.replace("{member}", t))
                                        .addField(lang.reason, `${n.titleEmbed}`, true)
                                        .addField(lang.creator, `${t}`, true)
                                        .setFooter(r.client.footer, r.client.user.displayAvatarURL({ dynamic: true, size: 512 }))
                                        .setTimestamp();
                                    logchannel.send({ embeds: [embed] });
                                }
                            }), db.set(`ticket.ticket-${a[0]}${a[1]}${a[2]}${a[3]}`, { user: t.id })


                        }), void e.users.remove(t.id)
                    } {
                        let s = r.guild.members.cache.get(t.id);
                        e.users.remove(t.id), s && s.send({ embeds: [o] })
                    }
                }
                if ("🔒" === e.emoji.name) {
                    if (!r.channel.name.startsWith("ticket-")) return;
                    let i = r.guild.members.cache.get(t.id);
                    if (i.user.bot) return;
                    i.permissions.has("ADMINISTRATOR") ? (r.channel.permissionOverwrites.edit(db.get(`ticket.${r.channel.name}.user`), { SEND_MESSAGES: !1, ADD_REACTIONS: !1 }), e.users.remove(t.id), e.users.remove(s.user.id), r.react("🔓"), r.succesMessage("Le ticket a bien été verouillé avec succès . Régissez avec 🔓 pour rouvrir le ticket")) : (r.errorMessage("Vous n'avez pas les permissions pour verouiller ce ticket"), e.users.remove(t.id))
                }
                if ("🔓" === e.emoji.name) {
                    if (!r.channel.name.startsWith("ticket-")) return;
                    let i = r.guild.members.cache.get(t.id);
                    if (i.user.bot) return;
                    i.permissions.has("ADMINISTRATOR") ? (r.channel.permissionOverwrites.edit(db.get(`ticket.${r.channel.name}.user`), { SEND_MESSAGES: !0, ADD_REACTIONS: !0 }), e.users.remove(t.id), e.users.remove(s.user.id), r.react("🔒"), r.succesMessage("Le ticket a bien été déverouillé . L'utilisateur peut à nouveau parler !")) : (r.errorMessage("Vous n'avez pas les permissions pour déverouiller ce ticket"), e.users.remove(t.id))
                }
            }
            if ("🗑️" === e.emoji.name) {
                if (!r.channel.name.startsWith("ticket-")) return;
                let e = r.guild.members.cache.get(t.id);
                if (e.user.bot) return;
                if (t.id === db.get(`ticket.${r.channel.name}.user`)) r.channel.delete();
                else if (e.permissions.has("ADMINISTRATOR")) { r.channel.delete(); let e = r.guild.members.cache.get(`${db.get(`ticket.${r.channel.name}.user`)}`),t=(new Discord.MessageEmbed).setColor(r.guild.color).setTitle("🎫  Ticket Fermé").setFooter(s.footer).setDescription(`Bonjour ${e} Votre ticket sur **${r.guild.name}** vient d'être fermé , merci d'avoir utilisé notre service `);}else r.errorMessage("Vous n'avez pas les permissions pour fermer ce ticket")}if("✅"===e.emoji.name&&"dm"===r.channel.type){let e=(new Discord.MessageEmbed).setColor(s.color).setTitle("Interchat : accepté").setFooter(s.footer).setDescription("Veuillez maintenant définir le salon de l'interchat avec la commande `interchat-channel <salon>` ");r.reply(e)}if("❌"===e.emoji.name&&"dm"===r.channel.type){let e=(new Discord.MessageEmbed).setColor("#DA7226").setTitle("Interchat : Réfusé").setFooter(s.footer).setDescription("Vous avez refusé l'interchat.");r.reply(e)}}};