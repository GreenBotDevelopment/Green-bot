const Discord = require('discord.js');
const sendErrorMessage = require('../../util.js');
const Welcome = require('../../database/models/guild');
const emojic = require('../../emojis.json')
const { oneLine } = require('common-tags');
const rrmodel = require('../../database/models/rr');
const { arg } = require('mathjs');
const { parse } = require("twemoji-parser");

const prompts = [
    "Bonjour ! Commencez par me donner le rôle qui devra être donné!",
    "Super ! et maintenant donnez l'emoji qui devra déclencher l'ajout de rôle . Seulement les emojis de base sont supportés .",

]
module.exports = {
    name: 'rr-add',
    description: 'Ajoute un role au système de roles à réactions',
    aliases: ['addrolereaction'],

    cat: 'admin',
    usage: '@role',
    exemple: '@pub',
    permissions: ['MANAGE_GUILD'],
    async execute(message, args) {



        const response = await getResponses(message)


        const verynew = new rrmodel({
            serverID: `${message.guild.id}`,
            roleID: `${response.role}`,
            reaction: `${response.emoji}`,
        }).save();




        message.succesMessage(`Role à réaction ajouté avec succès : <@&${response.role}> ==> ${response.emoji} . Une fois que vous avez ajouté tous les roles à réaction faites la commande\`rr-send\` dans le salon voulu `);


        async function getResponses(message) {
            const responses = {}


            for (let i = 0; i < prompts.length; i++) {
                await message.mainMessage(prompts[i]);
                const response = await message.channel.awaitMessages(m => m.author.id === message.author.id, { max: 1 })
                const { content } = response.first();
                const m = response.first();
                if (i === 0) {
                    let role = m.mentions.roles.first() || message.guild.roles.cache.get(content) ;
                    if (role.name === '@everyone' || role.name === '@here') {
                        return message.errorMessage(`Le rôle indiqué est invalide , il faut mettre le nom du rôle ou donner son ID .`)
                        break;

                    } else {
                        let channeldb = await rrmodel.findOne({ serverID: message.guild.id, roleID: role.id })
                        if (channeldb) {
                            return message.errorMessage(`J'ai déja ce rôle dans la base de données.`)
                            break;
                        }

                        responses.role = role.id;
                    }

                }
                if (i === 1) {
                    let customemoji = Discord.Util.parseEmoji(content);
                    if (customemoji.id) {
                        return message.errorMessage(`Je ne prend pas en charge les emojis personnalisés`);
                        break;
                    } else {
                        let CheckEmoji = parse(content, { assetType: "png" });
                        if (!CheckEmoji[0]) {
                            return message.errorMessage(`Veuillez me donnez un emoji valide à ajouter`)
                            break;

                        }
                        responses.emoji = content;

                    }

                }


            }
            return responses;
        }













    },
};