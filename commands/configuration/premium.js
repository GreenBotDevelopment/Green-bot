const Discord = require('discord.js');
const sendErrorMessage = require('../../util.js');
const emoji = require('../../emojis.json')
const premiumDB = require('../../database/models/premium');
const guild = require('../../database/models/guild');

const { stripIndent, oneLine } = require('common-tags');
module.exports = {
        name: 'premium',
        description: 'Affiche le statut du premium du serveur ou du votre .',
        cat: 'admin',
        usage: 'give',
        exemple: 'give',

        async execute(message, args) {

            if (!args.length) {


                const premium = await premiumDB.findOne({ userID: message.author.id })

                let embed = new Discord.MessageEmbed()
                    .setAuthor(`${message.author.username}`, message.author.displayAvatarURL({ dynamic: true, size: 512 }))

                .setColor("#F0B02F")
                    .setTitle(`<:nitro_gris_activ:830451169486700585> Premium`)
                    .setDescription(`💡 Vous pouvez aussi voir votre abonnement sur le [Dashboard](http://green-bot.xyz/premium)\n Le premium de Green-bot est **entièrement** gratuit , il suffit de [Voter](https://top.gg/bot/783708073390112830/vote) sur Top.gg !`)
                    .addField(`Premium du serveur `, `${message.guild.premium ? `Ce serveur a actuelement le premium . \nPremium donné par <@${message.guild.premiumuserID}>\n `:`Ce serveur n'a pas encore d'abonnement premium `}`)
            .addField('Votre premium', `${premium ? `Vous avez actuelement premium .\nPour l'offir à **${message.guild.name}** , faîtes \`${message.guild.prefix}premium give\` .`:"Vous n'avez pas encore le premium ! [Votez](https://top.gg/bot/783708073390112830/vote) Pour l'avoir !!"}`)
     

        .setThumbnail(url = message.client.user.displayAvatarURL({ dynamic: true, size: 512 }))

        .setFooter(message.client.footer, message.client.user.displayAvatarURL({ dynamic: true, size: 512 }))


        message.channel.send(embed).then((m) => {
            m.react("<:delete:830790543659368448>")
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
                if (reaccion.emoji.id === "830790543659368448") {
                   m.delete().catch((err)=>{message.errorMessage(`je ne peut pas supprimer le message car je n'ai pas les permissions..`)})
                
            


                }

            });
        });

      return;
    }
if(args[0].toLowerCase() === "give"){
    const premium = await premiumDB.findOne({ userID: message.author.id })
    if(!premium) return message.errorMessage(`Eh non , tu dois avoir le premium pour faire ça ..`)

    if(message.guild.premium) return message.errorMessage(`Ce serveur a déjà le premium. Pour voir le statut faites \`${message.guild.prefix}premium\``)
let veznexe = new guild({
    serverID:message.guild.id,
    reason: `premium`,
    content: `${message.author.id}`,    
}).save()
message.succesMessage(`:tada: Wahou , vous avez donné le premium à **${message.guild.name}** avec succès ! `)
     }else{

    const premium = await premiumDB.findOne({ userID: message.author.id })

    let embed = new Discord.MessageEmbed()
                    .setAuthor(`${message.author.username}`, message.author.displayAvatarURL({ dynamic: true, size: 512 }))

                .setColor("#F0B02F")
                    .setTitle(`<:nitro_gris_activ:830451169486700585> Premium`)
                    .setDescription(`💡 Vous pouvez aussi voir votre abonnement sur le [Dashboard](http://green-bot.xyz/premium)\n Le premium de Green-bot est **entièrement** gratuit , il suffit de [Voter](https://top.gg/bot/783708073390112830/vote) sur Top.gg !`)
                    .addField(`Premium du serveur `, `${message.guild.premium ? `Ce serveur a actuelement le premium . \nPremium donné par <@${message.guild.premiumuserID}>\n `:`Ce serveur n'a pas encore d'abonnement premium `}`)
            .addField('Votre premium', `${premium ? `Vous avez actuelement premium .\nPour l'offir à **${message.guild.name}** , faîtes \`${message.guild.prefix}premium give\` .`:"Vous n'avez pas encore le premium ! [Votez](https://top.gg/bot/783708073390112830/vote) Pour l'avoir !!"}`)
     

        .setThumbnail(url = message.client.user.displayAvatarURL({ dynamic: true, size: 512 }))

        .setFooter(message.client.footer, message.client.user.displayAvatarURL({ dynamic: true, size: 512 }))


        message.channel.send(embed).then((m) => {
m.react("<:delete:830790543659368448>")
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
    if (reaccion.emoji.id === "830790543659368448") {
       m.delete().catch((err)=>{message.errorMessage(`je ne peut pas supprimer le message car je n'ai pas les permissions..`)})
    



    }

});
});

return;
}



    },
};