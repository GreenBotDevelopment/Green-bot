import { Command } from "../../abstract/QuickCommand";
export default class Help extends Command {
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
        return "Displays all the commands of the bot. ";
    }
    get arguments() {
        return [{ name: "command", description: "Specific command help", required: false, type: 3 }];
    }
    run({ ctx: e }) {
        if (e.args[0]) {
            const a = e.client.commands.getCommand(e.args[0].value)
            if (!a) return e.errorMessage("Please provide a valid command!");
            e.reply({
                embeds: [
                    {
                        color: 0x3a871f,
                        author: { name: a.name, icon_url: e.client.user.dynamicAvatarURL(), url: "https://discord.gg/synAXZtQHM" },
                        footer: { text: "Check green-bot.app/commands for more informations!", icon_url: e.client.user.dynamicAvatarURL() },
                        fields: [
                            {
                                name: "• Aliases",
                                value: a.aliases ? `(${a.aliases.length}) => ` + a.aliases.map((e) => `\`${e}\``).join(", ") : "No aliase yet! Want an aliase? Feel free to suggest it on the [Support Server](https://disord.gg/green-bot)",
                            },
                            {
                                name: "• Arguments",
                                value: a.arguments
                                    ? `${a.arguments[0].name} (${a.arguments[0].description}) [Required: ${a.arguments[0].required ? "Yes" : "No"}]\n\nUsage: \`/${a.name} ${a.arguments[0].name}\``
                                    : "You don't need to provide any arguments for this command!",
                            },
                            {
                                name: "• Requirements",
                                value: a.checks
                                    ? `${a.checks.voice ? "-Must be in a voice channel\n" : ""}${a.checks.dispatcher ? "-A music must be currently playing\n" : ""}${a.checks.channel ? "-Must be in the same voice channel as me\n" : ""}${
                                          a.checks.vote ? "-Must [upvote](https://top.gg/bot/783708073390112830/vote) the bot\n" : ""
                                      }${a.checks.premium ? "-Must have the [Guild Premium](https://green-bot.app/premium) tier enabled on the server" : ""}`
                                    : "No requirements for this command!",
                            },
                        ],
                        description: a.description,
                    },
                ],
            });
        } else {
            const a = [];
            e.client.commands.list.forEach((e) => {
                e.category && (a.includes(e.category) || a.push(e.category));
            }),
                e.reply({
                    components: [
                        {
                            components: [
                                { url: "https://green-bot.app/commands", label: "View online", style: 5, type: 2 },
                                { url: "https://discord.com/oauth2/authorize?client_id=783708073390112830&permissions=8&scope=bot%20applications.commands", label: "Invite me", style: 5, type: 2 },
                                { url: "https://green-bot.app/premium", label: "Go Premium", style: 5, type: 2 },
                            ],
                            type: 1,
                        },
                    ],
                    embeds: [
                        {
                            fields: a.map((a) => ({
                                name: `${a}`,
                                value: e.client.commands.list
                                    .filter((e) => e.category === a)
                                    .map((e) => `\`${e.name}\``)
                                    .join(", "),
                            })),
                            color: 0x3a871f,
                            author: { name: "Green-Bot | Help Menu", icon_url: e.author.dynamicAvatarURL(), url: "https://discord.gg/synAXZtQHM" },
                            footer: { text: "Do /help <command> for more informations about a command!", icon_url: e.client.user.dynamicAvatarURL() },
                        },
                    ],
                });
        }
    }
}
