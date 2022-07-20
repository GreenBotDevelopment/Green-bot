"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const QuickCommand_1 = require("../../abstract/QuickCommand");
class giveDj extends QuickCommand_1.Command {
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
        return [{ name: "user", type: 6, description: "The user who you want to give the DJ", required: true }];
    }
    async run({ ctx: e }) {
        if (e.dispatcher.metadata.dj !== e.author.id)
            return e.errorMessage("You must be the DJ of the current queue to use this command");
        const r = await e.guild.getRESTMember(e.args[0]);
        if (!r || r.bot || r.id === e.author.id)
            return e.errorMessage("Please provide a valid user from this server.");
        (e.dispatcher.metadata.dj = r.id), e.successMessage(`The DJ of the queue is now ${r}`);
    }
}
exports.default = giveDj;
