import { Command } from "../../abstract/QuickCommand";
export default class giveDj extends Command {
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
        return { voice: false, dispatcher: true,  };
    }
    get arguments() {
        return [{ name: "user", type: 6, description: "The user who you want to give the DJ", required: true }];
    }
   async run({ ctx: e }) {
        if (!e.member.permissions.has("manageGuild")) return e.errorMessage("You need to have manage message permissions to give the dj perms");
        const r = await e.guild.getRESTMember(e.args[0].value)

        if (!r || r.bot || r.id === e.author.id) return e.errorMessage("Please provide a valid user from this server.");
        (e.dispatcher.metadata.dj = r.id), e.successMessage(`The DJ of the queue is now ${r}`);
    }
}
