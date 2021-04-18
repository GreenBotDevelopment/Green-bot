const config = require('../config.json');
const guild = require('../database/models/guild');

module.exports = {


    async execute(client) {
        const { commands } = client;
        client.user.setActivity(`green help | green-bot.xyz `, { type: 'PLAYING' });
        console.log(`${client.user.tag} a démarré avec succès sur ${client.guilds.cache.size} serveurs . J'ai chargé ${commands.size} commandes.`);
        client.guilds.cache.forEach(guild => {
            guild.fetchInvites().catch(() => {})
                .then(invites => client.guildInvites.set(guild.id, invites))

        });
    }
};