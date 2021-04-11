const config = require('../config.json');

module.exports = {

    async execute(client) {
 
        let statuse = config.status.replace(/{server}/g, client.guilds.cache.size).replace(/{users}/g, client.users.cache.size).replace(/{channels}/g, client.channels.cache.size);
        
        client.user.setActivity(statuse);
        
        client.guilds.cache.forEach((guild) => {
            
            guild.fetchInvites().catch(() => {}).then((invites) => {
                
                client.guildInvites.set(guild.id, invites)
                
            });

        });
        
        console.log(`${client.user.tag} a démarré avec succès sur ${client.guilds.cache.size} serveur . J'ai chargé ${client.commands.size} commandes.`);
        
    };
    
};
