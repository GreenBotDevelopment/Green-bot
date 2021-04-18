const Discord = require('discord.js');
const emoji = require('../../emojis.json')
const ms = require('ms');
const giveawayModel = require('../../database/models/giveaway');
const Temps = require('../../database/models/Temps');

const { codePointAt } = require('ffmpeg-static');
const prompts = [
    "Bonjour ! commencez par me donner le **salon** qui une fois rejoint devra créer un salon temporaire ( salon vocal uniquement) !",
    "Super ! et maintenant , dans quelle catégorie je dois créer les salons temporaires ? donnez un ID de salon ou le nom !",
    "Magnifique ! et combien de personnes maximum pourront aller dans ces salons temporaires ? ( donnez un nombre entre 1 et 10 )",

]
module.exports = {
        name: 'temps-channels',
        description: 'Configure les salons temporaires sur le serveur.',
        aliases: ['temps-channel', 'tmps-channels'],
        guildOnly: true,
        cat: 'configuration',
        permissions: ['MANAGE_GUILD'],
        botpermissions: ["SEND_MESSAGES", "EMBED_LINKS", ],
        async execute(message, args, client) {
            const welcomeDB = await Temps.findOne({ serverID: message.guild.id })

            let embed = new Discord.MessageEmbed()
                .setAuthor(`${message.author.username}`, message.author.displayAvatarURL({ dynamic: true, size: 512 }))

            .setColor("#F0B02F")
                .setTitle(`Salons vocaux temporaires`)
                .setDescription(`💡 Vous pouvez aussi me configurer depuis mon [Dashboard](http://green-bot.xyz/)`)
                .addField('Statut actuel', `Activé ?${welcomeDB ? "<:IconSwitchIconOn:825378657287274529>": "<:icon_SwitchIconOff:825378603252056116>"}\n \nSalon  ${ welcomeDB ? welcomeDB.channelID ? `<#${welcomeDB.channelID}>` : "Non défini" : "Non défini" }\nTaille : ${ welcomeDB ? welcomeDB.size : "Non défini" }`)
        .addField('Utilisation', `Vous n'avez pas besoin d'arguments pour cette commande . Il suffit de réagir avec <:panelconfig:830347712330203146> pour débuter la configuration . \n Vous pouvez mettre \`cancel\` à tout moment pour annuler `)
 

    .setThumbnail(url = message.client.user.displayAvatarURL({ dynamic: true, size: 512 }))

    .setFooter(message.client.footer, message.client.user.displayAvatarURL({ dynamic: true, size: 512 }))


    message.channel.send(embed).then((m) => {
        m.react("<:panelconfig:830347712330203146>")
        const filtro = (reaction, user) => {
            return user.id == message.author.id;
        };
        m.awaitReactions(filtro, {
            max: 1,
            time: 20000,
            errors: ["time"]
        }).catch(() => {

        }).then(async(coleccionado) => {

            const reaccion = coleccionado.first();
            if (reaccion.emoji.id === "830347712330203146") {
                const response = await getResponses(message)
                const options = {
                    childAutoDelete: true,
                    childCategory: response.category,
                    childAutoDeleteIfOwnerLeaves: true,
                    childMaxUsers: response.max,
                    childBitrate: 64000,
                    childFormat: (member, count) => `#${count} | Salon de ${member.user.username}`
                };
let check = await Temps.findOne({serverID:message.guild.id})
if(check){
if(response.channel.id !== check.channelID){
    message.client.tempChannels.unregisterChannel( check.channelID);
    message.client.tempChannels.registerChannel(response.channel.id, options);
    const newchannel = await Temps.findOneAndUpdate({ serverID: message.guild.id}, { $set: { channelID: response.channel.id,categoryID: response.category.id,size: response.max} }, { new: true });
    message.succesMessage(`Le salons vocaux temporaires ont étés configurés avec succès dans ce serveur : \`#${response.channel.name}\` `);

}else{
    const newchannel = await Temps.findOneAndUpdate({ serverID: message.guild.id}, { $set: { channelID: response.channel.id,categoryID: response.category.id,size: response.max} }, { new: true });
    message.succesMessage(`Le salons vocaux temporaires ont étés configurés avec succès dans ce serveur : \`#${response.channel.name}\` `);

}
}else{
    message.client.tempChannels.registerChannel(response.channel.id, options);
    let addTemps = new Temps({
        serverID: message.guild.id,
        channelID: response.channel.id,
        categoryID: response.category.id,
        size: response.max,

    }).save()

    message.succesMessage(`Le salons vocaux temporaires ont étés configurés avec succès dans ce serveur : \`#${response.channel.name}\` `);

}
               
             
        
            }
        });
    });
        async function getResponses(message) {
            const validTime = /^\d+(s|m|h|d)$/;
            const validNumber = /^\d+/;
            const responses = {}

            for (let i = 0; i < prompts.length; i++) {
                await message.mainMessage(prompts[i]);
                const response = await message.channel.awaitMessages(m => m.author.id === message.author.id, { max: 1 })
                const { content } = response.first();
                const m = response.first();
                if(content.toLowerCase() === "cancel"){
                    response.stop()
                    return message.succesMessage(`Opération annulée avec succès`)
                }
                if (i === 0) {
                    let channel = m.mentions.channels.first() || message.guild.channels.cache.get(content) || message.guild.channels.cache.filter(m => m.type === 'voice' && m.name.includes(args.join(" "))).first();
                    if (channel && channel.type === 'voice' && channel.viewable) {

                        responses.channel = channel;
                    } else {
                        message.errorMessage(`Le salon indiqué est invalide , il faut mettre le nom du salon ou donner son ID et ce doit être un salon vocal. Veuillez refaire la commande.`)
                        return;
                    }

                }
                if (i === 1) {
                    let channel = m.mentions.channels.first() || message.guild.channels.cache.get(content) || message.guild.channels.cache.filter(m => m.name.includes(args.join(" "))).first();
                    if (channel && channel.type === 'category' && channel.viewable) {

                        responses.category = channel;
                    } else {
                        message.errorMessage(`Le salon indiqué est invalide , il faut mettre le nom du salon ou donner son ID et ce doit être une catégorie. Veuillez refaire la commande.`)
                        return;
                    }
                }
                if (i === 2) {
                    if (isNaN(content) || content > 10 || content < 1) {
                        message.errorMessage(`Veuillez fournir un nombre valide , plus grand que 1 et plus petit que 10. Veuillez refaire la commande.`)
                        return;
                    } else {
                        responses.max = content;
                    }
                }

            }
            return responses;
        }
    },
};