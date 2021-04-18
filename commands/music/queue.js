const Discord = require('discord.js');


const emoji = require('../../emojis.json')

module.exports = {
        name: 'queue',
        description: 'affiche tous les sons dans la queue',
        cat: 'musique',

        botpermissions: ['CONNECT', 'SPEAK'],

        async execute(message, args) {


            const voice = message.member.voice.channel;
            if (!voice) {
                return message.errorMessage(`Vous devez d'abord rejoindre un salon vocal !`)
            }

            if (!message.client.player.getQueue(message)) return message.errorMessage(`$Je ne joue pas de musique actuellement.`)


            const queue = message.client.player.getQueue(message);
            if (queue.tracks.length < 8) {

                const embed = new Discord.MessageEmbed()

                .setTitle(`Queue du serveur (${queue.tracks.length} sons)`)

                .setColor(message.client.color)

                .addField(`Queue `, queue.tracks.map((track, i) => `**#${i + 1}**  [${track.title}](${track.url})`))
                    .addField('⏸ En cours :', `**${queue.playing.title} **
            `).addField('🔁 Répétition de la queue', `${queue.loopMode ? `Activée`: `Désactivée`}
            `)

       

        message.channel.send(embed)

    }else{
        
        let i0 = 0;
        let i1 = 8;
        let page = 1;
    
        let description = `Queue du serveur (${queue.tracks.length} sons) \n\n`+
        queue.tracks.map((track, i) => `**#${i + 1}**  [${track.title}](${track.url})`).slice(0, 8).join("\n");
    
        const embed = new Discord.MessageEmbed()
        .setColor(message.client.color)
            .setTitle(`Queue du serveur ${page}/${Math.ceil(queue.tracks.length / 8)}`)
            .setDescription(description)
            .addField('⏸ En cours :', `**${queue.playing.title} **
            `).addField('🔁 Répétition de la queue', `${queue.loopMode ? `Activée`: `Désactivée`}
            `)
    
        const msg = await message.channel.send(embed);
            
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
    
                let description = `Queue du serveur (${queue.tracks.length} sons) \n\n`+
                queue.tracks.map((track, i) => `**#${i + 1}**  [${track.title}](${track.url})`).slice(i0, i1).join("\n");
            
                embed.setTitle(`Queue du serveur ${page}/${Math.ceil(queue.tracks.length / 8)}`)
                    .setDescription(description);
    
                msg.edit(embed);
            }
    
            if(reaction.emoji.name === "➡") {
                i0 = i0 + 8;
                i1 = i1 + 8;
                page = page + 1
    
                if(i1 > queue.tracks.length + 8) return;
                if(i0 < 0) return;
    
                let description = `Queue du serveur (${queue.tracks.length} sons) \n\n`+
                queue.tracks.map((track, i) => `**#${i + 1}**  [${track.title}](${track.url})`).slice(i0, i1).join("\n");
    
                embed.setTitle(`Page: ${page}/${Math.ceil(queue.tracks.length / 8)}`)
                    .setDescription(description);
    
                msg.edit(embed);
            }
    
            await reaction.users.remove(message.author.id);
        })
    }













    },
};