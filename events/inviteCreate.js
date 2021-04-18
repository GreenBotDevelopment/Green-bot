module.exports = {


    async execute(invite, client) {

        client.guildInvites.set(invite.guild.id, await invite.guild.fetchInvites());

    }
};