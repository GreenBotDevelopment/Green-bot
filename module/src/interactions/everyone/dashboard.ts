import {Command } from "../../abstract/QuickCommand"
export default class Play extends Command {
    get name() {
        return "dashboard";
    }
    get description() {
        return "gives the dashboard link";
    }
    get aliases(){
        return ["dash","web","panel","pannel"]
    }
    get category() {
        return "Everyone Commands";
    }
    run({ ctx: e }) {
     e.successMessage(`🆕 You can now manage the music easily from the [Dashboard](https://dash.green-bot.app/app/${e.guild.id})`)
    }
}
