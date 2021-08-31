const Discord = require('discord.js');
const Welcome = require('../../database/models/Welcome');
module.exports = {
        name: 'boost-message',
        description: 'Configure les messages lors d\'un boost . Cette commande inclut un collecteur de messages , vous n\'avez donc pas besoin d\'arguments.',
        aliases: ['boost', 'messages-boost', ],
        guildOnly: true,
        cat: 'configuration',
        permissions: ['MANAGE_GUILD'],
        botpermissions: ["SEND_MESSAGES", "EMBED_LINKS", ],
        async execute(message, args, client) {
            const ID = message.member.id;
            const prompts = await message.translate("BOOST_PROMPTS")
            const welcomeDB = await Welcome.findOne({ serverID: message.guild.id, reason: `boost` })
            let second = await message.translate("ARGS_TIP")
            let tip = await message.translate("DASHBOARD")
            let cfg = await message.translate("ACTUAL_CONFIG")
            let embed = new Discord.MessageEmbed()
                .setAuthor(`${message.author.username}`, message.author.displayAvatarURL({ dynamic: true, size: 512 }))
                .setColor("#F0B02F")
                .setTitle(`${message.guild.settings.lang === "fr" ? "Messages lors d'un boost":"Boost messages"}`)
                .setDescription(tip)
                .addField(cfg.title, `${cfg.enabled}${welcomeDB ? welcomeDB.status ? "<:IconSwitchIconOn:825378657287274529>": "<:icon_SwitchIconOff:825378603252056116>" : "<:icon_SwitchIconOff:825378603252056116>"}\n Role : ${welcomeDB ? `<@&${welcomeDB.image}>` :cfg.no}\n${cfg.channel}  ${ welcomeDB ? welcomeDB.channelID ? `<#${welcomeDB.channelID}>` : cfg.no: cfg.no}\nMessage: \n\`\`\`${ welcomeDB ? welcomeDB.message ? `${welcomeDB.message.length > 500 ? welcomeDB.message.slice(0, 500) + '...':welcomeDB.message}` : cfg.no : cfg.no }\`\`\``)
                .addField(`${message.guild.settings.lang === "fr" ? "`📜` Utilisation":"`📜` Use"}`, second)
        .setThumbnail(url = message.client.user.displayAvatarURL({ dynamic: true, size: 512 }))
        .setFooter(message.client.footer, message.client.user.displayAvatarURL({ dynamic: true, size: 512 }))
        message.reply({ embeds: [embed], allowedMentions: { repliedUser: false } }).then((m) => {
            m.react("📜")
            const filter = (reaction, user) => reaction.emoji.name === "📜" && user.id === message.author.id;
            const collector = m.createReactionCollector({ filter, time: 1000000});
                collector.on('collect',async  r =>{
                const response = await getResponses(message)
                    if (!response || response.cancelled) return message.client.log ? console.log(`Command ${message.content} | Cancelled`) : null
                const a = await message.translate("CONFIG_OK")
               const b = await message.gg("les messages lors d'un boost")
                const verify = await Welcome.findOne({ serverID: message.guild.id, reason: `boost` })
                if (verify) {
                    const newchannel = await Welcome.findOneAndUpdate({ serverID: message.guild.id, reason: `boost` }, { $set: { channelID: response.channel.id, reason: `boost`, message: response.message, status: response.status, image: response.image, } }, { new: true });
        
                    message.succesMessage(a.replace("{x}",b));
        
            } else {
                const verynew = new Welcome({
                    serverID: `${message.guild.id}`,
                    channelID: `${response.channel.id}`,
                    reason: 'boost',
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
                let goodText = await message.gg(prompts[i])
                await message.mainMessageT(`${goodText}\n\n${can}`);
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

                    const verify = await Welcome.findOne({ serverID: message.guild.id, reason: `boost` })
                    if (verify) {
                        const newchannel = await Welcome.findOneAndUpdate({ serverID: message.guild.id, reason: `boost` }, { $set: { status: null } }, { new: true });

                        return message.succesMessage(ll.succes);

                    }
                    return message.succesMessage(ll.disable);

                } else {
                    return m.errorMessage(ll.err)
                }

            }
            if (i === 1) {
                let channel = m.mentions.channels.first() || message.guild.channels.cache.get(content) || message.guild.channels.cache.filter(m => m.type === "GUILD_TEXT" && m.name.includes(args.join(" "))).first();
                    if (channel && channel.type === 'GUILD_TEXT' && channel.guild.id === message.guild.id) {
                    if (!channel.viewable||!channel.permissionsFor(message.guild.me).has('SEND_MESSAGES') || !channel.permissionsFor(message.guild.me).has('EMBED_LINKS') ) {
                        let a = await message.translate("CHANNEL_PERMS")
                        return m.errorMessage(a)
                        break;
                    }
                    responses.channel = channel;
                } else {
                    let errorChannel = await message.translate("ERROR_CHANNEL")
                    return m.errorMessage(errorChannel)
                    break;
                }
            }
            if (i === 2) {
                if (content.length > 1000 || content.length < 1) {
                    let numberErr = await message.translate("MESSAGE_ERROR")
                    return m.errorMessage(numberErr.replace("{amount}", "1").replace("{range}", "1000"))
                    break;
                } else {
                    responses.message = content;
                }
            }
            if (i === 3) {
                let role = m.mentions.roles.first() || message.guild.roles.cache.get(content) ;
                    if (role.name === '@everyone' ||  role.managed) {
                        let err = await message.translate("ERROR_ROLE")
                        return m.errorMessage(err);
                        break;

                    } else {
                       

                        responses.image = role.id;
                    }

            }
        }
        return responses;
    }
},
};