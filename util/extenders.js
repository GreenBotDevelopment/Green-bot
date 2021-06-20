const { Message, MessageEmbed, Channel } = require("discord.js");
const lang = require('./lang.json');
const guild = require('../database/models/guild');
const emoji = require('../emojis.json');
const config = require('../config.json');
const translate = require("@vitalets/google-translate-api");

Message.prototype.translate = async function(text, args, options = {}) {
    
    if (!text) return throw new Error(`Aucun texte indiqu `)

    const langbd = await guild.findOne({
        serverID: this.guild.id,
        reason: 'lang',
    });
    
    let target = 'fr';
    
    if (langbd) target = langbd.content;
    
    const texttoreturn = await translate(text, {
        
        to: target
    
    }).then((res) => res.text).catch((error) => text);

    return texttoreturn;
};
Message.prototype.getMember = function(args = {}) {
    
    return this.mentions.members.first() || this.guild.members.cache.get(args[0]) || this.guild.members.cache.filter(m => m.user.tag.toLowerCase().includes(args[0].toLowerCase()) || m.displayName.toLowerCase().includes(args[0].toLowerCase()) || m.user.username.toLowerCase().includes(args[0].toLowerCase())).first()
    
};
Message.prototype.error = async function(text, args, options = {}) {
    
    if (text && !lang.translations[text]) return throw new Error(`Unknown text ID "${text}"`);

    else return throw new Error(`Aucun texte indiquer`);

    const langbd = await guild.findOne({
        serverID: this.guild.id,
        reason: 'lang',
    });
    
    let target = 'fr';
    
    if (langbd) target = langbd.content;
    
    return this.channel.send(`${emoji.error} ${lang.translations[text][target]}`);
    
};

Message.prototype.errorMessage = async function(text, args, options = {}) {
    
    if (text) {
        
        const langbd = await guild.findOne({
            serverID: this.guild.id,
            reason: 'lang',
        });
        
        let target = 'fr';
        
        if (langbd)  target = langbd.content;
  
        translate(text, { to: target }).then(res => {
            let finaltxt = `${res.text}`
                .replace('<@ ', '<@')
                .replace('<# ', '<@')
                .replace('[ ', '[')
                .replace('] ', ']')
                .replace(': ', ':');
            
            let embed1 = new MessageEmbed()
                .setAuthor(this.author.tag, this.author.displayAvatarURL())
                .setDescription(`${emoji.error} - ${finaltxt}`)
                .setColor('#982318')
                .setFooter(this.client.footer, this.client.user.displayAvatarURL());

            this.channel.send(embed1).then((m) => {
                
                if (!this.channel.permissionsFor(this.guild.me).has("MANAGE_MESSAGES") || !this.channel.permissionsFor(this.guild.me).has("ADD_REACTIONS")) return;

                m.react("<:delete:830790543659368448>");
                
                const filtro = (reaction, user) => {
                    return user.id == this.author.id;
                };
                
                m.awaitReactions(filtro, {
                    max: 1,
                    time: 200000,
                    errors: ["time"]
                }).catch(() => {
                    
                    m.reactions.removeAll()
                    
                }).then(async(coleccionado) => {
                    if (coleccionado) {
                        const reaccion = coleccionado.first();
                        if (reaccion.emoji.id === "830790543659368448")  m.delete()
                    }
                });
            });
        }).catch(error => {

            return;
            
        });


    } else return throw new Error(`Aucun texte indiqu `)

};

