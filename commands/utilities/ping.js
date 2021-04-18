const Discord = require('discord.js');
const math = require('mathjs');

module.exports = {
    name: 'ping',
    description: 'Renvoie la latence du bot',
    cat: 'util',
    async execute(message, client) {


        message.channel.send("Ping ?").then(async(m) => {

            await m.edit(`🏓 Pong! réponse en ${Date.now() - m.createdTimestamp}ms. perte de ${Math.round(message.client.ws.ping)}ms`);
        });





    },
};