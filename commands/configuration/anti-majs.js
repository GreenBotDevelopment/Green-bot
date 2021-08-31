const Discord = require('discord.js');

const Welcome = require('../../database/models/Welcome');
const prompts = [
    "Bonjour ! commencez par me dire si je doit activer ou désactiver le système d'anti majuscules . \n Répondez par (**enable** ou **disable**) !",
    "Super ! et maintenant , à partir de quel pourcentage de majuscules je vais devoir sévir ? Donnez juste un nombre . (Recommandé : 70)",
    "Magnifique ! Mais inréréssons nous maintenant au message que je vais devoir envoyer quand la personne est avertie . Mettez **default** pour laisser le message de base.\n**Aide**:\n\`{user}\` : mentionne l'utilisateur\n\`{tag}\` : Met le tag de l'utilisteur ( ex : Pauldb09#0001)\n\`{username}\` : Met le nom d'utilisateur du membre\n\`{server}\` : Met le nom du serveur\n\`{WarnsCount}\` : Met le nombre d'avertisements de l'utilisateur",
    "Bien . Et à partir de combien d'avertisements je vais devoir bannir ?"
]
module.exports = {
        name: 'anti-caps',
        description: 'Active ou désactive le système contre les majuscules exessives',
        aliases: ["anti-majs"],

        cat: 'antiraid',

        exemple: 'on',
        permissions: ['MANAGE_GUILD'],
        async execute(message, args) {
            const ID = message.member.id;

            const verify = await Welcome.findOne({ serverID: message.guild.id, reason: `anti_majs` })
            let tip = await message.translate("DASHBOARD")
            let second = await message.translate("ARGS_TIP")
            let cfg = await message.translate("ACTUAL_CONFIG")

            let embed = new Discord.MessageEmbed()
                .setAuthor(`${message.author.username}`, message.author.displayAvatarURL({ dynamic: true, size: 512 }))
                .setURL("https://top.gg/bot/783708073390112830/vote")
                .setColor("#F0B02F")
                .setTitle(`${message.guild.settings.lang === "fr" ? "Anti majusules exessives":"Anti exessive capital letters"}`)
                .setDescription(tip).addField(cfg.title, `${cfg.enabled}${verify ? "<:IconSwitchIconOn:825378657287274529>": "<:icon_SwitchIconOff:825378603252056116>"}\n Pourcentage de majuscules : ${verify ? verify.image ? `**${verify.image}**%` : cfg.no: cfg.no}\n ${message.guild.settings.lang === "fr" ? "Avertisements avant le ban":"Pre-ban warnings"}: ${verify ? verify.channelID ? `${verify.channelID}` : cfg.no: cfg.no}\nMessage: \n\`\`\`${ verify ? verify.message ? `${verify.message}` : cfg.no : cfg.no }\`\`\``)
                .addField(`${message.guild.settings.lang === "fr" ? "`📜` Utilisation":"`📜` Use"}`, second)

    .setThumbnail(url = message.client.user.displayAvatarURL({ dynamic: true, size: 512 }))

    .setFooter(message.client.footer, message.client.user.displayAvatarURL({ dynamic: true, size: 512 }))


    message.reply({ embeds: [embed], allowedMentions: { repliedUser: false } }).then((m) => {
        m.react("📜")
        const filter = (reaction, user) => reaction.emoji.name === "📜" && user.id === message.author.id;
        const collector = m.createReactionCollector({ filter, time: 1000000,max:1 });
            collector.on('collect',async  r =>{
            const response = await getResponses(message)
                if (!response || response.cancelled) return message.client.log ? console.log(`Command ${message.content} | Cancelled`) : null
            const a = await message.translate("CONFIG_OK")
            let b = await message.gg("le système contre les majuscules exessives")
            const verify = await Welcome.findOne({ serverID: message.guild.id, reason: `anti_majs` })
            if (verify) {
                const newchannel = await Welcome.findOneAndUpdate({ serverID: message.guild.id, reason: `anti_majs` }, { $set: { channelID: response.chances, reason: `anti_majs`, message: response.message,  image: response.percent, } }, { new: true });
    
                message.succesMessage(a.replace("{x}",b));
    
        } else {
            const verynew = new Welcome({
                serverID: `${message.guild.id}`,
                channelID: `${response.chances}`,
                reason: 'anti_majs',
                message:  `${response.message}`,
                image: `${response.percent}`,
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
                const verify = await Welcome.findOne({ serverID: message.guild.id, reason: `anti_majs` })
                if (verify) {
                    const newchannel = await Welcome.findOneAndDelete({ serverID: message.guild.id, reason: `anti_majs` });

                    return message.succesMessage(ll.succes);

                }
                return message.succesMessage(ll.disable);

            } else {
                return m.errorMessage(ll.err)
            }

        }
        if (i === 1) {
            if (isNaN(content) || content < 1 || content > 100|| m.content.includes('-') || m.content.includes('+') || m.content.includes(',') || m.content.includes('.')) {
                let numberErr = await message.translate("NUMBER_ERROR")
                return m.errorMessage(numberErr.replace("{amount}", "1").replace("{range}", "10"))
                break;      
            }else{
                responses.percent = parseInt(content)
            }

        }
        if (i === 2) {
            if(content === 'default'){
                let a = await message.gg(`⚠ Attention {user} , tu met trop de majuscules dans ton message ! Si tu continues je serait obligé de te sanctionner...`)
                responses.message = a
            }else{
            if (content.length > 1000 || content.length < 1) {
                let numberErr = await message.translate("MESSAGE_ERROR")
                return m.errorMessage(numberErr.replace("{amount}", "2").replace("{range}", "1000"))
                    break;
            } else {
                responses.message = content;
            }
        }
        }
        if (i === 3) {
            if (isNaN(content) || content < 1 || content > 10|| m.content.includes('-') || m.content.includes('+') || m.content.includes(',') || m.content.includes('.')) {
                let numberErr = await message.translate("NUMBER_ERROR")
                return m.errorMessage(numberErr.replace("{amount}", "1").replace("{range}", "10"))
                break;      
                        }else{
                responses.chances = parseInt(content)
            }

        }
    }
   
   
    return responses;
}











    },
};