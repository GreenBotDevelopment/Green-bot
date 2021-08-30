const Discord = require('discord.js');
const guild = require('../../database/models/guild');
module.exports = {
        name: 'ignoreds',
        description: 'Ajoute un role ou salon dans la liste des salons ignorés par l\'antiraid',
        cat: 'antiraid',
        args: true,
        usage: '<channel || role > <add || remove || list> @role/#channel',
        exemple: 'channel add #channel',
        permissions: ['MANAGE_GUILD'],
        async execute(message, args) {
            let type = args[0];
            if (!type || (type !== "channel" && type !== "role")) {
                let err = await message.translate("ARGS_REQUIRED")
                const reportEmbed = new Discord.MessageEmbed()
                    .setAuthor(`${message.author.username}`, message.author.displayAvatarURL({ dynamic: true, size: 512 }))
                    .setDescription(`${err.replace("{command}","ignoreds")} \`${message.guild.settings.prefix}ignoreds <channel || role > <add || remove || list> @role/#channel\``)
                    .setFooter(message.client.footer)
                    .setColor("#F0B02F")
                return message.channel.send({ embeds: [reportEmbed] })
            }
            let bien;
            if (type === "channel") {
                bien = "ignoreds channels";
            } else {
                bien = "ignored roles"
            }
            let action = args[1]
            if (!action || (action !== "add" && action !== "remove" && action !== "list")) {
                const reportEmbed = new Discord.MessageEmbed()
                    .setAuthor(`${message.author.username}`, message.author.displayAvatarURL({ dynamic: true, size: 512 }))
                    .setDescription(`${err.replace("{command}","ignoreds")} \`${message.guild.settings.prefix}ignoreds <channel || role > <add || remove || list> @role/#channel\``)
                    .setFooter(message.client.footer)
                    .setColor("#F0B02F")
                return message.channel.send({ embeds: [reportEmbed] })
            }
            if (action === 'add') {
                if (type === "channel") {
                    let channel = message.mentions.channels.first() || message.guild.channels.cache.get(content) || message.guild.channels.cache.filter(m => m.type === "GUILD_TEXT" && m.name.toLowerCase().includes(args[2].toLowerCase())).first();
                    if (!channel || channel.type !== 'GUILD_TEXT' || !channel.viewable) {
                        let errorChannel = await message.translate("ERROR_CHANNEL")
                        return message.errorMessage(errorChannel)

                    }

                    const verify = await guild.findOne({ serverID: message.guild.id, reason: `ignoreds_channel`, content: channel.id })
                    if (verify) return message.errorMessage(`This channel is already ignored`)
                    let create = new guild({
                        serverID: `${message.guild.id}`,
                        content: `${channel.id}`,
                        reason: `ignoreds_channel`
                    }).save()
                    message.succesMessage(`The  ${channel} has been added succesfully in the derogations !`)
                } else {
                    const role = message.mentions.roles.first() || message.guild.roles.cache.get(args[2])
                    if (!role || role.name === '@everyone' || role.name === 'here' || role.managed) {
                        let err = await message.translate("ERROR_ROLE")
                        return message.errorMessage(err);
                    }
                    const verify = await guild.findOne({ serverID: message.guild.id, reason: `ignoreds_role`, content: role.id })
                    if (verify) return message.errorMessage(`This role is already ignored`)
                    let create = new guild({
                        serverID: `${message.guild.id}`,
                        content: `${role.id}`,
                        reason: `ignoreds_role`
                    }).save()
                    message.succesMessage(`The role ${role} is now ignored by the anti raid system.`)

                }
            }
            if (action === 'list') {
                const dispo = await guild.find({ serverID: message.guild.id, reason: `ignoreds_${type}` })
                if (dispo.length == 0) return message.errorMessage(`There is no ${bien} in this server yet.`)



                if (dispo.length < 8) {
                    const embed = new Discord.MessageEmbed()

                    .setTitle(`📃 List of ${bien}.`)

                    .setColor(message.guild.settings.color)
                        .setDescription(`${dispo.map(c=>`${type === "channel" ? `<#${c.content}>` : `<@&${c.content}>`}`).join(", ")}`)
           message.reply({ embeds: [embed], allowedMentions: { repliedUser: false } })
                
            
        } else {
            let i0 = 0;
        let i1 = 8;
        let page = 1;
        let description = dispo.map(c=>`${type === "channel" ? `<#${c.content}>` : `<@&${c.content}>`}`).slice(0,8).join(", ");
    
       
        const embed = new Discord.MessageEmbed()
        .setColor(message.guild.settings.color)
            .setTitle(`📃 List of ${bien} ${page}/${Math.ceil(dispo.length / 8)}`)
            .setDescription(description)
          
    
        const msg = await message.reply({ embeds: [embed], allowedMentions: { repliedUser: false } });
            
        await msg.react("⬅");
        await msg.react("➡");
    
        const c = msg.createReactionCollector((_reaction, user) => user.id === message.author.id);
    
        c.on("collect", async reaction => {
            if(reaction.emoji.name === "⬅") {
                i0 = i0 - 8;
                i1 = i1 - 8;
                page = page - 1
    
                if(i0 < 0) return;
                if(page < 1) return;
    
                let description = dispo.map(c=>`${type === "channel" ? `<#${c.content}>` : `<@&${c.content}>`}`).slice(i0,i1).join(", ");
    
                embed.setTitle(`📃 List of ${bien} ${page}/${Math.ceil(dispo.length / 8)}`)
                    .setDescription(description);
    
               msg.edit({embed:embed});
            }
    
            if(reaction.emoji.name === "➡") {
                i0 = i0 + 8;
                i1 = i1 + 8;
                page = page + 1
    
                if(i1 > dispo.length + 8) return;
                if(i0 < 0) return;
    
                let description = dispo.map(c=>`${type === "channel" ? `<#${c.content}>` : `<@&${c.content}>`}`).slice(i0,i1).join(", ");

                embed.setTitle(`📃 Liste des ${bien} ${page}/${Math.ceil(dispo.length / 8)}`)
                    .setDescription(description);
    
               msg.edit({embed:embed});
            }
    
            await reaction.users.remove(message.author.id);
        })
    }
}
   
if (action === 'remove') {
    if (type === "channel") {
        let channel = message.mentions.channels.first() || message.guild.channels.cache.get(content) || message.guild.channels.cache.filter(m => m.type === "GUILD_TEXT" && m.name.toLowerCase().includes(args[2].toLowerCase())).first();
        if (!channel || channel.type !== 'GUILD_TEXT' || !channel.viewable) {
            let errorChannel = await message.translate("ERROR_CHANNEL")
            return message.errorMessage(errorChannel)

        }

        const verify = await guild.findOne({ serverID: message.guild.id, reason: `ignoreds_channel`, content: channel.id })
        if (!verify) return message.errorMessage(`I don't have this channel in the derogations`)
        const verifyeee = await guild.findOneAndDelete({ serverID: message.guild.id, reason: `ignoreds_channel`, content: channel.id })

        message.succesMessage(`The channel ${channel} a été supprimé de la liste des salons ignorés !`)
    } else {
        const role = message.mentions.roles.first() || message.guild.roles.cache.get(args[2])
                if (!role || role.name === '@everyone' || role.name === 'here' || role.managed) {
            let err = await message.translate("ERROR_ROLE")
            return message.errorMessage(err);
                }
     
        const verify = await guild.findOne({ serverID: message.guild.id, reason: `ignoreds_role`, content: role.id })
        if (!verify) return message.errorMessage(`J'ai n'ai pas ce salon dans la liste des salons ignorés !`)
        const verifyeee = await guild.findOneAndDelete({ serverID: message.guild.id, reason: `ignoreds_role`, content: role.id })

        message.succesMessage(`Le salon ${role} a été supprimé de la liste des salons ignorés !`)

    }
}   









    },
};