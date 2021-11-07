const config = require('../../config.js');
module.exports = {
    async execute(client) {
        console.log('[Bot] Ready');
        if (client.config.topgg) {
            const DBL = require('dblapi.js');
            client.dbl = new DBL(config.topgg, client);
        }
        const activities = [
            { name: config.game, type: 'WATCHING' },
            { name: config.game, type: 'WATCHING' }
        ];
        client.user.setActivity(activities[0].name, { type: 'WATCHING' });
        let activity = 1;
        setInterval(async() => {
            activities[2] = { name: config.game, type: 'WATCHING' };
            activities[3] = { name: config.game, type: 'WATCHING' };
            if (activity > 3) activity = 0;
            client.user.setActivity(activities[activity].name, { type: 'WATCHING' });
            activity++;
        }, 30000);
    }
};