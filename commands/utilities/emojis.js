const emoji = require('../../emojis.json')
const Discord = require('discord.js');
const fetch = require("node-fetch");
const { parse } = require("twemoji-parser");
const moment = require('moment')

module.exports = {
        name: 'emojis',
        description: 'Renvoie la liste des emojis du serveur',
        aliases: ['emojislist'],
        usage: '<emoji>',
        cat: 'utilities',
        guildOnly: true,

        async execute(message, args) {

            if (message.guild.emojis.cache.size < 1) return message.errorMessage(`Ce serveur n'a encore crée aucuns emojis personnalisés`);
            message.guild.fetch().then(async function(server) {

                        if (message.guild.emojis.cache.size < 16) {
                            return message.channel.send({
                                        embed: {
                                            color: message.client.color,
                                            title: "Emojis de " + message.guild.name,
                                            url: "http://green-bot.xyz",
                                            description: `${message.guild.emojis.cache.map(emoji => `${emoji} ➟ [\`<${emoji.animated ? "a" : ""}:${emoji.name}:${emoji.id}>\`](${emoji.url})`).join("\n")}`,
                            footer: {
                                text: "Page 1/1"
                            },
                            timestamp: new Date()
                        }
                    }
                )
            } else {
                const pageThis = async(message, embeds, emotes, timeout, noPermEmbed) => {

                    let pageNumber = 0;
                    if (!embeds.length) return message.errorMessage("Pas assez d'emojis pour les afficher dans la liste...")
                    const msg = await message.channel.send(
                        {
                            embed: embeds[pageNumber]
                        }
                    ).catch((e) => {console.error(e)});
        
                    if (embeds.length === 1) {
    
                        return msg;
    
                    } else if (embeds.length > 1) {
    
                        let errors = 0;
                        for (const emoji of emotes) await msg.react(emoji).catch(() => {
                            errors+=1;
                        });
    
                        if (errors >= 1) {
                            msg.delete().catch(() => {});
                            return message.channel.send(
                                {
                                    embed: noPermEmbed
                                }
                            ).catch(() => {});
                        } else {
                            const filter = (reaction, user) => {
                                return reaction.message.id === msg.id && user.id === message.author.id;
                            };
                            const collector = msg.createReactionCollector(
                                filter,
                                {
                                    timeout
                                }
                            );
                            collector.on("collect", async(reaction) => {
                                reaction.users.remove(message.author.id).catch(() => {});
                                switch (reaction.emoji.name) {
    
                                    case emotes[0]:
                                        pageNumber = 0;
                                        break;
    
                                    case emotes[1]:
                                        pageNumber = pageNumber >0 ? --pageNumber : embeds.length - 1;
                                        break;
    
                                    case emotes[2]:
                                        pageNumber = 300; // vous verrez pourquoi, même si en vrai c'est pas super de faire comme ça;
                                        break;
    
                                    case emotes[3]:
                                        pageNumber = pageNumber+1 < embeds.length ? ++pageNumber : 0;
                                        break;
    
                                    case emotes[4]:
                                        pageNumber = embeds.length-1;
                                        break;
    
                                    default:
                                        break;
    
                                }
                                if (pageNumber > 200) {
                                    msg.delete().catch(() => {});
                                } else {
                                    msg.edit(
                                        {
                                            embed: embeds[pageNumber]
                                        }
                                    ).catch(() => {});
                                };
                            });
    
                            collector.on("end", function() {
                                if (!msg.deleted) {
                                    msg.reactions.removeAll().catch(() => {});
                                };
                            });
    
                            return msg;
                        };
    
                    };
    
                };
    
                const emojis = server.emojis.cache;
                const limit = 15;
                const lastPage = Math.ceil(emojis.size/limit);
                let embeds = [];
    
                for (let i = 1; i < lastPage; i++) {
    
                    let page = parseInt(i);
                    let debut = limit*(page-1);
                    let fin = 15*page;
                    let list = []; // liste des emotes 
    
                    emojis.forEach(emote => {
                        list.push(`<${emote.animated ? "a" : ""}:${emote.name}:${emote.id}>` + ` ➟ [\`<${emote.animated ? "a" : ""}:${emote.name}:${emote.id}>\`](${emote.url})`);
                    });
                    list = list.slice(debut, fin);
    
    
                    const embed = {
                        color: message.client.color,
                        title: "Emojis de " + message.guild.name,
                        url: "http://green-bot.xyz",
                        description: list.join("\n"),
                        footer: {
                            text: "Page " + page + "/" + (lastPage-1)
                        },
                        timestamp: Date.now()
                    };
                    embeds.push(embed);
    
                };
    
                const emotes = ["⏪", "◀️", "⏹️", "▶️", "⏩"];
                const timeout = 60*1000; // 60 secondes
                const noPermissionEmbed = {
                    color: "#982318",
                    description: `${emoji.error} Je n'ai pas la permission d'ajouter de réactions`
                };
                pageThis(message, embeds, emotes, timeout, noPermissionEmbed);
            }


        });
    },
};