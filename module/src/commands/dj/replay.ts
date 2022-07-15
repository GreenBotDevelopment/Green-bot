import { Command } from "../../abstract/QuickCommand";
export default class Volume extends Command {
    get name() {
        return "replay";
    }
    get aliases() {
        return ["restart"];
    }
    get description() {
        return "Replays the current song";
    }
    get category() {
        return "Queue Management";
    }
    get checks() {
        return { voice: true, dispatcher: true, channel: true };
    }
    run({ ctx: e }) {
        e.dispatcher.addTrack(e.dispatcher.current, e.author, "top"), e.successMessage(":cd: I will replay this song once it's ended!");
    }
}
