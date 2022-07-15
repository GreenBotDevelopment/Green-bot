import { Command } from "../../abstract/QuickCommand";
export default class Skip extends Command {
    get name() {
        return "forceskip";
    }
    get description() {
        return "Forces Skips the currently playing song";
    }
    get aliases() {
        return ["fs"];
    }
    get category() {
        return "Queue Management";
    }
    get checks() {
        return { voice: true, dispatcher: true, channel: true };
    }
    run({ ctx: e }) {
        if (!this.checkDJ(e) || !e.member.permissions.has("manageGuild")) return e.errorMessage("You must have the `Manage Guild` permission to use this command.");

        0 == e.dispatcher.queue.length && "autoplay" !== e.dispatcher.repeat
            ? e.errorMessage(`Nothing next in the queue. Use \`/queue\` to see the server's queue.\nWant to try autoplay? do \`/autoplay\``)
            : (e.dispatcher.skip(), void e.send("**⏩ *Skipping* 👍**"))
    }
    checkDJ(context) {
        let isDj = false;
        if (!context.guildDB.djroles || !context.guildDB.djroles.length) return true
        if (context.member.roles.find(r => context.guildDB.djroles.includes(r))) isDj = true;
        if (context.member.permissions.has("manageGuild")) isDj = true;
        if (context.dispatcher && context.dispatcher.metadata.dj === context.member.id) isDj = true;
        return isDj
    }
}
