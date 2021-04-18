const Discord = require('discord.js');
const emoji = require('../../emojis.json')
const ms = require('ms');
const giveawayModel = require('../../database/models/giveaway');
const { codePointAt } = require('ffmpeg-static');
const prompts = [
    "Bonjour ! commencez par me donner le **salon** qui une fois rejoint devra créer un salon temporaire ( salon vocal uniquement) !",
    "Super ! et maintenant , dans quelle catégorie je dois créer les salons textuels ? donnez un ID de salon ou le nom !",
    "Magnifique ! et combien de personnes maximum pourront aller dans ces salons temporaires ? ( donnez un nombre entre 1 et 10 )",

]
module.exports = {
    name: 'welcome',
    description: 'Configure le système de bienvenue . Cette commande inclut un collecteur de messages , vous n'
    avez donc pas besoin d 'arguments.',
    aliases: ['bienvenue', 'bvn'],
    guildOnly: true,
    cat: 'configuration',
    permissions: ['MANAGE_GUILD'],
    botpermissions: ["SEND_MESSAGES", "EMBED_LINKS", ],
    async execute(message, args, client) {

        const response = await getResponses(message)

        const options = {
            childAutoDelete: true,
            childCategory: response.category,
            childAutoDeleteIfOwnerLeaves: true,
            childMaxUsers: response.max,
            childBitrate: 64000,
            childFormat: (member, count) => `#${count} | Salon de ${member.user.username}`
        };
        message.client.tempChannels.registerChannel(response.channel.id, options);
        await message.client.db.push("temp-channels", {
            channelID: response.channel.id,
            options: options
        });
        message.succesMessage(`Le salons vocaux temporaires ont étés configurés avec succès dans ce serveur : \`#${response.channel.name}\` `);


        async function getResponses(message) {
            const validTime = /^\d+(s|m|h|d)$/;
            const validNumber = /^\d+/;
            const responses = {}

            for (let i = 0; i < prompts.length; i++) {
                await message.mainMessage(prompts[i]);
                const response = await message.channel.awaitMessages(m => m.author.id === message.author.id, { max: 1 })
                const { content } = response.first();
                const m = response.first();
                if (i === 0) {
                    let channel = m.mentions.channels.first() || message.guild.channels.cache.get(content) || message.guild.channels.cache.filter(m => m.type === 'voice' && m.name.includes(args.join(" "))).first();
                    if (channel && channel.type === 'voice' && channel.viewable) {

                        responses.channel = channel;
                    } else {
                        message.errorMessage(`Le salon indiqué est invalide , il faut mettre le nom du salon ou donner son ID et ce doit être un salon vocal. Veuillez refaire la commande.`)
                        break;
                    }

                }
                if (i === 1) {
                    let channel = m.mentions.channels.first() || message.guild.channels.cache.get(content) || message.guild.channels.cache.filter(m => m.name.includes(args.join(" "))).first();
                    if (channel && channel.type === 'category' && channel.viewable) {

                        responses.category = channel;
                    } else {
                        message.errorMessage(`Le salon indiqué est invalide , il faut mettre le nom du salon ou donner son ID et ce doit être une catégorie. Veuillez refaire la commande.`)
                        break;
                    }
                }
                if (i === 2) {
                    if (isNaN(content) || content > 10 || content < 1) {
                        message.errorMessage(`Veuillez fournir un nombre valide , plus grand que 1 et plus petit que 10. Veuillez refaire la commande.`)
                        break;
                    } else {
                        responses.max = content;
                    }
                }

            }
            return responses;
        }
    },
};