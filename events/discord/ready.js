const config = require('../../config.js');
module.exports = {
    async execute(client) {
        const DBL = require('dblapi.js');
        client.dbl = new DBL(config.topgg.token, client);
        const activities = [
            { name: 'green-bot.app • *help', type: 'WATCHING' }, // 0
            { name: 'Rich quality music', type: 'PLAYING' }, // 1
            { name: 'green-bot.app', type: 'WATCHING' }, // 2
        ];
        let activity = 0; // default activity
        client.user.setActivity(activities[activity].name, {
            type: activities[activity].type
        });
        setInterval(async() => {
            if (activity > activities.length) activity = 0; // Reset activity
            client.user.setActivity(activities[activity].name, {
                type: activities[activity].type
            });
            activity++;
        }, 30000);
        return console.log('[Bot] Bot is ready!');
    },
};
