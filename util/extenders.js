const { Message, MessageEmbed, Channel, Guild, Util } = require("discord.js");
const lang = require('../languages/lang.json')
const translate = require("@vitalets/google-translate-api");
const guildData = require('../database/models/guildData');
const Case = require("../database/models/case")
const Warn = require("../database/models/warn")
const Welcome = require("../database/models/Welcome");
const config = require("../config")
    /**
     * Create an uniq ID
     * @param {string} Charlength The size of the uniq ID
     */
const uniqID = async function(Charlength = {}) {
    if (!Charlength) {
        if (!lang.translations[text]) {
            throw new Error(`Missing args [Charlength]`)
            return;
        }
    }
    var chars = "ABCDEFGHIJKLMNOPQRSTUVWXTZabcdefghiklmnopqrstuvwxyz";
    var string_length = Charlength;
    var randomstring = '';
    for (var x = 0; x < string_length; x++) {
        var letterOrNumber = Math.floor(Math.random() * 2);
        if (letterOrNumber == 0) {
            var newNum = Math.floor(Math.random() * 9);
            randomstring += newNum;
        } else {
            var rnum = Math.floor(Math.random() * chars.length);
            randomstring += chars.substring(rnum, rnum + 1);
        }
    }
    return randomstring
};

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
        prefix: config.prefix,
        lang: "en",
        premium: null,
        premiumUserID: null,
        color: config.color,
        backlist: null
    }).save()
    this.settings = data
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
    if (this.settings && this.settings !== data) this.settings = data
    if (!this.settings) this.settings = data;
    return data
};
/**
 * Update the guild settings in the database
 * @param {number} guildID The ID of the guild
 * @param {object} data The data to update
 */
