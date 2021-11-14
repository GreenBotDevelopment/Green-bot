const { Message, MessageEmbed, Guild, } = require("discord.js");
const lang = require('../languages/lang.json')
const translate = require("@vitalets/google-translate-api");
const guildData = require('../models/guildData');
/**
 * Add a guild in the database
 * @param {number} guildID The ID of the guild
 */
Guild.prototype.addDB = async function(guildID = {}) {
    if (!guildID || isNaN(guildID)) {
        guildID = this.id
    }
    const data = await new guildData({
        serverID: guildID,
        prefix: "*",
        lang: "en",
        premium: null,
        premiumUserID: null,
        color: "#3A871F",
        backlist: null
    }).save()
    return data
};
/**
 * Fetchs a guild in the database
 * @param {number} guildID The ID of the guild to fetch
 */
Guild.prototype.fetchDB = async function(guildID = {}) {
    if (!guildID || isNaN(guildID)) {
        guildID = this.id
    }
    let data = await guildData.findOne({ serverID: guildID })
    if (!data) data = await this.addDB()
    return data
};
Message.prototype.translate = function(text, guildDB = {}) {
    if (!text || !lang.translations[text]) {
        throw new Error(`Translate: Params error: Unknow text ID or missing text ${text}`)
        return;
    }
    if (!guildDB) return console.log("Missing guildDB")
    return lang.translations[text][guildDB]
};

Guild.prototype.translate = async function(text = {}) {
    if (text) {
        if (!lang.translations[text]) {

            throw new Error(`Unknown text ID "${text}"`)
            return;
        }
    } else {
        throw new Error(`Not text Provided`)
        return;
    }
    const langbd = await guildData.findOne({ serverID: this.id })
    let target;
    if (langbd) {
        target = langbd.lang;
    } else {
        target = 'en';
    }
    return lang.translations[text][target]

};
Guild.prototype.translatee = async function(text, target = {}) {
    if (text) {
        if (!lang.translations[text]) {
            throw new Error(`Unknown text ID "${text}"`)
            return;
        }
    } else {
        throw new Error(`Aucun texte indiqué `)
        return;
    }
    return lang.translations[text][target]
};

Message.prototype.gg = async function(text, args, options = {}) {
    if (!text) {
        this.errorOccurred("No text provided", "en")
        throw new Error(`Aucun texte indiqué `)
    }
    let target = this.guild.lang
    const texttoreturn = await translate(text, { to: target }).then((res) => res.text).catch((error) => text);
    return texttoreturn.replace("show", "channel").replace("living room", "channel").replace("room", "channel");
};

Message.prototype.errorMessage = function(text, cooldown = {}) {
    if (text) {
        return this.channel.send({
            embeds: [{
                description: text,
                color: "#C73829",
                author: { name: this.guild.name, icon_url: this.guild.icon ? this.guild.iconURL({ dynamic: true }) : "https://cdn.discordapp.com/attachments/748897191879245834/782271474450825226/0.png?size=128", url: this.client.config.links.invite },
            }]
        })
    } else {
        this.errorOccurred("No text provided", "en")
        throw new Error(`Error: No text provided`)
    }
};
Message.prototype.succesMessage = function(text, noAutor = {}) {
    if (text) {
        this.channel.send({
            embeds: [{
                description: text,
                color: "#2ED457",
            }]
        })
        return
    } else {
        this.errorOccurred("No text provided", "en")
        throw new Error(`Error: No text provided`)
    }
};
Message.prototype.usage = async function(guildDB, cmd = {}) {
        let langUsage;
        if (cmd.usages) {
            langUsage = await this.translate("USES", guildDB.lang)
        } else {
            langUsage = await this.translate("USES_SING", guildDB.lang)
        }
        const read = await this.translate("READ", guildDB.lang)
        let u = await this.translate("ARGS_REQUIRED", guildDB.lang);
        this.channel.send({
                    embeds: [{
                                description: `${u.replace("{command}",cmd.name)}\n${read}\n\n**${langUsage}**\n${cmd.usages ? `${cmd.usages.map(x=>`\`${guildDB.prefix}${x}\``).join("\n")}` : ` \`${guildDB.prefix}${cmd.name} ${cmd.usage} \``}`,
        color: "#C73829",
        author: { name: this.author.username, icon_url: this.author.displayAvatarURL({ dynamic: !0, size: 512 }), url: this.client.config.links.invite },
    }]})
    };
Message.prototype.mainMessage = function(text, args, options = {}) {
    if (text) {
        let embed1 = new MessageEmbed()
            .setAuthor(this.author.tag, this.author.displayAvatarURL())
            .setDescription(`${text}`)
            .setColor("#3A871F")
            .setFooter(this.client.footer, this.client.user.displayAvatarURL({ dynamic: true, size: 512 }))
            this.channel.send({ embeds: [embed1], allowedMentions: { repliedUser: false } }).then(m=>{
            m.react("<:delete:830790543659368448>")
            const filter = (reaction, user) => reaction.emoji.id === '830790543659368448' && user.id === this.member.id;
            const collector = m.createReactionCollector({ filter, time: 11000, max: 1 });
            collector.on('collect', async r => {
                m.delete()
            });
            collector.on('end', collected => m.reactions.removeAll());
        });
    } else {
        throw new Error(`Error: No text provided`)
    }
};
/**
 * Send an error message in the current channel
 * @param {string} error the code of the error
 */
 Message.prototype.errorOccurred = async function(err,guildDB = {}) {
 console.log("[32m%s[0m", "ERROR", "[0m", `${cmd ? `Command ${cmd.name}` : "System"} has error: \n\n${err}`)
const lang = await this.translate("ERROR",guildDB.lang)
const r = new MessageEmbed()
    .setColor("#F0B02F")
    .setTitle(lang.title)
    .setDescription(lang.desc)
    .setFooter("Error code: " + err + "", this.client.user.displayAvatarURL({ dynamic: !0, size: 512 }));
return this.channel.send({ embeds: [r] })
};