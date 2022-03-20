const config = require('../../config.js');
module.exports = {
    async execute(client) {
        const DBL = require('dblapi.js');
        client.dbl = new DBL(config.topgg.token, client);
        const activities = [
            { name: 'green-bot.app • *help', type: 'WATCHING' }, // 0
            { name: 'green-bot.app • *help', type: 'WATCHING' }, // 1
            { name: 'green-bot.app', type: 'WATCHING' }, // 2
        ];
        client.user.setActivity(activities[0].name, {
            type: activities[0].type
        });
        let activity = 0;
        setInterval(async() => {
            if (activity >= 2) activity = 0;
            client.user.setActivity(activities[activity].name, {
                type: activities[activity].type
            });
            activity++;
        }, 30000);
        console.log('[Bot] Bot is ready!');
    },
};
