import { Command } from "../../abstract/QuickCommand";
export default class ClearQueue extends Command {
    get name() {
        return "clearqueue";
    }
    get description() {
        return "Clears all songs in the queue ";
    }
    get category() {
        return "Queue Management";
    }
    get aliases() {
        return ["cq", "clearqueue", "clear"];
    }
    get checks() {
        return { voice: true, dispatcher: true, channel: true, dj: true };
    }
    run({ ctx: e }) {
        if (0 == e.dispatcher.queue.length) return e.errorMessage(`There is no music in your queue. Add more songs with the ${e.client.printCmd("play")} command!`);
        e.successMessage("The queue has been succesfully cleared"),
            (e.dispatcher.queue.length = 0),
            (e.dispatcher.previousTracks = []),
            e.client.queue._sockets.find((u) => u.serverId === e.guild.id) &&
            e.client.queue.emitOp({ changes: ["NEXT_SONGS"], serverId: e.guild.id, queueData: { incoming: [] } });

    }
}
