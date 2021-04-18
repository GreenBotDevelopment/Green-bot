const Discord = require('discord.js');
const emoji = require('../../emojis.json')
const ms = require('ms');
const ticketPanel = require('../../database/models/ticketPanel');

const { codePointAt } = require('ffmpeg-static');
const prompts = [
    "Bonjour ! commencez par me donner le **salon** dans lequel je vais envoyer ce panel !",
    "Super ! et maintenant , Donnez moi le rôle support qui aura accès à ce panel",
    "Magnifique ! Et maintenant donnez moi un titre pour ce panel (la raison pour laquelle les utilisateurs ouvrent un ticket)",
    "Bien . Et quelle sera la description de ce panel ( Le message sur l'embed invitant les utilisateurs à créer un ticket)",
    "D'accord . Et dans quelle catégorie je doit créer ce ticket ?",
    "Tout est Ok. Mais il faut donner le message qui va accueillir les membres dans leur ticket \n**Aide**:\n\`{user}\` : mentionne l'utilisateur qui vient d'ouvrir le ticket ."

]
module.exports = {
        name: 'ticket-system',
        description: 'Configure le système de tickets . Vous pouvez tout configurer avec seulement cette commande',
        aliases: ['ticket', 'panel-ticket', 'ticket-panel'],
        guildOnly: true,
        cat: 'configuration',
        permissions: ['MANAGE_GUILD'],
        botpermissions: ["SEND_MESSAGES", "EMBED_LINKS", ],
        async execute(message, args, client) {
            if (!args.length) {


                const ticketDB = await ticketPanel.find({ serverID: message.guild.id })

                let embed = new Discord.MessageEmbed()
                    .setAuthor(`${message.author.username}`, message.author.displayAvatarURL({ dynamic: true, size: 512 }))

                .setColor("#F0B02F")
                    .setTitle(`Système de tickets`)
                    .setDescription(`💡 Vous pouvez aussi me configurer depuis mon [Dashboard](http://green-bot.xyz/)\n${message.guild.premium ? `<:nitro_gris_activ:830451169486700585> Vous avez le premium et pouvez donc avoir **8** panels de tickets au lieu de **3**` :'<:nitro_gris_activ:830451169486700585> Vous n\'avez pas le premium pour ce serveur , vous avez donc une limite de **3** panels'}`)
                    .addField(`Panels (${ticketDB.length}/${message.guild.premium ? "8":"3"})`, `${ticketDB.length > 0  ? `${ticketDB.map(t=>`\`${t.ticketID}\` :**${t.titleEmbed}**\nSalon : <#${t.channelID}> Rôle : <@&${t.roleID}> `).join("\n")}`: "Aucun panel pour le moment"}`)
            .addField('Utilisation', `**Créer un panel**\n\`${message.guild.prefix}ticket-system create\` . Le bot va ensuite créer un collecteur de messages donc pas besoin d'aguments !\n**Supprimer un panel**\n\`${message.guild.prefix}ticket-system delete <id du panel>\` : le panel sera supprimé et le message aussi`)
     

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
                   m.delete().catch((err)=>{message.errorMessage(`je ne peut pas supprimer le message car je n'ait pas les permissions..`)})
                
            


                }

            });
        });

      return;
    }
