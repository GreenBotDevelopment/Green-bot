const config = require('../../config.js');
module.exports = {
    async execute(client) {
        const DBL = require('dblapi.js');
        client.dbl = new DBL(config.topgg.token, client);
        return console.log('[Bot] Bot is ready!');
    },
};
