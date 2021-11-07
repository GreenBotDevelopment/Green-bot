const { resolveCategory } = require("../../util/functions");
module.exports = {
        name: "help",
        description: "  Affiche une liste de toutes les commandes actuelles, triées par catégorie. Peut être utilisé en conjonction avec une commande pour plus d'informations.",
        aliases: ["commands", "aide", "cmd", "h"],
        usage: "[command name]",
        usages: ["help <command>", "help <category>", "help commands"],
        cat: "utilities",
        async execute(e, s, client, guildDB) {
            if (!s.length) {
                const { commands: t } = e.client;
                let o = await e.translate("HELP_FOOTER", guildDB.lang),
                    m = guildDB.prefix;
                let E = await e.translate("HELP_CAT", guildDB.lang);
                e.channel.send({
                    embeds: [{
                        color: guildDB.color,
                        author: { name: "Green-Bot - Help Menu", icon_url: e.client.user.displayAvatarURL({ dynamic: !0, size: 512 }) },
                        footer: { text: o.replace("{prefix}", m), icon_url: e.client.user.displayAvatarURL({ dynamic: !0, size: 512 }) },
                        description: "A detailed list of commands can be found here: [" + client.config.links.website + "/commands](https://green-bot.app/commands)\nWant to listen rich quality music with me? [Invite me](" + client.config.links.invite + ")",
                        fields: [{
                            name: `• Filters (6)`,
                            value: t
                                .filter((e) => "filters" === e.cat)
                                .map((e) => `\`${e.name}\``)
                                .join(", "),
                        }, {
                            name: `• ${E[1]} (${t.filter((e) => "music" === e.cat).size})`,
                            value: t
                                .filter((e) => "music" === e.cat)
                                .map((e) => `\`${e.name}\``)
                                .join(", "),
                        }, {
                            name: "• Configuration (" + t.filter((e) => "configuration" === e.cat).size + ") ",
                            value: t
                                .filter((e) => "configuration" === e.cat)
                                .map((e) => `\`${e.name}\``)
                                .join(", "),
                        }, {
                            name: `• ${E[3]}  (${t.filter((e) => "utilities" === e.cat).size})`,
                            value: t
                                .filter((e) => "utilities" === e.cat)
                                .map((e) => `\`${e.name}\``)
                                .join(", "),
                        }],
                    }],
                }).catch(async(s) => {
                    console.log(s)
                })
                return
            } else {
                const t = client.commands
                const c = s[0].toLowerCase(),
                    u = t.get(c) || t.find((e) => e.aliases && e.aliases.includes(c));
                if (!u || u.cat === "owner" || u.owner) {
                    if (c.startsWith("<")) return e.errorMessage("Hooks such as `[]` or `<>` must not be used when executing commands. Ex: `" + guildDB.prefix + "help music`")
                    const checkCat = await resolveCategory(c, client)
                    if (checkCat) {
                        let r = await e.translate("HELP_LIENS_UTILES", guildDB.lang),
                            l = await e.translate("CLIQ", guildDB.lang);
                        return e.channel.send({
                                    embeds: [{
                                                color: guildDB.color,
                                                title: checkCat.name,
                                                description: `${client.commands.filter(c => c.cat === checkCat.name.toLowerCase()).map(c => `\`${c.name}\``)}`,
                            fields: [{
                                name: `• ${r[0]}`,
                                value: `[${l}](${client.config.links.website})`,
                                inline: !0,
                            }, {
                                name: `• ${r[1]}`,
                                value: `[${l}](${client.config.links.support})`,
                                inline: !0,
                            }, {
                                name: `• ${r[2]}`,
                                value: `[${l}](${client.config.links.invite})`,
                                inline: !0,
                            }],
                            footer: {
                                text: client.footer,
                                icon_url: e.client.user.displayAvatarURL({ dynamic: !0, size: 512 }),
                            },
                        }],
                        })
                    } else {
                        let s = await e.translate("HELP_ERROR", guildDB.lang)
                        return e.errorMessage(s.replace("{text}", c));
                    }
                }
                let E = await e.gg(u.description);
                function link(msg) {
                    return `${msg}`
                };
      return e.channel.send({ embeds: [{
        color: guildDB.color,
        title: u.name,
        description: `${E}`,
        fields: [{
            name: "• Aliases",
            value: `${link(`\`${u.aliases ? u.aliases.map((e) => `${e}`).join(", ") || "No aliases" : "No aliases"}\``)}`,
            inline: !0,
        }, {
            name: "• Use",
            value: `${link(`\`${guildDB.prefix}${u.name} ${u.usage || ""}\``)}`,
            inline: !0,
        }],
        footer: {
            text: client.footer,
            icon_url: e.client.user.displayAvatarURL({ dynamic: !0, size: 512 }),
        },
    }],
})

            }
        
               
            
    },
};