if(args[0] === "create"){
    const ticketDB = await ticketPanel.find({ serverID: message.guild.id })

    if(ticketDB.length === 3 && !message.guild.premium) return message.errorMessage(`Vous avez atteint la limte de panels de tickets . Votez pour le bot pour en avoir 5 supplémentaires ! [Voter](https://top.gg/bot/783708073390112830/vote)`)
    const response = await getResponses(message)
    let embed = new Discord.MessageEmbed()
    .setTitle(response.titleEmbed)
    .setColor(message.client.color)

.setDescription(`\n${response.messageEmbed}`)
    .setFooter(message.client.footer, message.client.user.displayAvatarURL());
response.channel.send(embed).then(m => {
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
    message.succesMessage(`Le panel de ticket a bien été créer , son ID est : \`${uniqID}\`. Tu peut aller voir le message dans <#${response.channel.id}>`);
});


}else if(args[0] === "delete" && args.slice(1).join("")){
    let ID = args.slice(1).join("");
let chekexeist = await ticketPanel.findOne({ticketID:ID , serverID: message.guild.id})
if(!chekexeist) return message.errorMessage(`je n'ai trouvé aucun panel de ticket avec pour id \`${ID}\``)
let de = await ticketPanel.findOneAndDelete({ticketID:ID , serverID: message.guild.id})
message.guild.channels.cache.get(chekexeist.channelID).messages.fetch(chekexeist.messageID).then(m=>m.delete())
return message.succesMessage(`Panel supprimé avec succès !`)


}else{
    

    const ticketDB = await ticketPanel.find({ serverID: message.guild.id })

    let embed = new Discord.MessageEmbed()
        .setAuthor(`${message.author.username}`, message.author.displayAvatarURL({ dynamic: true, size: 512 }))

    .setColor("#F0B02F")
        .setTitle(`Système de tickets`)
        .setDescription(`💡 Vous pouvez aussi me configurer depuis mon [Dashboard](http://green-bot.xyz/)\n${message.guild.premium ? `<:nitro_gris_activ:830451169486700585> Vous avez le premium et pouvez donc avoir **8** panels de tickets au lieu de **3**` :'<:nitro_gris_activ:830451169486700585> Vous n\'avez pas le premium pour ce serveur , vous avez donc une limite de **3** panels'}`)
        .addField(`Panels (${ticketDB.length}/${message.guild.premium ? "8":"3"})`, `${ticketDB.length > 0  ? `${ticketDB.map(t=>`\`${t.ticketID}\` **${t.titleEmbed}**  \nSalon : <#${t.channelID}> Rôle : <@&${t.roleID}> `).join("\n")}`: "Aucun panel pour le moment"}`)
.addField('Utilisation', `**Créer un panel**\n\`${message.guild.prefix}ticket-system create\` . Le bot va ensuite créer un collecteur de messages donc pas besoin d'aguments !\n**Supprimer un panel**\n\`${message.guild.prefix}ticket-system delete <id du panel>\` : le panel sera supprimé et le message aussi`)


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
       m.delete().catch((err)=>{message.errorMessage(`je ne peut pas supprimer le message car je n'ait pas les permissions..`)})
    



    }

});
});

}
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
                let channel = m.mentions.channels.first() || message.guild.channels.cache.get(content) || message.guild.channels.cache.filter(m => m.type === 'text' && m.name.includes(content)).first();
                if (channel && channel.type === 'text' && channel.viewable) {

                    responses.channel = channel;
                } else {
                    return message.errorMessage(`Le salon indiqué est invalide , il faut mettre le nom du salon ou donner son ID et ce doit être un salon Textuel. Veuillez refaire la commande.`)
                    break;
                }

            }
            if (i === 1) {
                let role = m.mentions.roles.first() || message.guild.roles.cache.get(content) 
                if(!role) return message.errorMessage(`Le rôle fourni n'est pas un rôle valide . Veuillez refaire la commande`)
                       
                 responses.role = role

            }
            if (i === 2) {
                if (content.length > 500 || content.length < 1) {
                    return message.errorMessage(`Votre titre ne doit pas exéder les 300 caractères.`)
                    break;
                } else {
                    responses.titleEmbed = content;
                }
            }
            if (i === 3) {
                if (content.length >2000 || content.length < 1) {
                    return message.errorMessage(`Votre description  ne doit pas exéder les 2000 caractères.`)
                    break;
                } else {
                    responses.messageEmbed = content;
                }
            }
            if (i ===4) {
                let channel = m.mentions.channels.first() || message.guild.channels.cache.get(content) || message.guild.channels.cache.filter(m => m.type === 'category' && m.name.includes(content)).first();
                if (channel && channel.type === 'category' && channel.viewable) {

                    responses.category = channel;
                } else {
                    return message.errorMessage(`Le salon indiqué est invalide , il faut mettre le nom du salon ou donner son ID et ce doit être une Catégorie. Veuillez refaire la commande.`)
                    break;
                }

            } if (i ===5) {
                if (content.length >4000 || content.length < 1) {
                    return message.errorMessage(`Votre message ne doit pas exéder les 2000 caractères.`)
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