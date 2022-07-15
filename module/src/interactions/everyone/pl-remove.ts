import { Command } from "../../abstract/QuickCommand";
export default class Queue extends Command {
    get name() {
        return "pl-remove";
    }
    get description() {
        return "Removes a song to one of your playlists";
    }
    get aliases() {
        return ["plrem", "playlist-remove"];
    }
    get category() {
        return "Everyone Commands";
    }
    get arguments() {
        return [
            { name: "playlist_name", description: "The name of the playlist you want to create", required: true,type:3 },
            { name: "track", description: "The track you want to remove from this playlist", required: true, type:3 },
        ];
    }
    async run({ ctx: e }) {
        const r = e.args[0].value;
        if (r.length < 3 || r.length > 50) return e.errorMessage("The playlist name must be beetween 2 and 50 long.");
        const s = await e.client.database.getUser(e.author.id);
        if (!s || !s.playlists.find((e) => e.name === r)) return e.errorMessage(`You don't have any playlist called **${r}** yet!`);
        if (!e.args[1]) return e.errorMessage("Please provide the song you want to remove to this playlist!");
        const t = s.playlists.find((e) => e.name === r);
        if (!t) return e.errorMessage("No playlist found!");
        let a = e.args.slice(1).join(" ");
        const o = t.tracks.find((e) => e.info.title.toLowerCase().includes(a.toLowerCase()));
        if (!o) return e.errorMessage("This track is not in your playlist");
        (t.tracks = t.tracks.filter((e) => e.info.uri !== o.info.uri)), (s.playlists = s.playlists.filter((e) => e.name !== r)), s.playlists.push(t), s.save(), e.successMessage(`Successfully removed 1 track(s) to **${r}** `);
    }
}
