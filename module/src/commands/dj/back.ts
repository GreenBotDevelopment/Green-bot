import { Command } from "../../abstract/QuickCommand";
export default class Skip extends Command {
    get name() {
        return "back";
    }
    get description() {
        return "Plays the previous track from your queue";
    }
    get aliases() {
        return ["b", "previous", "toggle-np"];
    }
    get category() {
        return "Queue Management";
    }
    get checks() {
        return { voice: true, dispatcher: true, channel: true };
    }
    run({ ctx: e }) {
        if (0 == e.dispatcher.previousTracks.length) return e.errorMessage("There is no previous track on your queue");
        e.dispatcher.queue.unshift(e.dispatcher.previousTracks[e.dispatcher.previousTracks.length - 1]),
            (e.dispatcher.previousTracks = e.dispatcher.previousTracks.filter((r) => r.info.uri !== e.dispatcher.previousTracks[e.dispatcher.previousTracks.length - 1].info.uri)),
            (e.dispatcher.backed = true),
            e.send("**⏪ *Now Playing the previous track from your queue!***👍"),
            e.dispatcher.skip();
    }
}
