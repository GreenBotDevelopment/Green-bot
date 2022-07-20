"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const QuickCommand_1 = require("../../abstract/QuickCommand");
class ClearQueue extends QuickCommand_1.Command {
    get name() { return "clearqueue"; }
    get description() { return "Clears all songs in the queue "; }
    get category() { return "Queue Management"; }
    get aliases() { return ["cq", "clearqueue", "clear"]; }
    get checks() { return { voice: true, dispatcher: true, channel: true, dj: true }; }
    run({ ctx: e }) { if (0 == e.dispatcher.queue.length)
        return e.errorMessage(`There is no music in your queue. Add more songs with \`/play <music>\``); e.successMessage("The queue has been succesfully cleared"), e.dispatcher.queue.length = 0, e.dispatcher.previousTracks = [], e.client.queue._sockets.find(u => u.serverId === e.guild.id) && e.client.queue._sockets.filter(u => u.serverId === e.guild.id).forEach(u => { e.client.queue.emitOp({ changes: ["NEXT_SONGS"], socketId: u.id, serverId: e.guild.id, queueData: { incoming: [] } }); }); }
}
exports.default = ClearQueue;
