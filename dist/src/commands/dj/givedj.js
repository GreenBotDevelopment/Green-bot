"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const QuickCommand_1 = require("../../abstract/QuickCommand");
class Queue extends QuickCommand_1.Command {
    get name() {
        return "givedj";
    }
    get description() {
        return "Gives the dj of the queue to another user";
    }
    get category() {
        return "Queue Management";
    }
    get checks() {
        return { voice: false, dispatcher: true, };
    }
    get arguments() {
        return [{ name: "user", description: "The user who you want to give the DJ", required: true }];
    }
    run({ ctx: e }) {
        if (!this.checkDJ(e))
            return e.errorMessage("You must be a DJ of the current queue to use this command");
        const r = e.message.mentions[0];
        if (!r || r.bot || r.id === e.author.id)
            return e.errorMessage("Please provide a valid user from this server.");
        (e.dispatcher.metadata.dj = r.id), e.successMessage(`The DJ of the queue is now <@${r.id}>`);
    }
    checkDJ(context) {
        let isDj = false;
        if (!context.guildDB.djroles || !context.guildDB.djroles.length)
            return true;
        if (context.member.roles.find(r => context.guildDB.djroles.includes(r)))
            isDj = true;
        if (context.member.permissions.has("manageGuild"))
            isDj = true;
        if (context.dispatcher && context.dispatcher.metadata.dj === context.member.id)
            isDj = true;
        return isDj;
    }
}
exports.default = Queue;
