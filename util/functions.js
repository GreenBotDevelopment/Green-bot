/**
 * Returns a list of the commands in html. For a website, top.gg page etc
 * @param {object} client The discord client instance
 */
const printCmd = async message => {
    let txt = '';
    let a = message.client.commands.filter(c => c.cat !== "owner")
    const descriptions = new Map()
    a.forEach(async command => {
        const desc = await message.gg(command.description)
        const infos = {
            aliases: command.aliases,
            desc: desc,
            usage: command.usage ? command.usage : "",
            name: command.name
        }
        descriptions.set(command.name, infos)

        txt = txt + `    
                <br> <tr>
                <td>${infos.name}</td>
                <td>${message.client.defaultPrefix}${infos.name} ${infos.usage}</td>
                <td>${infos.desc}</td>
                </tr>`
        message.client.wait(2000)
    });
    message.client.wait(20000).then(() => {
        console.log("Here is your command list:\n")
        console.log(txt)
    })
};
/**
 * Returns an object of the guilds
 * @param {object} client The discord client instance
 */
const getServersList = async client => {
    const results = await client.shard.broadcastEval((c) => {
        return c.guilds.cache.array();
    });
    let guilds = [];
    results.forEach((a) => guilds = [...guilds, ...a]);
    return guilds
};
/**
 * Create the client variables
 * @param {object} client The discord client instance
 */
const createClientVars = async client => {
    const config = require("../config")
    client.color = config.color.startsWith("#") ? config.color : "#3A871F"
    client.owner = {
        name: config.ownerName,
        id: config.ownerID
    }
    client.footer = config.footer.slice(0, 32)
    client.defaultPrefix = config.prefix.slice(0, 4)
    client.defaultLanguage = config.defaultLanguage
    client.log = config.logAll
    client.devMode = {
        enabled: config.devMode,
        serverID: config.devServer
    }
    client.categories = config.categories
    client.links = config.links
};
/**
 * Fetch a category with a text
 * @param {args} args The text
 */
const resolveCategory = async function(args, client = {}) {
    if (client.log) console.log("[..] resolving category " + args + "")
    const found = client.categories[`${args.toLowerCase()}`]
    if (found) {
        if (client.log) console.log("[..] Category found " + found.name + "")
    }
    return found
};
/**
 * Check the configuration
 * @param {object} config The config.json file
 */
const checkConfig = async config => {
    if (!config) return console.error('✗ The provided config is not an object.');
    if (config.logAll) console.log("Starting the verification of the configuration")
    let error;
    if (process.version.slice(1).split('.')[0] < 12) {
        console.error('✗ NodeJs 12 or higher is required.');
        error = true;
    }
    if (!config.ownerID || config.ownerID.length !== 18) {
        console.error('✗ The ownerID is missing or is not a real Discord ID.');
        error = true;
    }
    if (!config.footer) {
        console.error('✗ Please provide a footer.');
        error = true;
    }
    if (!config.color) {
        console.error('✗ Please provide the embeds color.');
        error = true;
    } else {
        var hexColorRegex = require('hex-color-regex');

        function hexColorCheck(a) {
            var check = hexColorRegex().test(a);
            var checkVerify = false;
            if (check == true) {
                checkVerify = true;
            }
            return checkVerify;
        }
        let color = config.color;
        var checkColor = hexColorCheck(color);
        if (checkColor == true) {} else {
            console.error('✗ Your color is invalid. You must chose one of these colors: https://htmlcolorcodes.com/');
            error = true;
        }
    }
    if (!config.defaultLanguage || (config.defaultLanguage.toLowerCase() !== "fr" && config.defaultLanguage.toLowerCase() !== "en")) {
        console.error('✗ The defaultLanguage parameter is missing or is not supported. Langages: fr, en');
        error = true;
    }
    if (!config.devMode || typeof config.devMode !== Boolean) {
        console.error('✗ The devMode parameter is missing or is not a bolean value');
        error = true;
    }
    if (!config.devServer || config.devServer.length !== 18) {
        if (!config.devMode) {
            console.error('✗ The devServer parameter is missing or is not a valid discord ID');
            error = true;
        }
    }
    if (!config.logAll || typeof config.logAll !== Boolean) {
        console.error('✗ The logAll parameter is missing or is not a bolean value');
        error = true;
    }
    if (!config.prefix || prefix.length > 4) {
        console.error('✗ Your prefix is missing or is too long. Max length is 4');
        error = true;
    }
    if (!config.database) {
        console.error('✗ Your config.js file looks broken. Please reinstall it');
        error = true;
    } else {
        if (!config.database.cached || typeof config.database.cached !== Boolean) {
            console.error('✗ The database.cache parameter is missing or is not a bolean value');
            error = true;
        } else {
            if (!config.database.delay || isNaN(config.database.delay)) {
                console.error('✗ The database.delay parameter is missing or is not a number');
                error = true;
            }
        }
    }
    if (!config.token) {
        console.error('✗ Please provide a discord bot token.get it at https://discord.com/developpers/bots');
        error = true;
    } else {
        const Discord = require('discord.js');
        const client = new Discord.Client({
            partials: ["MESSAGE"],
            intents: ["GUILDS"],
        });
        await client.login(config.token).catch(e => {
            console.error("✗ Your token is invalid" + e + "")
            error = true;
        });
    }
    if (!config.database.MongoURL) {
        console.error('✗ Please provide the url of your mongodb database.Your can get it at https://mongodb.org');
        error = true;
    } else {
        const mongoose = require('mongoose');
        await mongoose.connect(config.database.MongoURL, { useUnifiedTopology: true, useNewUrlParser: true }).catch(() => {
            console.error('✗ Your mongodb url isn\'t correct');
            error = true;
        });
    }
    if (error) {
        console.log("Your config verification has failed. Please fix errors and try again\n\nIf you need more help, join our support server here: https://green-bot.app/discord")
        process.exit(0);

    } else {
        if (config.logAll) console.log("Your config is correct. Good game 🥳")

    }
    return error;

};
module.exports = { printCmd, getServersList, checkConfig, createClientVars, resolveCategory }