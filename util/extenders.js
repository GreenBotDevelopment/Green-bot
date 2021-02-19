const { Message, MessageEmbed, Channel } = require("discord.js");
const lang = require('./lang.json')
const guild = require('../database/models/guild');
const emoji = require('../emojis.json')
const config = require('../config.json')

const translate = require("@vitalets/google-translate-api");
Message.prototype.translate = async function(text, args, options = {}) {
    if (!text) {
        throw new Error(`Aucun texte indiqu `)
        return;
    }
    const langbd = await guild.findOne({
        serverID: this.guild.id,
        reason: 'lang',
    })
    let target;
    if (langbd) {
        target = langbd.content;
    } else {
        target = 'fr';
    }
    const texttoreturn = await translate(text, { to: target }).then((res) => res.text).catch((error) => text);

    return texttoreturn;
};

Message.prototype.error = async function(text, args, options = {}) {
    if (text) {
        if (!lang.translations[text]) {
            throw new Error(`Unknown text ID "${text}"`)
            return;
        }
    } else {
        throw new Error(`Aucun texte indiqu `)
        return;
    }
    const langbd = await guild.findOne({
        serverID: this.guild.id,
        reason: 'lang',
    })
    let target;
    if (langbd) {
        target = langbd.content;
    } else {
        target = 'fr';
    }
    return this.channel.send(`${emoji.error} ${lang.translations[text][target]}`)
};


Message.prototype.errorMessage = async function(text, args, options = {}) {
    if (text) {
        const langbd = await guild.findOne({
            serverID: this.guild.id,
            reason: 'lang',
        })
        let target;
        if (langbd) {
            target = langbd.content;
        } else {
            target = 'fr';
        }

        translate(text, { to: target }).then(res => {
            let finaltxt = `${res.text}`
                .replace('<@ ', '<@')
                .replace('<# ', '<@')
                .replace('[ ', '[')
                .replace('] ', ']')
                .replace(': ', ':')
            let embed = new MessageEmbed()
                .setAuthor(this.author.tag, this.author.displayAvatarURL())
                .setDescription(`${emoji.error} - ${finaltxt}`)
                .setColor('#982318')
                .setFooter(this.client.footer);
            this.channel.send(embed)
        }).catch(error => {


        });



    } else {
        throw new Error(`Aucun texte indiqu `)
        return;
    }

};
Channel.prototype.mainMessage = async function(text, color = {}) {
    if (text) {
        const langbd = await guild.findOne({
            serverID: this.guild.id,
            reason: 'lang',
        })
        let target;
        if (langbd) {
            target = langbd.content;
        } else {
            target = 'fr';
        }

        translate(text, { to: target }).then(res => {
            let finaltxt = `${res.text}`
                .replace('<@ ', '<@')
                .replace('<# ', '<@')
                .replace('[ ', '[')
                .replace('] ', ']')
                .replace(': ', ':')
            let embed = new MessageEmbed()
                .setAuthor(this.guild.name, this.guild.iconURL())
                .setDescription(`${finaltxt}`)
                .setColor(color)
                .setFooter(config.footer);
            this.send(embed)
        }).catch(error => {


        });



    } else {
        throw new Error(`Aucun texte indiqu `)
        return;
    }

};
Message.prototype.succesMessage = async function(text, args, options = {}) {
    if (text) {
        const langbd = await guild.findOne({
            serverID: this.guild.id,
            reason: 'lang',
        })
        let target;
        if (langbd) {
            target = langbd.content;
        } else {
            target = 'fr';
        }

        translate(text, { to: target }).then(res => {
            let finaltxt = `${res.text}`
                .replace('<@ ', '<@')
                .replace('<# ', '<@')
                .replace('[ ', '[')
                .replace('] ', ']')
                .replace(': ', ':')
                .replace('<:791279906809577482: 811168114376048680>', '<:791279906809577482:811168114376048680>')
                .replace('<: 802916311972708372: 811168497953800202>', '<:802916311972708372:811168497953800202>')
            let embed = new MessageEmbed()
                .setAuthor(this.author.tag, this.author.displayAvatarURL())
                .setDescription(`${emoji.succes} - ${finaltxt}`)
                .setColor(this.client.color)

            .setFooter(this.client.footer);
            this.channel.send(embed)
        }).catch(error => {


        });



    } else {
        throw new Error(`Aucun texte indiqu `)
        return;
    }

};
Message.prototype.mainMessage = async function(text, args, options = {}) {
    if (text) {
        const langbd = await guild.findOne({
            serverID: this.guild.id,
            reason: 'lang',
        })
        let target;
        if (langbd) {
            target = langbd.content;
        } else {
            target = 'fr';
        }

        translate(text, { to: target }).then(res => {
            let finaltxt = `${res.text}`
                .replace('<@ ', '<@')
                .replace('<# ', '<@')
                .replace('[ ', '[')
                .replace('] ', ']')
                .replace(': ', ':')
                .replace('<:791279906809577482: 811168114376048680>', '<:791279906809577482:811168114376048680>')
                .replace('<: 802916311972708372: 811168497953800202>', '<:802916311972708372:811168497953800202>')
                .replace('<:802916311972708372: 811168497953800202>', '<:802916311972708372:811168497953800202>')
            let embed = new MessageEmbed()
                .setAuthor(this.author.tag, this.author.displayAvatarURL())
                .setDescription(`${finaltxt}`)
                .setColor(this.client.color)
                .setFooter(this.client.footer);
            this.channel.send(embed)
        }).catch(error => {


        });



    } else {
        throw new Error(`Aucun texte indiqu `)
        return;
    }

};

Message.prototype.sendT = async function(text, args, options = {}) {
    if (text) {
        const langbd = await guild.findOne({
            serverID: this.guild.id,
            reason: 'lang',
        })
        let target;
        if (langbd) {
            target = langbd.content;
        } else {
            target = 'en';
        }

        translate(text, { to: target }).then(res => {
            let finaltxt = `${res.text}`
                .replace('<@ ', '<@')
                .replace('<# ', '<@')
                .replace('[ ', '[')
                .replace('] ', ']')
                .replace(': ', ':')

            this.channel.send(finaltxt)
        }).catch(error => {


        });



    } else {
        throw new Error(`Aucun texte indiqu `)
        return;
    }

};
Message.prototype.succes = async function(text, args, options) {
    if (text) {
        if (!lang.translations[text]) {
            throw new Error(`Unknown text ID "${text}"`)
            return;
        }
    } else {
        throw new Error(`Aucun texte indiqu `)
        return;
    }
    const langbd = await guild.findOne({
        serverID: this.guild.id,
        reason: 'lang',
    })
    let target;
    if (langbd) {
        target = langbd.content;
    } else {
        target = 'fr';
    }

    return this.channel.send(`${emoji.succes} ${lang.translations[text][target]}`)
};
