const Discord = require('discord.js');
const ms = require('ms');
const Welcome = require('../../database/models/Welcome');

const giveawayModel = require('../../database/models/giveaway');

module.exports = {
        name: 'autoping',
        description: 'Configure le système de ping automatique des nouveaux membres dans un salon.',
        aliases: ['ping-auto', 'autoping', ],
        guildOnly: true,
        cat: 'configuration',
        permissions: ['MANAGE_GUILD'],
        botpermissions: ["SEND_MESSAGES", "EMBED_LINKS", ],
        async execute(message, args, client) {
            const ID = message.member.id;
            const prompts = await message.translate("PING_PROMPTS")
            const welcomeDB = await Welcome.findOne({ serverID: message.guild.id, reason: `autoping` })
            let tip = await message.translate("DASHBOARD")
            let second = await message.translate("ARGS_TIP")
            let cfg = await message.translate("ACTUAL_CONFIG")

            let embed = new Discord.MessageEmbed()
                .setAuthor(`${message.author.username}`, message.author.displayAvatarURL({ dynamic: true, size: 512 }))

            .setColor("#F0B02F")
                .setTitle(`${message.guild.settings.lang === "fr" ? "Ping automatique des nouveaux membres":"Auto ghost ping"}`)
                .setDescription(tip)
                .addField(cfg.title, `${cfg.enabled}${welcomeDB ? welcomeDB.status ? "<:IconSwitchIconOn:825378657287274529>": "<:icon_SwitchIconOff:825378603252056116>" : "<:icon_SwitchIconOff:825378603252056116>"}\n ${message.guild.settings.lang === "fr" ? "Temps":"Time"}: ${welcomeDB ? welcomeDB.image ? welcomeDB.image : cfg.no : cfg.no}\n${cfg.channel}  ${ welcomeDB ? welcomeDB.channelID ? `<#${welcomeDB.channelID}>` : cfg.no : cfg.no }\nMessage: \n\`\`\`${ welcomeDB ? welcomeDB.message ? `${welcomeDB.message.length > 500 ? welcomeDB.message.slice(0, 500) + '...':welcomeDB.message}` : cfg.no : cfg.no }\`\`\``)
                .addField(`${message.guild.settings.lang === "fr" ? "`📜` Utilisation":"`📜` Use"}`, second)


        .setThumbnail(url = message.client.user.displayAvatarURL({ dynamic: true, size: 512 }))

        .setFooter(message.client.footer, message.client.user.displayAvatarURL({ dynamic: true, size: 512 }))


        message.reply({ embeds: [embed], allowedMentions: { repliedUser: false } }).then((m) => {
            m.react("📜")
            const filter = (reaction, user) => reaction.emoji.name === "📜" && user.id === message.author.id;
            const collector = m.createReactionCollector({ filter, time: 11000000,max:1 });
            collector.on('collect', async r =>{
                const response = await getResponses(message)
                    if (!response || response.cancelled) return message.client.log ? console.log(`Command ${message.content} | Cancelled`) : null
                const a = await message.translate("CONFIG_OK")
                let b = `${message.guild.settings.lang === "fr" ? "le ping automatique des nouveaux membres":"the auto ghost ping"}`
                const verify = await Welcome.findOne({ serverID: message.guild.id, reason: `autoping` })
                    if (verify) {
                        const newchannel = await Welcome.findOneAndUpdate({ serverID: message.guild.id, reason: `autoping` }, { $set: { channelID: response.channel.id, reason: `autoping`, message: response.message, status: response.status, image: response.image ? true : false, } }, { new: true });
            
                        message.succesMessage(a.replace("{x}",b));
            
                } else {
                    const verynew = new Welcome({
                        serverID: `${message.guild.id}`,
                        channelID: `${response.channel.id}`,
                        reason: 'autoping',
                        message: `${response.message}`,
                        status:  response.status,
                        image:  response.image,
                    }).save();
                    message.succesMessage(a.replace("{x}",b));
            
                }
            });
            collector.on('end', collected => m.reactions.removeAll());
    
    
    
    
        });
    
  


    async function getResponses(message) {
        const validTime = /^\d+(s|m|h|d)$/;
        const validNumber = /^\d+/;
        const responses = {}

        let can = await message.translate("CAN_CANCEL")
            for (let i = 0; i < prompts.length; i++) {
                await message.mainMessageT(`${prompts[i]}\n\n${can}`);
        const filter = m => m.author.id === ID;
        const response =  await message.channel.awaitMessages({ filter, max: 1,})
            const { content } = response.first();
            const m = response.first();
            if (content.toLowerCase() === "cancel") {
                let okk = await message.translate("CANCELED")
                responses.cancelled = true;

         message.channel.send(`**${okk}**`)
                return responses;

                break;
            }
            if (i === 0) {
                const ll = await message.translate("ENA/DISA")

                if (content.toLowerCase() === 'enable') {
                    responses.status = true;
                } else if (content.toLowerCase() === 'disable') {
                    responses.status = null;

                    const verify = await Welcome.findOne({ serverID: message.guild.id, reason: `autoping` })
                    if (verify) {
                        const newchannel = await Welcome.findOneAndUpdate({ serverID: message.guild.id, reason: `autoping` }, { $set: { status: null } }, { new: true });

                        return message.succesMessage(ll.succes);

                    }
                    return message.succesMessage(ll.disable);

                } else {
                    return message.errorMessage(ll.err)
                }

            }
            if (i === 1) {
                let channel = m.mentions.channels.first() || message.guild.channels.cache.get(content) || message.guild.channels.cache.filter(m => m.type === "GUILD_TEXT" && m.name.includes(args.join(" "))).first();
                    if (channel && channel.type === 'GUILD_TEXT' && channel.guild.id === message.guild.id) {
                    if (!channel.viewable||!channel.permissionsFor(message.guild.me).has('SEND_MESSAGES') || !channel.permissionsFor(message.guild.me).has('EMBED_LINKS') ) {
                        let a = await message.translate("CHANNEL_PERMS")
                        return message.errorMessage(a)
                        break;
                    }
                    responses.channel = channel;
                } else {
                    let errorChannel = await message.translate("ERROR_CHANNEL")
                    return message.errorMessage(errorChannel)
                    break;
                }
            }
            if (i === 2) {
                if (content.length > 2000 || content.length < 1) {
                    let numberErr = await message.translate("MESSAGE_ERROR")
                return message.errorMessage(numberErr.replace("{amount}", "2").replace("{range}", "2000"))
                    break;
                } else {
                    responses.message = content;
                }
            }
            if (i === 3) {
                                    if (!content || isNaN(ms(content))) {
                                        return message.errorMessage(`${message.guild.settings.lang === "fr" ? "Veuillez fournir une durée valide. Veuillez refaire la commande":"Please provide a valid duration. Please do the command again"}`)
                                        break;
                    
                                    }
                                    if (ms(content) > (60000 /2) || content.includes("-") || content.includes("+") ||content.includes(",") || content.includes(".") || content.startsWith("0")) {
                                        return message.errorMessage(`${message.guild.settings.lang === "fr" ? "Veuillez fournir une durée valide. Le maximum est 30m. Veuillez refaire la commande":"Please provide a valid duration. The max is 30m.Please do the command again"}`)
                                        break;
                    
                        
                                    }
                                    responses.image =ms(content)
                                  

            }
        }
        return responses;
    }
},
};