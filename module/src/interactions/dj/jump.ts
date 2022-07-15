import { Command } from "../../abstract/QuickCommand";
export default class Jump extends Command {
    get name() {
        return "jump";
    }
    get description() {
        return "Jumps to a specific track in the queue";
    }
    get category() {
        return "Queue Management";
    }
    get aliases() {
        return ["j", "skipto"];
    }
    get arguments() {
        return [{ type: 3, name: "track", description: "The position of the track you want to jump to", required: true }];
    }
    get checks() {
        return { voice: true, dispatcher: true, channel: true, vote: true };
    }
    run({ ctx: e }) {
        let t = e.args[0].value.replace("#", "") - 1;
        const r = e.dispatcher.queue[t];
        if (!r) return e.errorMessage("There is no track with this number in your queue.");
        e.dispatcher.remove(t), e.dispatcher.queue.splice(0, 0, r), e.dispatcher.skip(), e.successMessage(`Jumping to [**${r.info.title}**](https://discord.gg/greenbot)`);
    }
}
