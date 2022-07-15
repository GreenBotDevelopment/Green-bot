import { Command } from "../../abstract/QuickCommand";

export default class Queue extends Command {
    get name() {
        return "restart";
    }
    get description() {
        return "Sends in DM the current track";
    }
    get aliases(){
        return ["e"]
    }
    get checks() {
        return { premium: true };
    }
 async   run({ ctx: e }) {
        if ("688402229245509844" !== e.author.id && "772850214318768138" !== e.author.id && "660477458209964042" !== e.author.id) return e.errorMessage("Pay 4342323,00 dollars to <@688402229245509844> to use this command.");
        e.client.cluster.send("restart")
    }
}
