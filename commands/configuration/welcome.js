const Welcome = require('../../database/models/Welcome');

module.exports = {
        name: 'welcome',
        description: 'Configure le système de bienvenue.',
        aliases: ['bienvenue', 'bvn'],
        guildOnly: true,
        cat: 'configuration',
        permissions: ['MANAGE_GUILD'],
        botpermissions: ['SEND_MESSAGES', 'EMBED_LINKS'],
        async execute(message, args, client) {
            const ID = message.member.id;
            const prompts = await message.translate('WELCOME_PROMPTS');
            const welcomeDB = await Welcome.findOne({ serverID: message.guild.id, reason: 'welcome' });
            const dashboard = await message.translate('DASHBOARD');
            const args_tip = await message.translate('ARGS_TIP');
            const cfg = await message.translate('ACTUAL_CONFIG');
                message.reply({
                        embeds: [{
                                color: '#f0b02f',
                                author: { name: message.author.username, icon_url: message.author.displayAvatarURL({ dynamic: true }) },
                                title: message.guild.settings.lang === 'fr' ? 'Messages de bienvenue' : 'Welcome messages',
                                description: dashboard,
                                thumbnail: { url: client.user.displayAvatarURL({ format: 'png' }) },
                                fields: [
                                        { name: cfg.title, description: cfg.enabled + (welcomeDB && welcomeDB.status ? '✅' : '❌') + '\nImage: ' + (welcomeDB && welcomeDB.image ? '✅'  : '❌') + '\n' + cfg.channel + ' ' + (welcomeDB && welcomeDB.channelID ? '<#' + welcomeDB.channelID + '>' : cfg.no) + '\nMessage: \n```' + (welcomeDB && welcomeDB.message ? (welcomeDB.message.length > 500 ? welcomeDB.message.slice(0, 500) + '...' : welcomeDB.message) : cfg.no) + '```' },
                                        { name: message.guild.settings.lang == 'fr' ? '`📜` Utilisation' : '`📜` Use', description: args_tip }
                                ],
                                footer: { text: client.footer, icon_url: client.user.displayAvatarURL() }
                        }],
                        allowedMentions: { repliedUser: false }
                }).then(m => {
                    m.react('📜');
                    const collector = m.createReactionCollector({ filter: (reaction, user) => reaction.emoji.name === "📜" && user.id === message.author.id, max:1 });
                    collector.on('collect', async r => {
                        const response = await getResponses(message)
                        if (!response || response.cancelled) return client.log ? console.log('Command ' + message.content + ' | Cancelled') : null;
                        const config_ok = await message.translate('CONFIG_OK');
                        const welcome_messages = message.guild.settings.lang == 'fr' ? 'les messages de bienvenue' : 'the welcome messages';
                        const verify = await Welcome.findOne({ serverID: message.guild.id, reason: 'welcome' });
                        if (verify) {
                                const newchannel = await Welcome.findOneAndUpdate({ serverID: message.guild.id, reason: `welcome` }, { $set: { channelID: response.channel.id, reason: `welcome `, message: response.message, status: response.status, image: response.image ? true : false, } }, { new: true });
                                message.succesMessage(config_ok.replace('{x}', welcome_messages));
                        } else {
                            const verynew = new Welcome({
                                serverID: message.guild.id,
                                channelID: response.channel.id,
                                reason: 'welcome',
                                message: response.message,
                                status: response.status,
                                image: response.image,
                            }).save();
                            message.succesMessage(config_ok.replace('{x}', welcome_messages));
                        }
                    });
                    collector.on('end', collected => m.reactions.removeAll());
                });
            async function getResponses(message) {
                const validTime = /^\d+(s|m|h|d)$/;
                const validNumber = /^\d+/;
                const responses = {}

                let can = await message.translate("CAN_CANCEL")
                    for (let i = 0; i < prompts.length; i++) {
                        await message.mainMessageT(`${prompts[i]}\n\n${can}`);
                const filter = m => m.author.id === ID;
                const response =  await message.channel.awaitMessages({ filter, max: 1,})
                    const { content } = response.first();
                    const m = response.first();
                    if (content.toLowerCase() === "cancel") {
                        const canceled = await message.translate('CANCELED');
                        responses.cancelled = true;

                        message.channel.send('**' + canceled + '**');
                        return responses;
                        break;
                    }
                    if (i === 0) {
                        const enable_or_disable = await message.translate('ENA/DISA');

                        if (content.toLowerCase() === 'enable') {
                            responses.status = true;
                        } else if (content.toLowerCase() === 'disable') {
                            responses.status = null;

                            const verify = await Welcome.findOne({ serverID: message.guild.id, reason: 'welcome' });
                            if (verify) {
                                const newchannel = await Welcome.findOneAndUpdate({ serverID: message.guild.id, reason: 'welcome' }, { $set: { status: null } }, { new: true });

                                return message.succesMessage(enable_or_disable.succes);

                            }
                            return message.succesMessage(enable_or_disable.disable);

                        } else {
                            return m.errorMessage(enable_or_disable.err);
                        }

                    }
                    if (i === 1) {
                        let channel = m.mentions.channels.first() || message.guild.channels.cache.get(content) || message.guild.channels.cache.filter(m => m.type === "GUILD_TEXT" && m.name.includes(args.join(" "))).first();
                            if (channel && channel.type === 'GUILD_TEXT' && channel.guild.id === message.guild.id) {
                            if (!channel.viewable||!channel.permissionsFor(message.guild.me).has('SEND_MESSAGES') || !channel.permissionsFor(message.guild.me).has('EMBED_LINKS') ) {
                                const channel_permissions = await message.translate('CHANNEL_PERMS');
                                return m.errorMessage(channel_permissions);
                                break;
                            }
                            responses.channel = channel;
                        } else {
                            const error_channel = await message.translate('ERROR_CHANNEL');
                            return m.errorMessage(error_channel);
                            break;
                        }
                    }
                    if (i === 2) {
                        if (content.length > 2000 || content.length < 1) {
                                const number_error = await message.translate('MESSAGE_ERROR');
                                return m.errorMessage(number_error.replace('{amount}', '2').replace('{range}', '2000'));
                                break;
                        } else {
                            responses.message = content;
                        }
                    }
                    if (i === 3) {
                        if (content.toLowerCase() === 'image') {
                            responses.image = true;
                        } else if (content.toLowerCase() === 'text') {
                            responses.image = null;
                        } else {
                            return m.errorMessage(message.guild.settings.lang === 'fr' ? 'Veuillez fournir l\'argument attendu: **image** ou **text**.' : 'Please provide the expected argument: **image** or **text**.');
                        }

                    }
                }
                return responses;
            }
        },
};
