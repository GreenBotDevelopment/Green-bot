"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CommandManager = void 0;
const Context_1 = require("./Context");
class CommandManager {
    constructor(client) {
        this.client = client;
    }
    resolvePartials(message) {
        return __awaiter(this, void 0, void 0, function* () {
            let channel, guild, member, me;
            channel = message.channel && message.channel.name ? message.channel : this.client.getChannel(message.channel.id) || (yield this.client.getRESTChannel(message.channel.id));
            member = message.member && message.member.username ? message.member : channel.guild && channel.guild.name ? channel.guild.members.get(message.author.id) ? channel.guild.members.get(message.author.id) : yield this.client.getRESTGuildMember(message.guildID, message.author.id) : yield this.client.getRESTGuildMember(message.guildID, message.author.id);
            guild = channel.guild.name ? channel.guild : member.guild.name ? member.guild : yield this.client.getRESTGuild(message.guildID);
            me = guild.members.get(this.client.user.id) || (yield this.client.getRESTGuildMember(message.guildID, this.client.user.id));
            message.channel = channel;
            message.channel.guild = guild;
            message.member = member;
            if (!guild.members.get(member.id))
                guild.members.set(member.id, member);
            return { channel, guild, member, me };
        });
    }
    handle(message) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this.client.cluster.ready && this.client.cluster.maintenance)
                return;
            if (!message.guildID || message.author.bot)
                return;
            if (this.client.collectors.handle(message, "message"))
                return;
            const data = yield this.client.database.resolve(message.guildID);
            if (message.content.match(new RegExp(`^<@!?${this.client.user.id}>( |)$`)))
                return this.client.createMessage(message.channel.id, {
                    embeds: [
                        {
                            color: 0x3A871F,
                            author: { name: "Green-bot | Get started", icon_url: this.client.user.dynamicAvatarURL(), url: "https://green-bot.app/" },
                            description: "Hello! My prefix is set to `" +
                                data.prefix +
                                "` for this server, to get started send `" +
                                data.prefix +
                                "help`\n\nTo play a music with me, just join a voice channel and send `" +
                                data.prefix +
                                "play <music>`!",
                        },
                    ],
                    components: [
                        {
                            components: [
                                { url: "https://green-bot.app/commands", label: "Commands", style: 5, type: 2 },
                                { url: "https://green-bot.app/premium", label: "Premium", style: 5, type: 2 },
                                { url: "https://green-bot.app/invite", label: "Invite", style: 5, type: 2 },
                            ],
                            type: 1,
                        },
                    ],
                });
            const cleanedContent = message.content.toLowerCase();
            if (cleanedContent.startsWith(data.prefix.toLowerCase()) || cleanedContent.startsWith("<@!" + this.client.user.id + ">") || cleanedContent.startsWith("<@" + this.client.user.id + ">") || cleanedContent.startsWith("green")) {
                let args;
                cleanedContent.startsWith(data.prefix.toLowerCase()) && (args = message.content.slice(data.prefix.length).trim().split(/ +/));
                cleanedContent.startsWith("<@!" + this.client.user.id + ">") && (args = message.content.slice(22).trim().split(/ +/));
                cleanedContent.startsWith("<@" + this.client.user.id + ">") && (args = message.content.slice(21).trim().split(/ +/));
                cleanedContent.startsWith("green") && (args = message.content.slice(5).trim().split(/ +/));
                const command = this.client.commands.getCommand(args.shift().toLowerCase());
                if (!command)
                    return this.client.config.debug && console.log(`[Message not handled ()] Content ${message.content} has been ignored. Potential aliase?`);
                const { channel, guild, member, me } = yield this.resolvePartials(message);
                const context = new Context_1.Context(this.client, message, args, data, me, member);
                if (!this.client.hasBotPerm(context, "sendMessages")) {
                    const dmChannel = yield message.author.getDMChannel();
                    return dmChannel.createMessage("Hello! I tried to send a reply to your command, however, I lack the permission to \u{1F615}. Please have someone from the staff give me the `Send Messages` Discord permission.\n\n Server: **" +
                        guild.name +
                        "**\n Command: **" +
                        command.name +
                        "**\n Want help with permissions? Join the support server: https://discord.gg/greenbot");
                }
                if (!this.client.hasBotPerm(context, "embedLinks")) {
                    return this.client.createMessage(channel.id, "\u274C The bot must have the `Embed links` Discord permission to work properly! \n Please have someone from the staff give me this permission.");
                }
                if (data.txts && data.txts.length && data.txts.filter((b) => guild.channels.get(b)).length > 0 && !data.txts.includes(`${channel.id}`) && "textchannels" !== command.name) {
                    return context.errorMessage(`I am not allowed to answer to commands in this channel.
                ${data.txts.length > 1 ? `Please use one of the following channels: ${data.txts.map((a) => `<#${a}>`).join(",")}` : `Please use the <#${data.txts[0]}> channel`}`);
                }
                const eligigle = this.client.shoukaku.checkEligible(context);
                if (!eligigle && !(yield this.client.database.checkPremium(message.guildID, message.author.id, true))) {
                    return context.errorMessage("**Oops!** You need to wait 1.5 seconds before each command! \n\n Want to bypass this? Become a [Premium](https://green-bot.app/premium) user or switch to [slash commands](https://support.discord.com/hc/en-us/articles/1500000368501-Slash-Commands-FAQ)!");
                }
                if (this.client.config.premiumCmd.includes(command.name) && !(yield this.client.database.checkPremium(message.guildID, message.author.id, true))) {
                    return this.client.createMessage(message.channel.id, {
                        embeds: [
                            {
                                color: 0x3A871F,
                                author: { name: "Premium command", icon_url: this.client.user.dynamicAvatarURL(), url: "https://green-bot.app/premium" },
                                description: "This command is locked behind premium because it uses more CPU than the other commands.\n\nYou can purchase the premium on the [Patreon Page](https://green-bot.app/premium) to use this command..",
                            },
                        ],
                        components: [{ components: [{ url: "https://green-bot.app/premium", label: "Premium", style: 5, type: 2 }], type: 1 }],
                    });
                }
                if (this.client.config.voteLocks.includes(command.name) && !(yield this.client.database.checkPremium(message.guildID, message.author.id, true)) && !(yield this.checkVoted(message.author.id))) {
                    return this.client.createMessage(message.channel.id, {
                        embeds: [
                            {
                                footer: { text: "You can bypass this restriction by purchasing our premium (green-bot.app/premium)" },
                                color: 0xC73829,
                                description: "You need to vote the bot [here](ttps://green-bot.app/vote) to access this command.\nClick here to vote: [**green-bot.app/vote**](https://top.gg/bot/783708073390112830/vote)",
                            },
                        ],
                        components: [
                            {
                                components: [
                                    { url: "https://green-bot.app/vote", label: "Vote", style: 5, type: 2 },
                                    { url: "https://green-bot.app/premium", label: "Premium", style: 5, type: 2 },
                                ],
                                type: 1,
                            },
                        ],
                    });
                }
                if (command.permissions && !channel.permissionsOf(member).has(command.permissions)) {
                    return context.errorMessage(`You need to have the \`${command.permissions[0].replace("manageGuild", "Manage Guild")}\` permission to use this command`);
                }
                if (command.arguments && command.arguments[0].required && !args[0]) {
                    return context.errorMessage(`You need to provide arguments for this command. (${command.arguments[0].description})\n\n Example usage: \`${data.prefix}${command.name} ${command.arguments[0].name}\``);
                }
                if (data.dj_commands.length && data.dj_commands.includes(command.name) && !this.checkDJ(context)) {
                    return context.errorMessage("You need to have the `Manage Messages` permission or a DJ role to use this command!");
                }
                const checks = command.checks;
                if (checks) {
                    if (checks.voice === true && !member.voiceState.channelID)
                        return context.errorMessage("You have to be connected in a voice channel before you can use this command!");
                    if (checks.channel === true && member.voiceState.channelID && me.voiceState.channelID && member.voiceState.channelID !== me.voiceState.channelID) {
                        return context.errorMessage("You need to be in the same voice channel as me (<#" +
                            me.voiceState.channelID +
                            ">)! Want to listen music with another Green-bot? Consider inviting [Green-bot 2](https://discord.com/oauth2/authorize?client_id=902201674263851049&scope=applications.commands&permissions=3165184)!");
                    }
                    if (checks.dispatcher) {
                        if (!context.dispatcher || context.dispatcher && !context.dispatcher.playing)
                            return context.errorMessage("I am not currently playing music in this server. So it's impossible to do that");
                    }
                }
                try {
                    command.run({ ctx: context });
                }
                catch (error) {
                    console.log(error);
                    console.log(`[Command Service] Error when executing command ${command.name}`);
                    context.errorMessage(`**Uh Oh!** Something went wrong on our side while executing your command..\nP\nlease go in the [support server](https://discord.gg/greenbot) and report this issue: \`${error}\``);
                }
            }
        });
    }
    checkVoted(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            let voted = false;
            try {
                voted = yield this.client.dbl.hasVoted(userId);
            }
            catch (err) {
                voted = true;
                this.client.config.debug && console.log(`[CommandServer] Top.gg request for ${userId} failed with error: ${err}, bypassing...`);
            }
            return voted;
        });
    }
    checkDJ(context) {
        let isDj = false;
        if (!context.guildDB.djroles || !context.guildDB.djroles.length)
            return true;
        if (context.member.roles.find(r => context.guildDB.djroles.includes(r)))
            isDj = true;
        if (context.member.permissions.has("manageGuild"))
            isDj = true;
        if (context.dispatcher && context.dispatcher.metadata.dj === context.member.id)
            isDj = true;
        return isDj;
    }
}
exports.CommandManager = CommandManager;
