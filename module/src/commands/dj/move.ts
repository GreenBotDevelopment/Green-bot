import { Command } from "../../abstract/QuickCommand";
export default class Volume extends Command {
    get name() {
        return "move";
    }
    get description() {
        return "Moves the position of a track in the queue";
    }
    get aliases() {
        return ["shift", "mv"];
    }
    get category() {
        return "Queue Management";
    }
    get arguments() {
        return [{ name: "track", description: "The position or the track of the track you want to move", required: true }];
    }
    get checks() {
        return { voice: true, dispatcher: true, channel: true };
    }
    run({ ctx: e }) {
        if (!e.args[1]) return e.errorMessage("Please provide the new position of the track!");
        const r = e.args[0].replace("#", "") - 1,
            t = e.args[1].replace("#", "") - 1;
        const o = e.dispatcher.queue[r];
        if (!o) return e.errorMessage("There is no track with this number in your queue.");
        if ((e.dispatcher.remove(r), e.dispatcher.queue.splice(t, 0, o), e.client.queue._sockets.find((r) => r.serverId === e.guild.id))) {
            e.client.queue._sockets
                .filter((r) => r.serverId === e.guild.id)
                .forEach((r) => {
                    e.client.queue.emitOp({ changes: ["NEXT_SONGS"], socketId: r.id, serverId: e.guild.id, queueData: { incoming: e.dispatcher.queue } });
                });
        }
        e.successMessage(`[${o.info.title.slice(0, 50)}](https://discord.gg/greenbot) has been moved to position #${t + 1}`);
    }
}