Channel.prototype.mainMessage = async function(text, color = {}) {
    
    if (text) {
        
        const langbd = await guild.findOne({
            serverID: this.guild.id,
            reason: 'lang',
        });
        
        let target = 'fr';
        
        if (langbd) target = langbd.content;
        
        translate(text, { to: target }).then(res => {
            
            let finaltxt = `${res.text}`
                .replace('<@ ', '<@')
                .replace('<# ', '<@')
                .replace('[ ', '[')
                .replace('] ', ']')
                .replace(': ', ':');
            
            let embed = new MessageEmbed()
                .setAuthor(this.guild.name, this.guild.iconURL())
                .setDescription(`${finaltxt}`)
                .setColor(color)
                .setFooter(this.client.footer, this.client.user.displayAvatarURL());

            this.send(embed).then((m) => {
                if (!this.channel.permissionsFor(this.guild.me).has("MANAGE_MESSAGES") || !this.channel.permissionsFor(this.guild.me).has("ADD_REACTIONS")) return;
 
                m.react("<:delete:830790543659368448>");
                
                const filtro = (reaction, user) => {
                    return user.id == this.author.id;
                };
                
                m.awaitReactions(filtro, {
                    max: 1,
                    time: 200000,
                    errors: ["time"]
                }).catch(() => {
                    
                    m.reactions.removeAll()
                    
                }).then(async(coleccionado) => {
                    if (coleccionado) {
                        const reaccion = coleccionado.first();
                        if (reaccion.emoji.id === "830790543659368448") m.delete()
                    }
                    
                });
                
            });
            
        }).catch(error => {
            
            return;

        });




    } else return throw new Error(`Aucun texte indiquer`);

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
        } else  target = 'fr';

        translate(text, { to: target }).then(res => {
            let finaltxt = `${res.text}`
                .replace('<@ ', '<@')
                .replace('<# ', '<@')
                .replace('[ ', '[')
                .replace('] ', ']')
                .replace(': ', ':')
                .replace('<:791279906809577482: 811168114376048680>', '<:791279906809577482:811168114376048680>')
                .replace('<: 802916311972708372: 811168497953800202>', '<:802916311972708372:811168497953800202>')
            let embed1 = new MessageEmbed()
                .setAuthor(this.author.tag, this.author.displayAvatarURL())
                .setDescription(`✅ - ${finaltxt}`)
                .setColor(this.client.color)
                .setFooter(this.client.footer, this.client.user.displayAvatarURL())


            this.channel.send(embed1).then((m) => {
                if (!this.channel.permissionsFor(this.guild.me).has("MANAGE_MESSAGES")) return;
                if (!this.channel.permissionsFor(this.guild.me).has("ADD_REACTIONS")) return;

                m.react("<:delete:830790543659368448>")
                const filtro = (reaction, user) => {
                    return user.id == this.author.id;
                };
                m.awaitReactions(filtro, {
                    max: 1,
                    time: 200000,
                    errors: ["time"]
                }).catch(() => {
                    
                    m.reactions.removeAll()
                    
                }).then(async(coleccionado) => {
                    if (coleccionado) {
                        const reaccion = coleccionado.first();
                        if (reaccion.emoji.id === "830790543659368448") m.delete()
                    }
                });
            });
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
        } else  target = 'fr';

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
            let embed1 = new MessageEmbed()
                .setAuthor(this.author.tag, this.author.displayAvatarURL())
                .setDescription(`${finaltxt}`)
                .setColor(this.client.color)
                .setFooter(this.client.footer, this.client.user.displayAvatarURL())

            this.channel.send(embed1).then((m) => {
                m.react("<:delete:830790543659368448>")
                const filtro = (reaction, user) => {
                    return user.id == this.author.id;
                };
                m.awaitReactions(filtro, {
                    max: 1,
                    time: 200000,
                    errors: ["time"]
                }).catch(() => {
                    
                    m.reactions.removeAll()

                }).then(async(coleccionado) => {
                    if (coleccionado) {
                        const reaccion = coleccionado.first();
                        if (reaccion.emoji.id === "830790543659368448") m.delete()
                    }
                });
            });

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
        } else  target = 'en';

        translate(text, { to: target }).then(res => {
            let finaltxt = `${res.text}`
                .replace('<@ ', '<@')
                .replace('<# ', '<@')
                .replace('[ ', '[')
                .replace('] ', ']')
                .replace(': ', ':')

            this.channel.send(text)
        }).catch(error => {

return;
        });



    } else return throw new Error(`Aucun texte indiquer`);

};
Message.prototype.succes = async function(text, args, options) {
    
    if (text && !lang.translations[text]) return throw new Error(`Unknown text ID "${text}"`);
    
    else return throw new Error(`Aucun texte indiqu `);
    
    const langbd = await guild.findOne({
        serverID: this.guild.id,
        reason: 'lang',
    });
    
    let target = 'fr';
    if (langbd) target = langbd.content;
    
    return this.channel.send(`${emoji.succes} ${lang.translations[text][target]}`)
};
