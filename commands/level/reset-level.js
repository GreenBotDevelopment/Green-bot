const Discord = require('discord.js');

const emoji = require('../../emojis.json')
const levelModel = require('../../database/models/level');
const { oneLine } = require('common-tags');
module.exports = {
    name: 'reset-data',
    description: 'Réinitialise toutes les donnés des niveaux pour le serveur actuel',
    aliases: ['resetdata'],
    guildOnly: true,
    cat: 'level',

    permissions: ['MANAGE_GUILD'],
    async execute(message, args) {
        let member;
        if (args.length) {
            member = message.mentions.members.first() || message.guild.members.cache.get(args[0]) || message.guild.members.cache.filter(m => m.user.tag.includes(args.join(" ")) || m.displayName.includes(args.join(" ")) || m.user.username.includes(args.join(" "))).first()
            if (!member) {
                return message.errorMessage(`Vous devez mentionner un membre valide ou fournir un ID valide.`)
            }
            const userdata = await levelModel.findOne({ serverID: message.guild.id, userID: member.user.id })
            if (!userdata) return message.errorMessage(`Cette personne n'a pas envoyé suffisament de message pour avoir des statistiques`)
            const dell = await levelModel.findOneAndDelete({ serverID: message.guild.id, _id: userdata._id });
            message.succesMessage(`Toutes le données de niveau de \`${member.user.username}\` ont étés supprimées`)
        } else {
            const verify = await levelModel.findOne({ serverID: message.guild.id })
            if (verify) {


                const embed = new Discord.MessageEmbed()

                .setTitle('Niveaux : réinitialiser')
                    .setDescription(`Vous êtes sur le point de supprimer **toutes** les données de niveau pour ce serveur .
                Veuillez confirmer avec ✅ ou annuler avec ❌.`)


                .setFooter(message.client.footer)

                .setColor(message.client.color);

                message.channel.send(embed).then(m => {
                    m.react("✅")
                    m.react("❌")


                    const filtro = (reaction, user) => {
                        return user.id == message.author.id;
                    };
                    m.awaitReactions(filtro, {
                        max: 1,
                        time: 20000,
                        errors: ["time"]
                    }).catch(() => {

                        const errorEmbed = new Discord.MessageEmbed()



                        .setDescription(`${emoji.error} Erreur : temps écoulé ! `)


                        .setFooter(message.client.footer)

                        .setColor("#982318");
                        m.edit(errorEmbed);
                    }).then(async(coleccionado) => {

                        const reaccion = coleccionado.first();
                        if (reaccion.emoji.name === "✅") {
                            const newchannel = await levelModel.find({ serverID: message.guild.id });
                            newchannel.forEach(async l => {
                                const dell = await levelModel.findOneAndDelete({ serverID: message.guild.id, _id: l._id });

                            })
                            return message.succesMessage(`Toutes les données de niveaux du serveur on étés supprimées.`)


                        }
                        if (reaccion.emoji.name === "❌") {
                            return message.succesMessage(`Suppression des données anulées.`)
                        }
                    });
                });
            } else {
                return message.errorMessage(`Vous devez avoir une configuration pour la supprimer.`)
            }
        }









    },
};