"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const QuickCommand_1 = require("../../abstract/QuickCommand");
class removeDupes extends QuickCommand_1.Command {
    get name() { return "removedupes"; }
    get description() { return "Removes all duplicate tracks from the queue"; }
    get aliases() { return ["remdupes", "dupes"]; }
    get category() { return "Queue Management"; }
    get checks() { return { voice: true, dispatcher: true, channel: true, vote: true, dj: true }; }
    run({ ctx: e }) { e.successMessage("⏱ Removing duplicates. Please wait..."); const s = []; let u = 0; e.dispatcher.queue.forEach(t => { s.includes(t.info.uri) ? (e.dispatcher.remove(t, true), u++) : s.push(t.info.uri, t); }), e.client.queue._sockets.find(s => s.serverId === e.guild.id) && e.client.queue._sockets.filter(s => s.serverId === e.guild.id).forEach(s => { e.client.queue.emitOp({ changes: ["NEXT_SONGS"], socketId: s.id, serverId: e.guild.id, queueData: { incoming: e.dispatcher.queue } }); }), e.successMessage(`I removed **${u}** duplicates songs`); }
}
exports.default = removeDupes;
