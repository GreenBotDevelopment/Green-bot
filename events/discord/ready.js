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
        if (config.database.cached) {
            const { refreshDB } = require("../../util/crons")
            await refreshDB(client, config.database.delay);
        }
        if (config.game) {
            client.user.setActivity(config.game, { type: "WATCHING" });
            setInterval(() => {
                client.user.setActivity(config.game, { type: "WATCHING" });
            }, 60000 * 60);
        } 
    }
};
