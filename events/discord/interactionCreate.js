const Discord = require("discord.js")
const ms = require("ms")
module.exports = {
    async execute(interaction, client) {
        if (interaction.isButton()) {
            console.log("BUTTON USED")
            const guildDB = await interaction.guild.fetchDB()
            const queue = await client.player.getQueue(interaction.guild.id)
            if (!queue) {
                interaction.reply({ content: `\`❌\` There is no queue for this server.`, ephemeral: true })
                return
            }
            if (!interaction.member.voice.channel) {
                interaction.reply({ content: `\`❌\` You have to be in a voice channel..`, ephemeral: true })

                return
            }
            if (interaction.customId === "pause") {
                if (guildDB.dj_role && queue.metadata.dj.id !== interaction.user.id) {
                    if (!interaction.member.permissions.has("MANAGE_MESSAGES")) {
                        let role = interaction.guild.roles.cache.get(guildDB.dj_role)
                        if (!role) return interaction.reply({ content: `\`❌\` You are not allowed to do this (Dj role missing).`, ephemeral: true })
                        if (interaction.member.roles.cache) {
                            if (!interaction.member.roles.cache.has(role.id)) return interaction.reply({ content: `\`❌\` You are not allowed to do this (Dj role missing).`, ephemeral: true })
                        } else return interaction.reply({ content: `\`❌\` You are not allowed to do this (Dj role missing).`, ephemeral: true })
                    }
                }
                if (queue.connection.paused) {
                    interaction.reply({ content: `\`❌\` Player is already paused.`, ephemeral: true })
                    return
                }
                queue.setPaused(true)
                interaction.reply({ content: `**⏸ Player paused**`, ephemeral: true })
                return
            }
            if (interaction.customId === "resume") {
                if (guildDB.dj_role && queue.metadata.dj.id !== interaction.user.id) {
                    if (!interaction.member.permissions.has("MANAGE_MESSAGES")) {
                        let role = interaction.guild.roles.cache.get(guildDB.dj_role)
                        if (!role) return interaction.reply({ content: `\`❌\` You are not allowed to do this (Dj role missing).`, ephemeral: true })
                        if (interaction.member.roles.cache) {
                            if (!interaction.member.roles.cache.has(role.id)) return interaction.reply({ content: `\`❌\` You are not allowed to do this (Dj role missing).`, ephemeral: true })
                        } else return interaction.reply({ content: `\`❌\` You are not allowed to do this (Dj role missing).`, ephemeral: true })
                    }
                }
                if (!queue.connection.paused) {
                    interaction.reply({ content: `\`❌\` Player is not already paused.`, ephemeral: true })
                    return
                }
                queue.setPaused(false)
                interaction.reply({ content: `**▶ Player unpaused**`, ephemeral: true })

                return
            }
            if (interaction.customId === "back_button") {
                if (guildDB.dj_role && queue.metadata.dj.id !== interaction.user.id) {
                    if (!interaction.member.permissions.has("MANAGE_MESSAGES")) {
                        let role = interaction.guild.roles.cache.get(guildDB.dj_role)
                        if (!role) return interaction.reply({ content: `\`❌\` You are not allowed to do this (Dj role missing).`, ephemeral: true })
                        if (interaction.member.roles.cache) {
                            if (!interaction.member.roles.cache.has(role.id)) return interaction.reply({ content: `\`❌\` You are not allowed to do this (Dj role missing).`, ephemeral: true })
                        } else return interaction.reply({ content: `\`❌\` You are not allowed to do this (Dj role missing).`, ephemeral: true })
                    }
                }
                if (!queue.previousTracks[0]) {
                    interaction.reply({ content: `\`❌\` There is no previous track in your queue!`, ephemeral: true })

                    return
                }
                if (queue.previousTracks.length > 1) {
                    const backed = queue.back();
                    return await interaction.editReply(
                        backed ?
                        `⏮️ | Now Playing the previous track from your queue!` :
                        `\`❌\` There is no previous track in your queue!`
                    );
                } else {
                    return interaction.reply({ content: `\`❌\` There is no previous track in your queue!`, ephemeral: true })

                }

            }
            if (interaction.customId === "next") {
                if (guildDB.dj_role && queue.metadata.dj.id !== interaction.user.id) {
                    if (!interaction.member.permissions.has("MANAGE_MESSAGES")) {
                        let role = interaction.guild.roles.cache.get(guildDB.dj_role)
                        if (!role) return interaction.reply({ content: `\`❌\` You are not allowed to do this (Dj role missing).`, ephemeral: true })
                        if (interaction.member.roles.cache) {
                            if (!interaction.member.roles.cache.has(role.id)) return interaction.reply({ content: `\`❌\` You are not allowed to do this (Dj role missing).`, ephemeral: true })
                        } else return interaction.reply({ content: `\`❌\` You are not allowed to do this (Dj role missing).`, ephemeral: true })
                    }
                }
                const { QueueRepeatMode } = require("discord-player");
                if (queue.tracks.length == 0 && queue.repeatMode !== QueueRepeatMode.AUTOPLAY) {
                    interaction.reply({ content: `\`❌\` Nothing next in the queue.`, ephemeral: true })
                    return
                }
                queue.skip();
                interaction.reply({ content: `**⏩ *Skipping* 👍**`, ephemeral: true })

                return

            }
            if (interaction.customId === "volume_up") {
                if (guildDB.dj_role && queue.metadata.dj.id !== interaction.user.id) {
                    if (!interaction.member.permissions.has("MANAGE_MESSAGES")) {
                        let role = interaction.guild.roles.cache.get(guildDB.dj_role)
                        if (!role) return interaction.reply({ content: `\`❌\` You are not allowed to do this (Dj role missing).`, ephemeral: true })
                        if (interaction.member.roles.cache) {
                            if (!interaction.member.roles.cache.has(role.id)) return interaction.reply({ content: `\`❌\` You are not allowed to do this (Dj role missing).`, ephemeral: true })
                        } else return interaction.reply({ content: `\`❌\` You are not allowed to do this (Dj role missing).`, ephemeral: true })
                    }
                }
                if (queue.volume === "200") return interaction.reply({ content: `\`❌\` Maximum volume is 200.`, ephemeral: true })
                const toSet = queue.volume + 10
                queue.setVolume(toSet);
                interaction.reply({ content: `🔊 Volume set to **${toSet}**`, ephemeral: true })

                interaction.channel.send({ content: `🔊 Volume set to **${toSet}** by **${interaction.user.username}**`, ephemeral: true }).then(m => setTimeout(() => m.delete(), 4000))
                return
            }
            if (interaction.customId === "volume_down") {
                if (guildDB.dj_role && queue.metadata.dj.id !== interaction.user.id) {
                    if (!interaction.member.permissions.has("MANAGE_MESSAGES")) {
                        let role = interaction.guild.roles.cache.get(guildDB.dj_role)
                        if (!role) return interaction.reply({ content: `\`❌\` You are not allowed to do this (Dj role missing).`, ephemeral: true })
                        if (interaction.member.roles.cache) {
                            if (!interaction.member.roles.cache.has(role.id)) return interaction.reply({ content: `\`❌\` You are not allowed to do this (Dj role missing).`, ephemeral: true })
                        } else return interaction.reply({ content: `\`❌\` You are not allowed to do this (Dj role missing).`, ephemeral: true })
                    }
                }
                if (queue.volume === "10") return interaction.reply({ content: `\`❌\` You reached minimum volume.`, ephemeral: true })
                const toSet = queue.volume - 10
                queue.setVolume(toSet);
                interaction.reply({ content: `🔊 Volume set to **${toSet}**`, ephemeral: true })
                interaction.channel.send({ content: `🔊 Volume set to **${toSet}** by **${interaction.user.username}**`, ephemeral: true }).then(m => setTimeout(() => m.delete(), 4000))
                return

            }
            if (interaction.customId === "seek_button") {
                if (guildDB.dj_role && queue.metadata.dj.id !== interaction.user.id) {
                    if (!interaction.member.permissions.has("MANAGE_MESSAGES")) {
                        let role = interaction.guild.roles.cache.get(guildDB.dj_role)
                        if (!role) return interaction.reply({ content: `\`❌\` You are not allowed to do this (Dj role missing).`, ephemeral: true })
                        if (interaction.member.roles.cache) {
                            if (!interaction.member.roles.cache.has(role.id)) return interaction.reply({ content: `\`❌\` You are not allowed to do this (Dj role missing).`, ephemeral: true })
                        } else return interaction.reply({ content: `\`❌\` You are not allowed to do this (Dj role missing).`, ephemeral: true })
                    }
                }
                const time = ms('10s');
                queue.seek(queue._streamTime + time);
                interaction.reply({ content: `**⏩ *Forwarding the music of 10s* 👍**`, ephemeral: true })

                return

            }
            if (interaction.customId === "seek_back_button") {
                if (guildDB.dj_role && queue.metadata.dj.id !== interaction.user.id) {
                    if (!interaction.member.permissions.has("MANAGE_MESSAGES")) {
                        let role = interaction.guild.roles.cache.get(guildDB.dj_role)
                        if (!role) return interaction.reply({ content: `\`❌\` You are not allowed to do this (Dj role missing).`, ephemeral: true })
                        if (interaction.member.roles.cache) {
                            if (!interaction.member.roles.cache.has(role.id)) return interaction.reply({ content: `\`❌\` You are not allowed to do this (Dj role missing).`, ephemeral: true })
                        } else return interaction.reply({ content: `\`❌\` You are not allowed to do this (Dj role missing).`, ephemeral: true })
                    }
                }
                const time = ms('10s');
                queue.seek(queue._streamTime - time);
                interaction.reply({ content: `**⏩ *Seeking 10s back* 👍**`, ephemeral: true })

                return

            }
            if (interaction.customId === "shuffle") {
                if (guildDB.dj_role && queue.metadata.dj.id !== interaction.user.id) {
                    if (!interaction.member.permissions.has("MANAGE_MESSAGES")) {
                        let role = interaction.guild.roles.cache.get(guildDB.dj_role)
                        if (!role) return interaction.reply({ content: `\`❌\` You are not allowed to do this (Dj role missing).`, ephemeral: true })
                        if (interaction.member.roles.cache) {
                            if (!interaction.member.roles.cache.has(role.id)) return interaction.reply({ content: `\`❌\` You are not allowed to do this (Dj role missing).`, ephemeral: true })
                        } else return interaction.reply({ content: `\`❌\` You are not allowed to do this (Dj role missing).`, ephemeral: true })
                    }
                }
                if (queue.tracks.length == 1 || queue.tracks.length == 0) return interaction.reply({ content: `\`❌\` No enough track to shuffle the queue.`, ephemeral: true })
                queue.shuffle();
                interaction.reply({ content: `\`✅\` Queue **shuffled**`, ephemeral: true })
                return
            }
            if (interaction.customId === "loop") {
                if (guildDB.dj_role && queue.metadata.dj.id !== interaction.user.id) {
                    if (!interaction.member.permissions.has("MANAGE_MESSAGES")) {
                        let role = interaction.guild.roles.cache.get(guildDB.dj_role)
                        if (!role) return interaction.reply({ content: `\`❌\` You are not allowed to do this (Dj role missing).`, ephemeral: true })
                        if (interaction.member.roles.cache) {
                            if (!interaction.member.roles.cache.has(role.id)) return interaction.reply({ content: `\`❌\` You are not allowed to do this (Dj role missing).`, ephemeral: true })
                        } else return interaction.reply({ content: `\`❌\` You are not allowed to do this (Dj role missing).`, ephemeral: true })
                    }
                }
                const { QueueRepeatMode } = require("discord-player");
                if (queue.repeatMode == QueueRepeatMode.QUEUE) {
                    queue.setRepeatMode(QueueRepeatMode.OFF);
                    interaction.reply({ content: `\`✅\` Repeat mode **disabled**`, ephemeral: true })
                    return
                } else {
                    queue.setRepeatMode(QueueRepeatMode.QUEUE);
                    interaction.reply({ content: `\`✅\` Repeat mode **enabled**`, ephemeral: true })
                    return
                };

            }
            if (interaction.customId === "autoplay") {
                const { Player, QueryType, QueueRepeatMode } = require("discord-player");

                if (queue.repeatMode !== QueueRepeatMode.AUTOPLAY) {
                    queue.setRepeatMode(QueueRepeatMode.AUTOPLAY);
                    interaction.reply({ content: `\`✅\` Autoplay **enabled**.`, ephemeral: true })

                    return
                } else {
                    queue.setRepeatMode(QueueRepeatMode.OFF);
                    interaction.reply({ content: `\`✅\` Autoplay **disabled**.`, ephemeral: true })

                    return
                };

            }
            if (interaction.customId === "stop") {
                if (guildDB.dj_role && queue.metadata.dj.id !== interaction.user.id) {
                    if (!interaction.member.permissions.has("MANAGE_MESSAGES")) {
                        let role = interaction.guild.roles.cache.get(guildDB.dj_role)
                        if (!role) return interaction.reply({ content: `\`❌\` You are not allowed to do this (Dj role missing).`, ephemeral: true })
                        if (interaction.member.roles.cache) {
                            if (!interaction.member.roles.cache.has(role.id)) return interaction.reply({ content: `\`❌\` You are not allowed to do this (Dj role missing).`, ephemeral: true })
                        } else return interaction.reply({ content: `\`❌\` You are not allowed to do this (Dj role missing).`, ephemeral: true })
                    }
                }
                interaction.reply({ content: `**⏹ Stopped the music**`, ephemeral: true })

                queue.destroy()
                if (queue.metadata.controller) {
                    const embed = new Discord.MessageEmbed()
                        .setAuthor(interaction.guild.name, interaction.guild.icon ? interaction.guild.iconURL({ dynamic: true }) : "https://cdn.discordapp.com/attachments/748897191879245834/782271474450825226/0.png?size=128", "https://discord.com/oauth2/authorize?client_id=783708073390112830&scope=bot&permissions=19456")
                        .setDescription(`Send a music name/link bellow this message to play music.\n[Invite me](https://green-bot.app/invite) | [Premium](https://green-bot.app/premium) | [Dashboard](https://green-bot.app) | [Commands](https://green-bot.app/commands)`)
                        .addField("Now playing", "__**Nothing playing**__")
                        .setImage(url = "https://cdn.discordapp.com/attachments/893185846876975104/900453806549127229/green_bot_banner.png")

                    .setFooter(`${client.footer}`, client.user.displayAvatarURL({ dynamic: true, size: 512 }))
                        .setColor("#3A871F")
                    return queue.metadata.message.edit({ embeds: [embed] })
                }

                return



            }
        }
        if (!interaction.isCommand()) return;
        await interaction.reply({ content: "`❌` Slash commands are under construction.\n Join the support server for more informations: https://discord.gg/synAXZtQHM" });

    }
};