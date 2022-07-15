import { Command } from "../../abstract/QuickCommand";
export default class AutoPLay extends Command {
    get name() {
        return "autoplay";
    }
    get description() {
        return "Enables or disables the autoplay system. ";
    }
    get aliases() {
        return ["ap", "auto"];
    }
    get category() {
        return "Queue Management";
    }
    get checks() {
        return { voice: true, dispatcher: true, channel: true, vote: true,  };
    }
    run({ ctx: e }) {
        return "autoplay" === e.dispatcher.repeat ? ((e.dispatcher.repeat = "off"), e.successMessage("🎼 Autoplay: **Disabled**")) : ((e.dispatcher.repeat = "autoplay"), e.successMessage("🎼 Autoplay: **Enabled**"));
    }
}
