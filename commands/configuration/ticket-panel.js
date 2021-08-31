const Discord = require('discord.js');
const ms = require('ms');
const ticketPanel = require('../../database/models/ticketPanel');


module.exports = {
        name: 'ticket-system',
        description: 'Configure le système de tickets . Vous pouvez tout configurer avec seulement cette commande',
        aliases: ['ticket', 'panel-ticket', 'ticket-panel'],
        guildOnly: true,
        cat: 'configuration',
        permissions: ['MANAGE_GUILD'],
        botpermissions: ["SEND_MESSAGES", "EMBED_LINKS", ],
        async execute(message, args, client) {
            const prompts = await message.translate("TICKETS_PROMPTS")
            const ID = message.member.id;
            const lang = await message.translate("TICKET")
            if (!args.length) {
                const ticketDB = await ticketPanel.find({ serverID: message.guild.id })
                let tip = await message.translate("DASHBOARD")
                let embed = new Discord.MessageEmbed()
                    .setAuthor(`${message.author.username}`, message.author.displayAvatarURL({ dynamic: true, size: 512 }))
                    .setColor("#F0B02F")
                    .setTitle(`Tickets`)
                    .setDescription(`${tip}\n${message.guild.premium ? lang.has :lang.not}`)
                    .addField(`Panels (${ticketDB.length}/${message.guild.premium ? "8":"3"})`, `${ticketDB.length > 0  ? `${ticketDB.map(t=>`\`${t.ticketID}\` :**${t.titleEmbed}**\n${lang.channel}: <#${t.channelID}> Role : <@&${t.roleID}> `).join("\n")}`: lang.no}`)
                    .addField(`${message.guild.settings.lang === "fr" ? "`📜` Utilisation":"`📜` Use"}`, lang.use.replace("{prefix}",message.guild.settings.prefix).replace("{prefix}",message.guild.settings.prefix))
                    .setThumbnail(url = message.client.user.displayAvatarURL({ dynamic: true, size: 512 }))
                    .setFooter(message.client.footer, message.client.user.displayAvatarURL({ dynamic: true, size: 512 }))
        message.reply({ embeds: [embed], allowedMentions: { repliedUser: false } }).then((m) => {
            if (!message.channel.permissionsFor(message.guild.me).has("MANAGE_MESSAGES")) return;
            if (!message.channel.permissionsFor(message.guild.me).has("ADD_REACTIONS")) return;
            m.react("✅")
            const filter = (reaction, user) => reaction.emoji.name === '✅' && user.id === message.author.id;
            const collector = message.createReactionCollector({ filter, time: 1000000 });
            collector.on('collect', r => m.delete());
            collector.on('end', collected => m.reactions.removeAll());
        });
      return;
    }
if(args[0].toLowerCase() === "create"){
    const ticketDB = await ticketPanel.find({ serverID: message.guild.id })

    if(ticketDB.length === 3 && !message.guild.premium) return message.errorMessage(lang.max)
    const response = await getResponses(message)
    if (!response || response.cancelled) return message.client.log ? console.log(`Command ${message.content} | Cancelled`) : null

    let embed = new Discord.MessageEmbed()
    .setTitle(response.titleEmbed)
    .setColor(message.guild.settings.color)

.setDescription(`\n${response.messageEmbed}`)
    .setFooter(message.client.footer, message.client.user.displayAvatarURL());
response.channel.send({embeds:[embed]}).then(m => {
    m.react('🎫');

    var chars = "ABCDEFGHIJKLMNOPQRSTUVWXTZabcdefghiklmnopqrstuvwxyz";
                                var string_length = 10;
                                var randomstring = '';

                                for (var x = 0; x < string_length; x++) {

                                    var letterOrNumber = Math.floor(Math.random() * 2);
                                    if (letterOrNumber == 0) {
                                        var newNum = Math.floor(Math.random() * 9);
                                        randomstring += newNum;
                                    } else {
                                        var rnum = Math.floor(Math.random() * chars.length);
                                        randomstring += chars.substring(rnum, rnum + 1);
                                    }

                                }
                                   const uniqID = randomstring;
    const verynew = new ticketPanel({
        serverID: `${message.guild.id}`,
        channelID: `${response.channel.id}`,
        messageID: `${m.id}`,
        titleEmbed: `${response.titleEmbed}`,
        messageEmbed: `${response.messageEmbed}`,
        category: `${response.category.id}`,
        ticketID: `${uniqID}`,
        roleID: `${response.role.id}` ,
        welcomeMessage: `${response.messageWelcome}`,
    }).save();
    message.succesMessage(lang.ok.replace("{id}",uniqID).replace("{channel}",response.channel.id));
});


}else if(args[0].toLowerCase() === "delete" && args.slice(1).join("")){
    let ID = args.slice(1).join("");
let chekexeist = await ticketPanel.findOne({ticketID:ID , serverID: message.guild.id})
if(!chekexeist) return message.errorMessage(`${message.guild.settings.lang === "fr" ? `je n'ai trouvé aucun panel de ticket avec pour id \`${ID}\``:`I didn't found any ticket panel with id \`${ID}\`.`}`)
let de = await ticketPanel.findOneAndDelete({ticketID:ID , serverID: message.guild.id})
message.guild.channels.cache.get(chekexeist.channelID).messages.fetch(chekexeist.messageID).then(m=>m.delete()).catch(err=>{
    return message.succesMessage(`${message.guild.settings.lang === "fr" ? "Panel supprimé avec succès.":"The ticket panel has been succefully deleted."}`)

})
return message.succesMessage(`${message.guild.settings.lang === "fr" ? "Panel supprimé avec succès.":"The ticket panel has been succefully deleted."}`)


}else{
    

    const ticketDB = await ticketPanel.find({ serverID: message.guild.id })

    let tip = await message.translate("DASHBOARD")

    let embed = new Discord.MessageEmbed()
        .setAuthor(`${message.author.username}`, message.author.displayAvatarURL({ dynamic: true, size: 512 }))

    .setColor("#F0B02F")
        .setTitle(`Tickets`)
        .setDescription(`${tip}\n${message.guild.premium ? lang.has :lang.not}`)
        .addField(`Panels (${ticketDB.length}/${message.guild.premium ? "8":"3"})`, `${ticketDB.length > 0  ? `${ticketDB.map(t=>`\`${t.ticketID}\` :**${t.titleEmbed}**\n${lang.channel}: <#${t.channelID}> Role : <@&${t.roleID}> `).join("\n")}`: lang.no}`)
.addField(`${message.guild.settings.lang === "fr" ? "`📜` Utilisation":"`📜` Use"}`, lang.use.replace("{prefix}",message.guild.settings.prefix).replace("{prefix}",message.guild.settings.prefix))


.setThumbnail(url = message.client.user.displayAvatarURL({ dynamic: true, size: 512 }))

.setFooter(message.client.footer, message.client.user.displayAvatarURL({ dynamic: true, size: 512 }))


message.reply({ embeds: [embed], allowedMentions: { repliedUser: false } }).then((m) => {
if (!message.channel.permissionsFor(message.guild.me).has("MANAGE_MESSAGES")) return;
if (!message.channel.permissionsFor(message.guild.me).has("ADD_REACTIONS")) return;
m.react("✅")

const filter = (reaction, user) => reaction.emoji.name === '✅' && user.id === message.author.id;
const collector = message.createReactionCollector({ filter, time: 1000000 });
collector.on('collect', r => m.delete());
collector.on('end', collected => m.reactions.removeAll());
});
return;
}
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
                let channel = m.mentions.channels.first() || message.guild.channels.cache.get(content) || message.guild.channels.cache.filter(m => m.type === "GUILD_TEXT" && m.name.toLowerCase().includes(content.toLowerCase())).first();
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
            if (i === 1) {
                let role = m.mentions.roles.first() || message.guild.roles.cache.get(content) 
                if(!role) {
                    let err = await message.translate("ERROR_ROLE")
                    return m.errorMessage(err);
                    break;
                }
                       
                 responses.role = role

            }
            if (i === 2) {
                if (content.length > 500 || content.length < 1) {
                    let numberErr = await message.translate("MESSAGE_ERROR")
                    return m.errorMessage(numberErr.replace("{amount}", "1").replace("{range}", "300"))
                    break;
                } else {
                    responses.titleEmbed = content;
                }
            }
            if (i === 3) {
                if (content.length >2000 || content.length < 1) {
                    let numberErr = await message.translate("MESSAGE_ERROR")
                    return m.errorMessage(numberErr.replace("{amount}", "1").replace("{range}", "2000"))
                    break;
                } else {
                    responses.messageEmbed = content;
                }
            }
            if (i ===4) {
                let channel = m.mentions.channels.first() || message.guild.channels.cache.get(content) || message.guild.channels.cache.filter(m => m.type === 'GUILD_CATEGORY' && m.name.toLowerCase().includes(content.toLowerCase())).first();
                if (channel && channel.type === 'GUILD_CATEGORY' && channel.viewable && channel.guild.id === message.guild.id) {

                    responses.category = channel;
                } else {
                    let errorChannel = await message.translate("ERROR_CHANNEL_CATEGORY")
                    return m.errorMessage(errorChannel)
                    break;
                }

            } if (i ===5) {
                if (content.length >2000 || content.length < 2) {
                    let numberErr = await message.translate("MESSAGE_ERROR")
                return m.errorMessage(numberErr.replace("{amount}", "2").replace("{range}", "2000"))
                    break;
                } else {
                    responses.messageWelcome = content;
                }

            }
        }
        return responses;
    }
},
};