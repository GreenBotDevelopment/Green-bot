const Discord = require("discord.js");
/**
 * Handle the guilds config
 * @param {object} client The discord client instance
 * @param {number} time The delay to refresh the database
 */
const refreshDB = async function(client, time = {}) {
    setInterval(async() => {
        const results = await client.shard.broadcastEval((c) => {
            return c.guilds.cache.array();
        });
        let guilds = [];
        results.forEach((a) => guilds = [...guilds, ...a]);
        console.log("Refreshing " + guilds.length + "")
        guilds.forEach(async g => {
            await g.fetchDB()
        });
    }, time);
};
/**
 *Check the last youtube videos
 * @param {object} client The discord client instance
 * @param {number} time The delay to check
 */
const checkYoutubeVideos = async function(client, time = {}) {
    const Parser = require("rss-parser");
    const parser = new Parser();
    const Youtube = require("simple-youtube-api");
    const youtube = new Youtube("AIzaSyAJCbATtXzmw6XIHcWfItereCyuziEmenk");
    const youtubeDB = require("../database/models/youtube");
    const startAt = Date.now();
    const lastVideos = {}

    function formatDate(e) {
        let t = e.getDate(),
            n = e.getMonth(),
            a = e.getFullYear();
        return `${t} ${["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"][parseInt(n, 10)]} ${a}`;
    }
    async function getLastVideo(e, t) {
        return (await parser.parseURL(t)).items.sort((e, t) => {
            let n = new Date(e.pubDate || 0).getTime();
            return new Date(t.pubDate || 0).getTime() - n;
        })[0];
    }
    async function checkVideos(e, t) {
        let n = await getLastVideo(e, t);
        if (n && !(new Date(n.pubDate).getTime() < startAt)) return n;
    }
    async function check() {
        if (null === client.dbTemps.fetch("postedVideos")) client.dbTemps.set("postedVideos", []);
        let e = await youtubeDB.find({});
        if (0 === e.length) return console.log("Nothing to check");
        e.forEach(async(infos) => {

            let n = await checkVideos(e.youtuberID, "https://www.youtube.com/feeds/videos.xml?channel_id=" + infos.youtuberID);
            if (!n) return;
            if (client.dbTemps.fetch("postedVideos").includes(n.id)) return;

            const o = `${infos.message}`
                .replace("{VideoURL}", n.link)
                .replace("{YoutuberName}", n.author)
                .replace("{videoName}", n.title)
                .replace("{videoPubDate}", formatDate(new Date(n.pubDate)));
            const channel = client.channels.cache.get(infos.channelID);
            if (channel) {
                channel.send({ content: o });
                client.dbTemps.push("postedVideos", n.id);
                if (client.log) console.log("Notification sent !")
            }
        });
    }
    return check()
};
/**
 * Check the reminders
 * @param {object} client The discord client instance
 */
const handleReminds = async function(client = {}) {
    const TEN_SECOND_INTERVAL = 10000;
    setInterval(async() => {
        const Rmd = require("../database/models/remind")
        const reminders = await Rmd.find({});
        if (!reminders || reminders.length == 0) return;
        reminders.forEach(async rem => {
            if (rem.ends_at <= Date.now()) {
                let x = await client.users.fetch(rem.userID)
                const usr = client.users.cache.get(rem.userID) || x;
                if (!usr) return;
                if (rem.lang === "en") {
                    const warnEmbed = new Discord.MessageEmbed()
                        .setAuthor(usr.tag, usr.displayAvatarURL())
                        .setColor("#F0B02F")
                        .setFooter(`${client.footer}`, client.user.displayAvatarURL({ dynamic: true, size: 512 }))
                        .setDescription(`Your reminder for \`${rem.reason}\` is ended.`)
                        .setTitle("Reminder ended")
                    usr.send({ embeds: [warnEmbed] })
                    let del = await Rmd.findOneAndDelete({ _id: rem._id })
                } else {
                    const warnEmbed = new Discord.MessageEmbed()
                        .setAuthor(usr.tag, usr.displayAvatarURL())
                        .setColor("#F0B02F")
                        .setFooter(`${client.footer}`, client.user.displayAvatarURL({ dynamic: true, size: 512 }))
                        .setDescription(`Votre rappel pour \`${rem.reason}\` vient de se terminer.`)
                        .setTitle("Rappel")
                    usr.send({ embeds: [warnEmbed] })
                    let del = await Rmd.findOneAndDelete({ _id: rem._id })
                }

            }

        });
    }, TEN_SECOND_INTERVAL);
};
/**
 * Check the birthdays
 * @param {object} client The discord client instance
 */
const checkBirthdays = async function(client = {}) {
    require("node-cron").schedule("0 */24 * * *", async() => {
        const e = new Date();
        let t = client.channels.cache.get("812577667462201345");
        const n = moment(e).locale("fr").format("Do MMMM");
        const birthdays = require("../database/models/birthday")
        let a = await birthdays.find({});
        t.send({ embeds: [new Discord.MessageEmbed().setColor(client.color).setDescription(` <a:green_loading:824308769713815612> ** Je commence à vérifier les anniversaires dans la bdd pour le ${n} ** `)] });
        let o = await Welcome.find({ reason: "birthday" });
        if (0 === o.length) return console.log("No server on");
        a.forEach(async(e) => {
            const a = client.users.cache.get(e.userID);
            if (moment(e.Date).locale("fr").format("Do MMMM") === n) {
                t.send({ embeds: [new Discord.MessageEmbed().setColor(client.color).setDescription(` **C'est l' anniversaire de <@${e.userID}> ** `)] })
                o.forEach(async(t) => {
                    let n = client.guilds.cache.get(t.serverID);
                    if (!n) return console.log("Banned");
                    if ((n.memberCount !== n.members.cache.size && (await n.members.fetch()), n.members.cache.get(e.userID))) {
                        let a = n.channels.cache.get(t.channelID),
                            o = ` ${t.message}`
                            .replace(/{user}/g, n.members.cache.get(e.userID))
                            .replace(/{server}/g, n.name)
                            .replace(/{username}/g, n.members.cache.get(e.userID).user.username)
                            .replace(/{tag}/g, n.members.cache.get(e.userID).user.tag)
                            .replace(/{membercount}/g, n.memberCount);
                        if (a) a.send({ content: ` <@&${t.image}>`, embeds: [new Discord.MessageEmbed().setColor(config.color).setDescription(o)] });
                    }
                });
                let n = new Discord.MessageEmbed()
                    .setColor("#F0B02F")
                    .setTitle(" <:nitro_gris_activ:830451169486700585> Happy birthday !!")
                    .setDescription(`Bonjour <@${e.userID}> , je vous souhaite un magnifique anniversaire, prenez soin de vous!!!`)
                    .addField("> Dashboard", " [Clique ici](https://green-bot.app/)", !0)
                    .addField("> Support", "[Clique Ici](https://green-bot.app/discord)", !0)
                    .addField("> Inviter", "[Clique ici](https://discord.com/oauth2/authorize?client_id=783708073390112830&scope=bot&permissions=8)", !0)
                    .setFooter("Désactivez ce message avec la commande *birthday disable");
                a && a.send({ embeds: [n] });

            }
        });
    });
};
module.exports = { handleReminds, checkBirthdays, refreshDB, checkYoutubeVideos }