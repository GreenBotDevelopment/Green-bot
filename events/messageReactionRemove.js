const config = require('../config.json');
const rrmodel = require('../database/models/rr')
const emoji = require('../emojis.json');
var db = require('quick.db')
const Discord = require('discord.js');
const Welcome = require('../database/models/Welcome');
module.exports = {


    async execute(reaction, user, client) {
        if (reaction.message.partial) await reaction.message.fetch();
        if (reaction.partial) await reaction.fetch();

        let message = reaction.message;
        if (!message) return;
        if (user.bot) return;




        let rrdb = await rrmodel.findOne({ serverID: message.guild.id, reaction: reaction.emoji.name })
        if (rrdb) {
            console.log(rrdb.roleID);

            let role = message.guild.roles.cache.get(rrdb.roleID);
            let member = message.guild.members.cache.get(user.id);
            if (role) {
                if (member) {
                    try {
                        if (!member.roles.cache.has(`${role.id}`)) {
                            member.roles.remove(role);


                        } else {
                           

                        }


                    } catch (err) {

                    }
                }


            }


        }

    }
};