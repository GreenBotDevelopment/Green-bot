import { BaseEvent } from "../abstract/BaseEvent";

export default class Ready extends BaseEvent {
    constructor() {
        super({
            name: "guildMemberAdd",
            once: true
        })
    }

    async run(member, client) {
     
    }
}
