const Discord = require('discord.js');
const emoji = require('../../emojis.json')
const ms = require('ms');
const Welcome = require('../../database/models/Welcome');

const giveawayModel = require('../../database/models/giveaway');
const { codePointAt } = require('ffmpeg-static');
const prompts = [
    "Bonjour ! commencez par me dire si je doit **activer** ou **désactiver** le système de bienvenue . Répondez par (**enable** ou **disable**) !",
    "Super ! et maintenant , dans quel salon je vais devoir envoyer votre message ? Donnez un salon textuel",
    "Magnifique ! Mais inréréssons nous maintenant au message que je vais devoir envoyer .\n**Aide**:\n\`{user}\` : mentionne l'utilisateur\n\`{tag}\` : Met le tag de l'utilisteur ( ex : Pauldb09#0001)\n\`{username}\` : Met le nom d'utilisateur du membre\n\`{server}\` : Met le nom du serveur\n\`{membercount}\` : Met le nombre de membres du serveur\n\`{inviter}\` : Met la personne qui a invité le membres\n\`{invites}\` : Met le nombre d'invitations de la personne qui a invité le membres",
    "Bien . Mais sous quelle forme je vais devoir l'envoyer ? Si vous voulez une image , mettez **image**  Et si vous ne voulez que le texte : **text**"
]
module.exports = {
        name: 'welcome',
        description: 'Configure le système de bienvenue . Cette commande inclut un collecteur de messages , vous n\'avez donc pas besoin d\'arguments.',
        aliases: ['bienvenue', 'bvn', ],
        guildOnly: true,
        cat: 'configuration',
        permissions: ['MANAGE_GUILD'],
        botpermissions: ["SEND_MESSAGES", "EMBED_LINKS", ],
        async execute(message, args, client) {
            const welcomeDB = await Welcome.findOne({ serverID: message.guild.id, reason: `welcome` })

            let embed = new Discord.MessageEmbed()
                .setAuthor(`${message.author.username}`, message.author.displayAvatarURL({ dynamic: true, size: 512 }))

            .setColor("#F0B02F")
                .setTitle(`Système d'accueil`)
                .setDescription(`💡 Vous pouvez aussi me configurer depuis mon [Dashboard](http://green-bot.xyz/)`)
                .addField('Statut actuel', `Activé ?${welcomeDB ? welcomeDB.status ? "<:IconSwitchIconOn:825378657287274529>": "<:icon_SwitchIconOff:825378603252056116>" : "<:icon_SwitchIconOff:825378603252056116>"}\n image : ${welcomeDB ? welcomeDB.image ? "<:IconSwitchIconOn:825378657287274529>" : "<:icon_SwitchIconOff:825378603252056116>" : "<:icon_SwitchIconOff:825378603252056116>"}\nSalon  ${ welcomeDB ? welcomeDB.channelID ? `<#${welcomeDB.channelID}>` : "Non défini" : "Non défini" }\nMessage actuel : \n\`\`\`${ welcomeDB ? welcomeDB.message ? `${welcomeDB.message}` : "Aucun message défini" : "Aucun message défini" }\`\`\``)
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
                    const verify = await Welcome.findOne({ serverID: message.guild.id, reason: `welcome` })
                    if (verify) {
                        const newchannel = await Welcome.findOneAndUpdate({ serverID: message.guild.id, reason: `welcome` }, { $set: { channelID: response.channel.id, reason: `welcome `, message: response.message, status: response.status, image: response.image, } }, { new: true });
            
                        message.succesMessage(`Votre configuration pour les messages d'accueil a bien été sauvegardée. `);
            
                } else {
                    const verynew = new Welcome({
                        serverID: `${message.guild.id}`,
                        channelID: `${response.channel.id}`,
                        reason: 'welcome',
                        message: response.message,
                        status: response.status,
                        image: response.image,
                    }).save();
                    message.succesMessage(`Votre configuration pour les messages d'accueil a bien été sauvegardée. `);
            
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
                if (content === 'enable') {
                    responses.status = true;
                } else if (content === 'disable') {
                    responses.status = null;
                    const verify = await Welcome.findOne({ serverID: message.guild.id, reason: `welcome` })
                    if (verify) {
                        const newchannel = await Welcome.findOneAndUpdate({ serverID: message.guild.id, reason: `welcome` }, { $set: { status: null } }, { new: true });

                        return message.succesMessage(`Les messages d'accueil sont désormais désactivés. `);

                    }
                    return message.succesMessage(`Les messages d'accueil sont déja désactivés `);

                } else {
                    return message.errorMessage(`Veuillez fournir l'argument attendu : **enable** ou **disable**`)
                }

            }
            if (i === 1) {
                let channel = m.mentions.channels.first() || message.guild.channels.cache.get(content) || message.guild.channels.cache.filter(m => m.type === 'text' && m.name.includes(args.join(" "))).first();
                if (channel && channel.type === 'text' && channel.viewable) {

                    responses.channel = channel;
                } else {
                    return message.errorMessage(`Le salon indiqué est invalide , il faut mettre le nom du salon ou donner son ID et ce doit être un salon Textuel. Veuillez refaire la commande.`)
                    break;
                }
            }
            if (i === 2) {
                if (content.length > 1000 || content.length < 1) {
                    return message.errorMessage(`Veuillez fournir un message valide qui ne dépasse pas les 1000 caractères.`)
                    break;
                } else {
                    responses.message = content;
                }
            }
            if (i === 3) {
                if (content === 'image') {
                    responses.image = true;
                } else if (content === 'text') {
                    responses.image = null;

                } else {
                    return message.errorMessage(`Veuillez fournir l'argument attendu :  **image** ou **text**`)
                }

            }
        }
        return responses;
    }
},
};