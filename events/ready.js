const config = require('../config.json');
module.exports = {


    async execute(client) {
        const { commands } = client;
        console.log(`${client.user.tag} a démarré avec succès sur ${client.guilds.cache.size} serveurs . J'ai chargé ${commands.size} commandes.`);
        client.guilds.cache.forEach(guild => {
            guild.fetchInvites().catch(() => {})
                .then(invites => client.guildInvites.set(guild.id, invites))

        });
    }
};