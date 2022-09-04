import { Command } from "../../abstract/QuickCommand";
export default class Queue extends Command {
    get name() {
        return "pl-list";
    }
    get description() {
        return "Shows all your playlists!";
    }
    get aliases() {
        return ["pllist", "playlists", "list-pl"];
    }
    get category() {
        return "Everyone Commands";
    }
    async run({ ctx: e }) {
        const t = await e.client.database.getUser(e.author.id);
        if (!t) return e.errorMessage("You don't have any playlist yet, you can create one with the "+e.client.printCmd("pl-create")+" command!");
        e.send({
            embeds: [
                {
                    description: "You can create a playlist with the "+e.client.printCmd("pl-create")+" command.",
                    author: { name: "Your playlists", icon_url: e.author.dynamicAvatarURL() },
                    fields: [
                        {
                            name: "• List (" + t.playlists.length + " / 10)",
                            value: t.playlists.length ? t.playlists.map((e) => `[${e.name}](https://green-bot.app), ${e.tracks.length} tracks.`).join("\n") : "You don't have any playlist yet!",
                        },
                        {
                            name: "• Liked songs (" + t.songs.length + ")",
                            value: t.songs.length ? `You currently have **${t.songs.length}** liked songs!\n You can play your liked songs using ${e.client.printCmd("pl-play")} and input **liked songs**` : "You don't have any liked song yet!",
                        },
                    ],
                    color: 0x3a871f,
                },
            ],
            components: [{ components: [{ custom_id: "edit_pl", label: "Edit a playlist", style: 3, type: 2 }], type: 1 }],
        });
    }
}
