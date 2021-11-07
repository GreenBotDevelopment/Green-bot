const config = require('../../config.js');
module.exports = {
    async execute(client) {
        console.log('[Bot] Ready');
        const DBL = require('dblapi.js');
        client.dbl = new DBL(config.topgg.token, client);
        const activities = [
            { name: 'green-bot.app • *help', type: 'WATCHING' },
            { name: 'green-bot.app • *help', type: 'WATCHING' }
        ];
        client.user.setActivity(activities[0].name, { type: 'WATCHING' });
        let activity = 1;
        setInterval(async() => {
            activities[2] = { name: 'green-bot.app', type: 'WATCHING' };
            activities[3] = { name: 'green-bot.app', type: 'WATCHING' };
            if (activity > 3) activity = 0;
            client.user.setActivity(activities[activity].name, { type: 'WATCHING' });
            activity++;
        }, 30000);
    }
};