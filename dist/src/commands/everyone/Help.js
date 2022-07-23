"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const QuickCommand_1 = require("../../abstract/QuickCommand");
class Help extends QuickCommand_1.Command {
    get name() {
        return "help";
    }
    get category() {
        return "Everyone Commands";
    }
    get aliases() {
        return ["h", "commands", "command"];
    }
    get description() {
        return "Displays all the commands of the bot. If you provide the name of a commands, it will return all available information about this command.";
    }
    get arguments() {
        return [{ name: "command", description: "Specific command help" }];
    }
    run({ ctx: e }) {
        if (e.args[0]) {
            const t = e.client.commands.getCommand(e.args[0]);
            if (!t)
                return e.errorMessage("Please provide a valid command!");
            e.send({
                embeds: [
                    {
                        color: 0x3a871f,
                        author: { name: t.name, icon_url: e.client.user.dynamicAvatarURL(), url: "https://discord.gg/synAXZtQHM" },
                        footer: { text: "Check green-bot.app/commands for more informations!", icon_url: e.client.user.dynamicAvatarURL() },
                        fields: [
                            {
                                name: "• Aliases",
                                value: t.aliases ? `(${t.aliases.length}) => ` + t.aliases.map((e) => `\`${e}\``).join(", ") : "No aliase yet! Want an aliase? Feel free to suggest it on the [Support Server](https://disord.gg/green-bot)",
                            },
                            {
                                name: "• Arguments",
                                value: t.arguments
                                    ? `${t.arguments[0].name} (${t.arguments[0].description}) [Required: ${t.arguments[0].required ? "Yes" : "No"}]\n\nUsage: \`/${t.name} ${t.arguments[0].name}\``
                                    : "You don't need to provide any arguments for this command!",
                            },
                            {
                                name: "• Requirements",
                                value: t.checks
                                    ? `${t.checks.voice ? "-Must be in a voice channel\n" : ""}${t.checks.dispatcher ? "-A music must be currently playing\n" : ""}${t.checks.channel ? "-Must be in the same voice channel as me\n" : ""}${t.checks.vote ? "-Must [upvote](https://top.gg/bot/783708073390112830/vote) the bot\n" : ""}${t.checks.premium ? "-Must have the [Guild Premium](https://green-bot.app/premium) tier enabled on the server" : ""}`
                                    : "No requirements for this command!",
                            },
                        ],
                        description: t.description,
                    },
                ],
            });
        }
        else {
            const t = [];
            e.client.commands.list.forEach((e) => {
                e.category && (t.includes(e.category) || t.push(e.category));
            }),
                e.send({
                    components: [
                        {
                            components: [
                                { url: "https://green-bot.app/commands", label: "View online", style: 5, type: 2 },
                                { url: "https://discord.com/oauth2/authorize?client_id=783708073390112830&scope=bot&permissions=8", label: "Invite me", style: 5, type: 2 },
                                { url: "https://green-bot.app/premium", label: "Go Premium", style: 5, type: 2 },
                            ],
                            type: 1,
                        },
                    ],
                    embeds: [
                        {
                            description: "You can check my [Setup Guide](https://guide.green-bot.app/configuration) to learn how to setup me.\n If you need any help, feel free to [join the support server](https://discord.gg/greenbot).",
                            fields: t.map((t) => ({
                                name: `${t}`,
                                value: e.client.commands.list
                                    .filter((e) => e.category && e.category === t)
                                    .map((e) => `\`${e.name}\``)
                                    .join(", "),
                            })),
                            color: 0x3a871f,
                            author: { name: "Green-Bot | Help Menu", icon_url: e.author.dynamicAvatarURL(), url: "https://discord.gg/synAXZtQHM" },
                            footer: { text: "Do " + e.guildDB.prefix + "help <command> for more information about a command!", icon_url: e.client.user.dynamicAvatarURL() },
                        },
                    ],
                });
        }
    }
}
exports.default = Help;
