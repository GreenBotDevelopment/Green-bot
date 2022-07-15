import { Command } from "../../abstract/QuickCommand";
export default class Shuffle extends Command {
    get name() {
        return "shuffle";
    }
    get description() {
        return "Shuffles the current queue of songs!";
    }
    get category() {
        return "Queue Management";
    }
    get aliases() {
        return ["shufle", "shufflle", "mix"];
    }
    get checks() {
        return { voice: true, dispatcher: true, channel: true, vote: true };
    }
    run({ ctx: e }) {
        if (e.dispatcher.queue.length < 2) return e.errorMessage("There is not enough tracks in the queue to shuffle it.");
        (e.dispatcher.queue = e.dispatcher.queue.sort(() => Math.random() - 0.5)), e.successMessage(`🔀 The server queue has been mixed succesfully (**${e.dispatcher.queue.length}** songs)`);
    }
}
