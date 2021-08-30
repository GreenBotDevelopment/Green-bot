const config = require("../../config.js");
module.exports = {
    async execute(client) {
        console.log("[Bot] Ready")
        const crons = require("../../util/crons")
        crons.handleReminds(client)
        crons.checkBirthdays(client)
        crons.checkYoutubeVideos(client)
        setInterval(async() => {
            await crons.checkYoutubeVideos(client)
        }, 6e4);

        null === (await client.db.get("giveaways")) && (await client.db.set("giveaways", []));
        if (config.database.cached) {
            const { refreshDB } = require("../../util/crons")
            await refreshDB(client, config.database.delay);
        }
        if (config.game) {
            client.user.setActivity(config.game, { type: "WATCHING" });
            setInterval(() => {
                client.user.setActivity(config.game, { type: "WATCHING" });
            }, 60000 * 60);
        } else {
            const activities = [
                { name: '*help • green-bot.app', type: 'WATCHING' },
                { name: '*help • green-bot.app', type: 'WATCHING' }
            ]
            client.user.setActivity(activities[0].name, { type: "WATCHING" });
            let activity = 1;
            setInterval(async() => {
                activities[2] = { name: `green-bot.app`, type: 'WATCHING' };
                activities[3] = { name: `green-bot.app`, type: 'WATCHING' };
                if (activity > 3) activity = 0;
                client.user.setActivity(activities[activity].name, { type: "WATCHING" });
                activity++;
            }, 30000);
        }

    }
};