const mongoose = require("mongoose"),
    guildData = require("../models/guildData"),
    config = require("../../config"),
    user = require("../models/user"),
    fetch = require("node-fetch");
class MongoDB {
    constructor(e) {
        (this.client = e),
        (this.knowGuilds = []),
        (this.reqs = []),
        (this.premiums = []),
        (this.blacklist = []),
        setInterval(() => {
            this.client.user.setActivity("*help - green-bot.app", {
                type: "WATCHING"
            }), (this.client.shoukaku.cache = []), (this.blacklist = []), this.client.sweepMessages(1800);
        }, 144e5);
    }
    async connect() {
        return (
            mongoose.connect(config.mongo.url, config.mongo.options).catch((e) => {
                console.error("MongoDB:`, `Error\n", e);
            }),
            mongoose
        );
    }
    async checkPremiumUser(e) {
        try {
            if (this.premiums.includes(e)) return !0;
            const s = config.premiumUrl + "premiumUser?userId=" + e,
                t = await fetch(s).catch((e) => console.error(e)),
                r = await t.json();
            return this.premiums.push(e), !!r;
        } catch (e) {
            return !1;
        }
    }
    searchReq(e) {
        let s = e.guild.id,
            t = !1;
        if (
            (this.blacklist.find((e) => e.id === s) &&
                (e.guild.leave(),
                    e.errorMessage(
                        "Your server has been banned from using Green-bot for breaking our [Terms of Service](https://green-bot.app/terms) \nYou can appeal this choice on [Green-bot's server](https://discord.gg/greenbot). You have been warned."
                    )),
                this.reqs.find((e) => e.id === s))
        ) {
            let r = this.reqs.find((e) => e.id === s),
                i = this.reqs.findIndex((e) => e.id === s);
            r.timeout ||
                (this.reqs[i].timeout = setTimeout(() => {
                    (this.reqs = this.reqs.filter((e) => e.id !== s)), this.blacklist.find((e) => e.id === s) && (this.blacklist = this.blacklist.filter((e) => e.id !== s));
                }, 6e4)),
                (this.reqs[i].requests = r.requests + 1);
            let n = r.requests + 1;
            n > 26 &&
                ((t = !0),
                    this.blacklist.push({
                        id: s,
                        warns: 1
                    }),
                    e.errorMessage(
                        "Your server has been rate-limited because you are spamming commands (" +
                        n +
                        " commands in 1m).\nSpamming the bot is not allowed by our [Terms of Service](https://green-bot.app/terms)\n **Don't use the bot for 1m or it will leave your server**"
                    ));
        } else {
            let e = setTimeout(() => {
                (this.reqs = this.reqs.filter((e) => e.id !== s)), this.blacklist.find((e) => e.id === s) && (this.blacklist = this.blacklist.filter((e) => e.id !== s));
            }, 6e4);
            this.reqs.push({
                id: s,
                timeout: e,
                requests: 1
            });
        }
        return t;
    }
    async handleCache(e) {
        return (this.knowGuilds[e.serverId] = e), e.save(), e;
    }
    async getServer(e) {
        if (this.knowGuilds.includes(e)) return this.knowGuilds[e];
        let s = await guildData.findOne({
            serverID: e
        });
        return s ? (this.knowGuilds[e] = s) : (s = await new guildData({
            serverID: e,
            prefix: "*",
            lang: "en",
            color: "#3A871F"
        }).save()), s;
    }
    async getUser(e, s) {
        let t = await user.findOne({
            userID: e
        });
        return t || (t = await new user({
            userID: e,
            playlists: [],
            songs: []
        }).save()), t;
    }
    async suppr(e, s) {
        await guildData.findOneAndDelete({
            serverID: e
        });
    }
    async checkPremium(e, s) {
        if (s && (await this.checkPremiumUser(s))) return !0;
        try {
            const s = config.premiumUrl + "premiumGuild?guildId=" + e,
                t = await fetch(s).catch((e) => console.error(e));
            return await t.json();
        } catch (e) {
            return !1;
        }
    }
}
module.exports = MongoDB;