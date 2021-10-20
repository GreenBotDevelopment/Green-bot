const ms = require('ms');
const youtubeModel = require('../../database/models/youtube');
const Youtube = require('simple-youtube-api');
const youtube = new Youtube('AIzaSyCxQ_Vp34-8c5b1BwzE0gkF10jFmcW1DsM');

module.exports = {
        name: 'youtube-alerts',
        description: 'Configure le système le système des alertes lors des nouvelles vidéos youtube.',
        aliases: ['youtube-system', 'youtube-notifs'],
        guildOnly: true,
        cat: 'configuration',
        permissions: ['MANAGE_GUILD'],
        botpermissions: ['SEND_MESSAGES', 'EMBED_LINKS'],
        async execute(message, args, client) {
            const youtube_prompts = await message.translate('YOUTUBE_PROMPTS');
            const ID = message.member.id;
            const youtubeDB = await youtubeModel.findOne({ serverID: message.guild.id });
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
                            { name: cfg.title, description: cfg.enabled + ' ' + (youtubeDB && youtubeDB.status ? '✅' : '❌') + '\n Youtubeur: ' + (youtubeDB && youtubeDB.youtuberName ? youtubeDB.youtuberName : cfg.no) + '\n' + cfg.channel + ' ' + (youtubeDB && youtubeDB.channelID ? '<#' + youtubeDB.channelID + '>' : cfg.no) + '\nMessage: \n```' + (youtubeDB && youtubeDB.message ? youtubeDB.message.length > 500 ? youtubeDB.message.slice(0, 500) + '...' : youtubeDB.message : cfg.no) + '```' },
                            { name: message.guild.settings.lang == 'fr' ? '`📜` Utilisation' : '`📜` Use', description: args_tip }
                    ],
                    footer: { text: client.footer, icon_url: client.user.displayAvatarURL() }
                }],
                allowedMentions: { repliedUser: false }
            }).then(m => {
            m.react('📜');
            const collector = m.createReactionCollector({ filter: (reaction, user) => reaction.emoji.name == '📜' && user.id === message.author.id, max: 1 });
            collector.on('collect', async r => {
                const response = await getResponses(message);
                if (!response || response.cancelled && client.log) return console.log('Command ' + message.content + ' | Cancelled');
                const config_ok = await message.translate('CONFIG_OK');
                const youtube_alerts = message.guild.settings.lang == 'fr' ? 'les alertes lors d\'une vidéo youtube' : 'the youtube alerts';
                const verify = await  youtubeModel.findOne({ serverID: message.guild.id });
                if (verify) {
                    const newchannel = await youtubeModel.findOneAndUpdate({ serverID: message.guild.id }, { $set: { channelID: response.channel.id, message: response.message, status: response.status, youtuberID:response.ytID, youtuberName:response.name } }, { new: true });
                    message.succesMessage(config_ok.replace('{x}', youtube_alerts));
                } else {
                    const verynew = new youtubeModel({
                        serverID: message.guild.id,
                        channelID: response.channel.id,
                        youtuberName: response.name,
                        message: response.message,
                        status: response.status,
                        youtuberID: response.ytID,
                    }).save();
                    message.succesMessage(config_ok.replace('{x}', b));
                }
            });
            collector.on('end', collected => m.reactions.removeAll());
        });
    
/**
 * Get the youtube channel id from an url
 * @param {string} url The URL of the youtube channel
 * @returns The channel ID || null
 */
 function getYoutubeChannelIdFromURL(url) {
    let id = null;
    url = url.replace(/(>|<)/gi, "").split(/(\/channel\/|\/user\/)/);
    if(url[2]) {
      id = url[2].split(/[^0-9a-z_-]/i)[0];
    }
    return id;
}

/**
 * Get infos for a youtube channel
 * @param {string} name The name of the youtube channel or an url
 * @returns The channel info || null
 */
async function getYoutubeChannelInfos(name){
    console.log(`[${name.length >= 10 ? name.slice(0, 10)+"..." : name}] | Resolving channel infos...`);
    let channel = null;
    /* Try to search by ID */
    let id = getYoutubeChannelIdFromURL(name);
    if(id){
        channel = await youtube.getChannelByID(id);
    }
    if(!channel){
        /* Try to search by name */
        let channels = await youtube.searchChannels(name);
        if(channels.length > 0){
            channel = channels[0];
        }
    }
    console.log(`[${name.length >= 10 ? name.slice(0, 10)+"..." : name}] | Title of the resolved channel: ${channel ?channel.raw ? channel.raw.snippet.title : "err": "err"}`);
    return channel;
}

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
                let okk = await message.translate("CANCELED")
                responses.cancelled = true;

message.channel.send(`**${okk}**`)
                return responses;

                break;
            }
            if (i === 0) {
                const enable_or_disable = await message.translate('ENA/DISA');

                if (content.toLowerCase() === 'enable') {
                    responses.status = true;
                } else if (content.toLowerCase() === 'disable') {
                    responses.status = null;
                    const verify = await youtubeModel.findOne({ serverID: message.guild.id });
                    if (verify) {
                        const newchannel = await youtubeModel.findOneAndUpdate({ serverID: message.guild.id,  }, { $set: { status: null } }, { new: true });

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
                        return m.errorMessage(channel_permissions)
                        break;
                    }
                    responses.channel = channel;
                } else {
                    const error_channel = await message.translate('ERROR_CHANNEL')
                    return m.errorMessage(error_channel)
                    break;
                }
            }
            if (i === 2) {
                if (content.length > 1000 || content.length < 2) {
                    const number_error = await message.translate('MESSAGE_ERROR')
                    return m.errorMessage(number_error.replace('{amount}', '2').replace('{range}', '1000'))
                    break;
                } else {
                    responses.message = content;
                }
            }
            if (i === 3) {
                let channelInfos = await getYoutubeChannelInfos(content);
                if (!channelInfos) return m.errorMessage(`${message.guild.settings.lang === "fr" ? "Veuillez fournir un nom valide de chaîne youtube ou un lien de chaîne valide.":"Please provide a valid youtube channel name or a valid channel link."}`)
                    responses.ytID = channelInfos.id
                responses.name =content;
            }
        }
        return responses;
    }
},
};