Guild.prototype.updateDB = async function(guildID, data = {}) {
    if (!this.settings) this.settings = await this.fetchDB()
    const config = this.settings
    if (typeof data !== 'object') throw new Error("Error: Data parameter must be an object")
    if (typeof config !== 'object') config = {};
    for (const key in data) {
        if (config[key] !== data[key]) config[key] = data[key];
    }
    await config.updateOne(data)
};
Message.prototype.translate = async function(text, client = {}) {
    if (!text || !lang.translations[text]) {
        throw new Error(`Translate: Params error: Unknow text ID or missing text`)
        return;
    }
    let target = this.guild.settings.lang
    return lang.translations[text][target]
};
Guild.prototype.translate = async function(text = {}) {
    if (text) {
        if (!lang.translations[text]) {
            this.errorOccurred("No text provided")
            throw new Error(`Unknown text ID "${text}"`)
            return;
        }
    } else {
        throw new Error(`Aucun texte indiqué `)
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
/**
 * Create an uniq ID
 * @param {number} Charlength The size of the uniq ID
 */
Message.prototype.uniqID = async function(Charlength = {}) {
    if (!Charlength || isNaN(Charlength)) {
        throw new Error(`Error args [Charlength]`)
        return;
    }
    var chars = "ABCDEFGHIJKLMNOPQRSTUVWXTZabcdefghiklmnopqrstuvwxyz";
    var string_length = Charlength;
    var randomstring = '';
    for (var x = 0; x < string_length; x++) {
        var letterOrNumber = Math.floor(Math.random() * 2);
        if (letterOrNumber == 0) {
            var newNum = Math.floor(Math.random() * 9);
            randomstring += newNum;
        } else {
            var rnum = Math.floor(Math.random() * chars.length);
            randomstring += chars.substring(rnum, rnum + 1);
        }
    }
    return randomstring
};

/**
 * Create a warn in the datatase
 * @param {string} member The member to punish
 * @param {object} reason The reason
 * @param {string} mod The id of the moderator
 * @param {boolean} asCase If you want to save a case in the database
 * @param {boolean} logMod If you want to send a log message in the mod logs channel
 */
Guild.prototype.CreateWarn = async function(member, reason, mod, asCase, logMod, client, ID = {}) {
    if (!reason || !member || !mod) {
        throw new Error(`Missing args`)
    }
    if (!ID) {
        ID = await uniqID(10)
    }
    const saveWarn = new Warn({
        serverID: `${this.id}`,
        manID: `${member.id}`,
        reason: `${reason.length > 100 ? reason.slice(0,100) + "..." : reason}`,
        date: new Date,
        moderator: `${mod.id}`
    }).save()
    if (asCase) {
        const saveCase = new Case({
            serverID: this.id,
            id: ID,
            targetID: member.id,
            sanction: "Warn",
            reason: reason.length > 100 ? reason.slice(0, 100) + "..." : reason,
            mod: mod.id,
        }).save()
    }
    if (logMod) {
        const logs = await Welcome.findOne({ serverID: this.id, reason: `mod-logs` })
        if (logs) {
            if (this.channels.cache.get(logs.channelID)) {
                const translations = await this.translate("LOGS_MOD")
                const embed = new MessageEmbed()
                    .setColor(this.settings.color)
                    .setAuthor(`${member.user.username}`, member.user.displayAvatarURL({ dynamic: true, size: 512 }))
                    .setTitle(translations.title.replace("{id}", ID))
                    .setDescription(translations.desc.replace("{user}", mod.user.tag).replace("{member}", member.user.tag))
                    .addField("<:membres:830432144211705916> " + translations.mod + "", `\`${mod.user.tag}\` \n(<@!${mod.id}>)`, true)
                    .addField("<:663041911753277442:830432143800532993> Type", "Warn", true)
                    .addField("<:green_members:811167997023485973> " + translations.target + "", `\`${member.user.tag}\` \n(<@!${member.id}>)`, true)
                    .addField("<:711541810098470913:830460210220630027> Case ID", `${ID}`, true)
                    .addField("<:612058498108227586:830440548007018517> " + translations.reason + "", `${reason.length > 110 ? reason.slice(0,110) + "..." : reason}`, true)

                .setThumbnail(url = client.user.displayAvatarURL({ dynamic: true, size: 512 }))
                    .setFooter(client.footer, client.user.displayAvatarURL({ dynamic: true, size: 512 }))
                this.channels.cache.get(logs.channelID).send({ embeds: [embed] }).catch(err => {
                    console.log(err)
                    throw new Error(`[MODLOGS:134] Something went wrong? check permissions pls: ${err}`)
                })
            }
        }
    }
    return true
};
/**
 * Warns a user in private messages
 * @param {object} member The user to warn. A member object is required
 * @param {string} reason the reason to warn the user
 * @param {boolean} toEmbed If you want to send an embed
 */
Message.prototype.warnDM = async function(member, reason, toEmbed = {}) {
    const lang = await this.translate("WARN")
    const formatedMessage = lang.dm.replace("{reason}", reason).replace("{message.guild.name}", this.guild.name).replace("{member.user.tag}", member.user.tag)
    if (toEmbed) {
        const embed = new MessageEmbed()
            .setDescription(`${formatedMessage}`)
            .setColor("#F0B02F")
        member.send({ embeds: [embed] }).catch(err => {
            if (this.client.log) console.log("[WarnDM] I can't dm " + member.user.tag + ".")
        })
    } else member.send(formatedMessage).catch(err => {
        if (this.client.log) console.log("[WarnDM] I can't dm " + member.user.tag + ".")
    })
    return true
};

Message.prototype.gg = async function(text, args, options = {}) {
    if (!text) {
        this.errorOccurred("No text provided")
        throw new Error(`Aucun texte indiqué `)
    }
    let target = this.guild.settings.lang
    const texttoreturn = await translate(text, { to: target }).then((res) => res.text).catch((error) => text);
    return texttoreturn.replace("show", "channel").replace("living room", "channel").replace("room", "channel");
};

Message.prototype.errorMessage = async function(text, args, options = {}) {
        if (text) {
            this.reply({ content: `${Util.removeMentions(`\`❌\` ${text}`)}`, allowedMentions: { repliedUser: false } })
        } else {
            this.errorOccurred ("No text provided")
            throw new Error(`Error: No text provided`)
        }
   
};
Message.prototype.getMember = async function(args, sameGuild = {}) {
        let member
        if (this.mentions.members.first() && this.mentions.members.first().guild.id === this.guild.id) {
            member = this.mentions.members.first()
        } else if (this.guild.members.cache.get(args[0]) && this.guild.members.cache.get(args[0]).guild.id === this.guild.id) {
            member = this.guild.members.cache.get(args[0])
        } else {
            let a = args.join(" ")
            const results = this.guild.members.cache.filter(m => m.user.tag.toLowerCase().includes(a.toLowerCase()) || m.displayName.toLowerCase().includes(a.toLowerCase()) || m.user.username.toLowerCase().includes(a.toLowerCase()))
            if (results.size == 0) {
                let err = await this.translate("ERROR_USER")
                return this.errorMessage(err)
            } else {
                if (results.size == 1) {
                    member = results[0]
                } else {
                    const lange = await this.translate("CHOICE_USER")
                    let can = await this.translate("CAN_CANCEL")
                    const msg = await this.channel.send(Util.removeMentions(`${lange.multiple}\n${results.map((r) => r).map((r, i) => `**• ${i + 1}** \`${r.user.tag}\`\n${can} `).join("\n")}`))
                    const ID = this.author.id
                    const filter = m => m.author.id === ID ;
                    await this.channel.awaitMessages({ filter, max: 2, time: 11000 }).then(async(collected) => {
                        if (collected.first().content === "cancel") {
                            let okk = await this.translate("CANCELED")
                            return msg.edit(`**${okk}**`)
                        }
                        const content = collected.first().content
                        if (isNaN(content) || content < 1 || content > results.size|| content.includes('-') || content.includes('+') || content.includes(',') ||content.includes('.')) {
                            let numberErr = await this.translate("NUMBER_ERROR")
                            return this.errorMessage(numberErr.replace("{amount}", "1").replace("{range}", results.size))
                        }else{
                           const number = parseInt(content)
                           let choice = results[number - 1]
                           member = choice
                           msg.delete()
                           collected.first().delete()
                        }
                    }).catch(async() => {
                        let okk = await this.translate("CANCELED")
                        return msg.edit(`**${okk}**`)
                    });
            }
        }
    }
    return member;
};
Message.prototype.getRole = async function(args, sameGuild = {}) {
    let member
    if (this.mentions.roles.first() && this.mentions.roles.first().guild.id === this.guild.id) {
        member = this.mentions.roles.first()
    } else if (this.guild.roles.cache.get(args[0]) && this.guild.roles.cache.get(args[0]).guild.id === this.guild.id) {
        member = this.guild.roles.cache.get(args[0])
    } else {
        let a = args.join(" ")
        const results = this.guild.roles.cache.filter(m => m.name.toLowerCase().includes(a.toLowerCase()))
        if (!results || !results[0] || results.size == 0) {
            let err = await this.translate("ERROR_ROLE")
            return this.errorMessage(err)
        } else {
            if (results.size > 1) {
                const lange = await this.translate("CHOICE_ROLE")
                let can = await this.translate("CAN_CANCEL")
                const msg = await this.channel.send(Util.removeMentions(`${lange.multiple}\n${results.map((r) => r).map((r, i) => `**• ${i + 1}** ${r.name}`).join("\n")}\n${can} `))
                const ID = this.author.id
                const filter = m => m.author.id === ID ;
                await this.channel.awaitMessages({ filter, max: 1, time: 11000 }).then(async(collected) => {
                    if (collected.first().content === "cancel") {
                        let okk = await this.translate("CANCELED")
                        return msg.edit(`**${okk}**`)
                    }
                    const content = collected.first().content
                    if (isNaN(content) || content < 1 || content > results.size|| content.includes('-') || content.includes('+') || content.includes(',') ||content.includes('.')) {
                        let numberErr = await this.translate("NUMBER_ERROR")
                        return this.errorMessage(numberErr.replace("{amount}", "1").replace("{range}", results.size))
                    }else{
                       const number = parseInt(content) - 1
                       const choice = results[number]
                       console.log(choice)
                       console.log(number)
                       member = choice
                       msg.delete()
                       collected.first().delete()

                    }
                }).catch(async() => {
                    let okk = await this.translate("CANCELED")
                    return msg.edit(`**${okk}**`)
                });
            } else {
                member = results[0]
        }
    }
}
console.log(member)
return member;
};
Channel.prototype.mainMessage = async function(text, color = {}) {
    if (text) {
        let embed = new MessageEmbed()
            .setAuthor(this.guild.name, this.guild.iconURL())
            .setDescription(`${text}`)
            .setColor(color)
            .setFooter(this.client.footer, this.client.user.displayAvatarURL({ dynamic: true, size: 512 }))
        this.send({ embeds: [embed] })
    } else {
        throw new Error(`Aucun texte indiqu `)
    }
};
Message.prototype.succesMessage = async function(text, args, options = {}) {

        if (text) {
       this.reply({ content: `${Util.removeMentions(`\`✅\` ${text}`)}`, allowedMentions: { repliedUser: false } })
               
        } else {
            this.errorOccurred ("No text provided")
            throw new Error(`Error: No text provided`)
        }
    };
Message.prototype.mainMessage = async function(text, args, options = {}) {
    if (text) {
        let embed1 = new MessageEmbed()
            .setAuthor(this.author.tag, this.author.displayAvatarURL())
            .setDescription(`${text}`)
            .setColor(this.guild.settings.color)
            .setFooter(this.client.footer, this.client.user.displayAvatarURL({ dynamic: true, size: 512 }))
            this.reply({ embeds: [embed1], allowedMentions: { repliedUser: false } }).then(m=>{
            m.react("🗑")
            const filter = (reaction, user) => reaction.emoji.name === "🗑" && user.id === this.member.id;
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
Message.prototype.mainMessageT = async function(text, args, options = {}) {
    if (text) {
        let embed1 = new MessageEmbed()
            .setAuthor(this.author.tag, this.author.displayAvatarURL())
            .setDescription(`${text}`)
            .setColor(this.guild.settings.color)
            .setFooter(this.client.footer, this.client.user.displayAvatarURL({ dynamic: true, size: 512 }))
        this.channel.send({ embeds: [embed1] })
            .then((m) => {
                m.react("🗑")
                const filter = (reaction, user) => reaction.emoji.name === "🗑" && user.id === this.member.id;
                const collector = m.createReactionCollector({ filter, time: 110000, max: 1 });
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
 Message.prototype.errorOccurred = async function(err = {}) {
    if (this.client.log) console.log("[32m%s[0m", "ERROR", "[0m", `${this.command ? `Command ${this.command.name}` : "System"} has error: \n\n${err}`)
const lang = await this.translate("ERROR")
const r = new MessageEmbed()
    .setColor("#F0B02F")
    .setTitle(lang.title)
    .setDescription(lang.desc)
    .setFooter("Error code: " + err + "", this.client.user.displayAvatarURL({ dynamic: !0, size: 512 }));
return this.channel.send({ embeds: [r] })
};

Message.prototype.sendT = async function(text, args, options = {}) {
    if (text) {
        this.channel.send(text.replace(/@(everyone)/gi, "everyone").replace(/@(here)/gi, "here"))
    } else {
        throw new Error(`Error: No text provided`)
    }
};
