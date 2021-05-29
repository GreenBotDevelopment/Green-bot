const fetch = require("node-fetch");

const { Util } = require('discord.js');

const emoji = require('../../emojis.json');

module.exports = {
    
    name: 'fakesay',
    description: 'Parle a la place d\'un membre',
    args: true,
    exemple: '@pauldB09 funny ?',
    usage: '<membre> <message>',
    botpermissions: [ 'MANAGE_WEBHOOKS' ],
    cat: 'utilities',
    
    async execute(message, args) {

        let member = message.mentions.members.first() || message.guild.members.cache.get(args[0]) || message.guild.members.cache.filter(m => m.user.tag.includes(args.join(" ")) || m.displayName.includes(args.join(" ")) || m.user.username.includes(args.join(" "))).first()
        
        if (!member) return message.errorMessage("Vous devez mentionner un utilisateur ou fournir un identifiant ( ID ) correcte.");

        let mensagem = args.slice(1).join(' ');
        
        if (!mensagem) return mmessage.errorMessage("Veuillez placer un message après avoir memtionner un membre.");
        
        if (mensagem.includes('@everyone') || mensagem.includes('@here')) return message.errorMessage("Ton message doit faire entre 2 et 32 caractères et ne doit pas contenir de mention !");
    
        message.channel.createWebhook(member.user.username, { 
            
            avatar: member.user.displayAvatarURL({ 
            
                dynamic: true 
            
            }) 
                                                            
        }).then((msgWebhook) => {
            
            msgWebhook.send(Util.removeMentions(mensagem))

            message.delete()

            setTimeout(function() {
                
                msgWebhook.delete()
                
            }, 1000 * 15);
            
        });
        
    }
    
}
